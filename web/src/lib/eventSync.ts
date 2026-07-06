import { createClient } from "@sanity/client";
import { aggregateSeason, type SeasonStageInput } from "./seasonScoring";

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

// Maps an event's results array into the shared scoring module's stage shape.
function toStageResults(results: SanityEventResult[]) {
  return results.map((r) => ({
    playerRef: r.player._ref,
    wins: r.wins,
    draws: r.draws,
    losses: r.losses,
    omwPercentage: r.omwPercentage,
    gwPercentage: r.gwPercentage,
    ogwPercentage: r.ogwPercentage,
  }));
}

async function syncSeasonStandings(
  seasonId: string,
  currentEventId: string,
  currentEventDate: string,
  currentEventResults: SanityEventResult[],
) {
  const otherEvents: { _id: string; eventDate: string; results?: SanityEventResult[] }[] =
    await writeClient.fetch(
      `*[_type == "event" && season._ref == $seasonId && _id != $currentEventId && defined(results)]{ _id, eventDate, results }`,
      { seasonId, currentEventId }
    );

  const stages: SeasonStageInput[] = [
    ...otherEvents.map((e) => ({
      eventId: e._id,
      eventDate: e.eventDate,
      results: toStageResults(e.results ?? []),
    })),
    {
      eventId: currentEventId,
      eventDate: currentEventDate,
      results: toStageResults(currentEventResults),
    },
  ];

  // Live running total: no drop. The final "drop worst two" table is computed
  // at read time (data.ts getStandings) once the season's end date passes.
  const totals = aggregateSeason(stages, { dropWorstTwo: false });
  const byPlayer = new Map(totals.map((t) => [t.playerRef, t]));

  const existing: { _id: string; playerRef: string }[] = await writeClient.fetch(
    `*[_type == "playerSeasonStats" && season._ref == $seasonId && !(_id in path("drafts.**"))]{ _id, "playerRef": player._ref }`,
    { seasonId }
  );
  const remainingExisting = new Set(existing.map((e) => e.playerRef));

  // Dots in a Sanity document ID mark it as a path (draft-like) document,
  // invisible to the "published" perspective the public site queries with —
  // so the deterministic ID must join with hyphens, never dots.
  const canonicalId = (playerRef: string) => `playerSeasonStats-${seasonId}-${playerRef}`;

  const tx = writeClient.transaction();
  for (const [playerRef, acc] of byPlayer) {
    const docId = canonicalId(playerRef);
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
        ...(acc.omwPercentage != null ? { omwPercentage: acc.omwPercentage } : {}),
        ...(acc.gwPercentage != null ? { gwPercentage: acc.gwPercentage } : {}),
        ...(acc.ogwPercentage != null ? { ogwPercentage: acc.ogwPercentage } : {}),
      })
    );
    remainingExisting.delete(playerRef);
  }

  // Remove stale docs: players with zero remaining results for the season
  // (e.g. their only event's results were deleted), and any doc under a
  // non-canonical ID (e.g. the earlier dot-joined IDs, or manually created
  // duplicates) — the canonical doc created above supersedes it.
  for (const doc of existing) {
    if (remainingExisting.has(doc.playerRef) || doc._id !== canonicalId(doc.playerRef)) {
      tx.delete(doc._id);
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
    await syncSeasonStandings(event.season._ref, event._id, event.eventDate, event.results ?? []);
  }
}
