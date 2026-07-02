import { createClient } from "@sanity/client";

// Runs on every "event" document publish, triggered from the shared
// /api/revalidate webhook (Sanity's free plan caps webhooks at two, both
// already in use, so this piggybacks on the existing all-document-types
// revalidation hook rather than needing a dedicated one).
//
// Two responsibilities: (1) derive the event's slug from its title + date,
// since admins no longer enter one manually, and (2) aggregate this event's
// results — together with every other event in the same season — into
// playerSeasonStats, since that's the only thing the standings page and the
// Studio's Player Season Stats list actually read.

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

interface SanityEventResult {
  _key: string;
  player: { _ref: string };
  wins: number;
  draws: number;
  losses: number;
  omwPercentage?: number | null;
  gwPercentage?: number | null;
  ogwPercentage?: number | null;
}

// 3 points for a win, 1 for a draw — not a field admins enter.
function resultPoints(r: Pick<SanityEventResult, "wins" | "draws">): number {
  return r.wins * 3 + r.draws;
}

interface SanityEvent {
  _id: string;
  title: string;
  eventDate: string;
  slug?: { current: string } | null;
  season?: { _ref: string } | null;
  results?: SanityEventResult[];
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

async function computeUniqueSlug(eventId: string, title: string, eventDate: string): Promise<string> {
  const base = `${slugify(title)}-${eventDate.slice(0, 10)}`.slice(0, 96);
  let candidate = base;
  let suffix = 2;
  // Loop guards against two events sharing the same title and date.
  while (
    await writeClient.fetch(
      `*[_type == "event" && slug.current == $slug && _id != $eventId][0]._id`,
      { slug: candidate, eventId }
    )
  ) {
    candidate = `${base}-${suffix}`.slice(0, 96);
    suffix += 1;
  }
  return candidate;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface PlayerAccumulator {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  omwSum: number;
  omwCount: number;
  gwSum: number;
  gwCount: number;
  ogwSum: number;
  ogwCount: number;
}

function emptyAccumulator(): PlayerAccumulator {
  return { matchesPlayed: 0, wins: 0, draws: 0, losses: 0, points: 0, omwSum: 0, omwCount: 0, gwSum: 0, gwCount: 0, ogwSum: 0, ogwCount: 0 };
}

async function syncSeasonStandings(seasonId: string, currentEventId: string, currentEventResults: SanityEventResult[]) {
  const otherEvents: { results?: SanityEventResult[] }[] = await writeClient.fetch(
    `*[_type == "event" && season._ref == $seasonId && _id != $currentEventId && defined(results)]{ results }`,
    { seasonId, currentEventId }
  );

  const allResults = [...otherEvents.flatMap((e) => e.results ?? []), ...currentEventResults];

  const byPlayer = new Map<string, PlayerAccumulator>();
  for (const r of allResults) {
    const key = r.player._ref;
    const acc = byPlayer.get(key) ?? emptyAccumulator();
    acc.matchesPlayed += r.wins + r.draws + r.losses;
    acc.wins += r.wins;
    acc.draws += r.draws;
    acc.losses += r.losses;
    acc.points += resultPoints(r);
    if (r.omwPercentage != null) {
      acc.omwSum += r.omwPercentage;
      acc.omwCount += 1;
    }
    if (r.gwPercentage != null) {
      acc.gwSum += r.gwPercentage;
      acc.gwCount += 1;
    }
    if (r.ogwPercentage != null) {
      acc.ogwSum += r.ogwPercentage;
      acc.ogwCount += 1;
    }
    byPlayer.set(key, acc);
  }

  const existing: { _id: string; playerRef: string }[] = await writeClient.fetch(
    `*[_type == "playerSeasonStats" && season._ref == $seasonId]{ _id, "playerRef": player._ref }`,
    { seasonId }
  );
  const remainingExisting = new Set(existing.map((e) => e.playerRef));

  const tx = writeClient.transaction();
  for (const [playerRef, acc] of byPlayer) {
    const docId = `playerSeasonStats.${seasonId}.${playerRef}`;
    tx.createIfNotExists({
      _id: docId,
      _type: "playerSeasonStats",
      season: { _type: "reference", _ref: seasonId },
      player: { _type: "reference", _ref: playerRef },
      matchesPlayed: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      points: 0,
    });
    tx.patch(docId, (p) =>
      p.set({
        season: { _type: "reference", _ref: seasonId },
        player: { _type: "reference", _ref: playerRef },
        matchesPlayed: acc.matchesPlayed,
        wins: acc.wins,
        draws: acc.draws,
        losses: acc.losses,
        points: acc.points,
        ...(acc.omwCount ? { omwPercentage: round2(acc.omwSum / acc.omwCount) } : {}),
        ...(acc.gwCount ? { gwPercentage: round2(acc.gwSum / acc.gwCount) } : {}),
        ...(acc.ogwCount ? { ogwPercentage: round2(acc.ogwSum / acc.ogwCount) } : {}),
      })
    );
    remainingExisting.delete(playerRef);
  }

  // Players who had stats before but now have zero results for the season
  // (e.g. their only event's results were deleted) — remove the stale doc.
  for (const orphan of existing) {
    if (remainingExisting.has(orphan.playerRef)) {
      tx.delete(orphan._id);
    }
  }

  await tx.commit();
}

/** Auto-generates the slug and syncs season standings for a published event. No-op for anything else. */
export async function syncEventOnPublish(eventId: string): Promise<void> {
  const event: SanityEvent | null = await writeClient.fetch(
    `*[_id == $id][0]{ _id, title, eventDate, slug, season, results[]{ _key, player, wins, draws, losses, omwPercentage, gwPercentage, ogwPercentage } }`,
    { id: eventId }
  );

  if (!event) return;

  const desiredSlug = await computeUniqueSlug(event._id, event.title, event.eventDate);
  if (event.slug?.current !== desiredSlug) {
    await writeClient
      .patch(event._id)
      .set({ slug: { _type: "slug", current: desiredSlug } })
      .commit();
  }

  if (event.season?._ref) {
    await syncSeasonStandings(event.season._ref, event._id, event.results ?? []);
  }
}
