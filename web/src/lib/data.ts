import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import {
  ACTIVE_SEASON_QUERY,
  ALL_EVENTS_QUERY,
  EVENT_BY_SLUG_QUERY,
  EVENT_SLUGS_QUERY,
  PAST_EVENTS_QUERY,
  ALL_POSTS_QUERY,
  ALL_SEASONS_QUERY,
  PAST_SEASONS_QUERY,
  PLAYER_BY_SLUG_QUERY,
  PLAYER_SLUGS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  PUBLIC_PLAYERS_QUERY,
  SEASON_BY_NUMBER_QUERY,
  SEASON_EVENTS_QUERY,
  SEASON_END_DATE_QUERY,
  COMPLETED_SEASON_EVENTS_QUERY,
  SITE_SETTINGS_QUERY,
  STANDINGS_BY_SEASON_QUERY,
  UPCOMING_EVENTS_QUERY,
  LOANER_DECKS_QUERY,
  LOANER_DECK_BY_SLUG_QUERY,
  LOANER_DECK_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import { getTodayString, type StandingsPlayer } from "./standings";
import { aggregateSeason, type SeasonStageInput } from "./seasonScoring";
import type {
  EventDetail,
  EventListItem,
  LoanerDeckDetail,
  LoanerDeckListItem,
  PlayerCard,
  PlayerProfile,
  Post,
  PostListItem,
  Season,
  SeasonStage,
  SiteSettings,
  StandingsRow,
} from "./types";

// Centralized data-access layer. Every page/component reads through these
// helpers rather than calling `sanityFetch` directly, so query wiring lives in
// one place and the rest of the app deals only in typed domain objects.
//
// Typegen isn't set up, so `sanityFetch` returns `unknown`; each helper asserts
// the shape declared by its corresponding GROQ projection.

// ── Seasons ────────────────────────────────────────────────────────────────

export async function getActiveSeason(): Promise<Season | null> {
  const { data } = await sanityFetch({
    query: ACTIVE_SEASON_QUERY,
    params: { today: getTodayString() },
  });
  return (data as Season | null) ?? null;
}

export async function getAllSeasons(): Promise<Season[]> {
  const { data } = await sanityFetch({ query: ALL_SEASONS_QUERY });
  return (data as Season[] | null) ?? [];
}

export async function getPastSeasons(): Promise<Season[]> {
  const { data } = await sanityFetch({
    query: PAST_SEASONS_QUERY,
    params: { today: getTodayString() },
  });
  return (data as Season[] | null) ?? [];
}

export async function getSeasonByNumber(seasonNumber: number): Promise<Season | null> {
  const { data } = await sanityFetch({
    query: SEASON_BY_NUMBER_QUERY,
    params: { seasonNumber },
  });
  return (data as Season | null) ?? null;
}

// The season's events, oldest first — rendered as the numbered stage list.
export async function getSeasonEvents(seasonId: string): Promise<SeasonStage[]> {
  const { data } = await sanityFetch({
    query: SEASON_EVENTS_QUERY,
    params: { seasonId },
  });
  return (data as SeasonStage[] | null) ?? [];
}

// ── Standings ──────────────────────────────────────────────────────────────

interface CompletedSeasonEventResult {
  wins: number;
  draws: number;
  losses: number;
  omwPercentage?: number | null;
  gwPercentage?: number | null;
  ogwPercentage?: number | null;
  player: StandingsPlayer | null;
}

interface CompletedSeasonEvent {
  _id: string;
  eventDate: string;
  results?: CompletedSeasonEventResult[];
}

/**
 * Standings for a season.
 *
 * While a season is running (today on or before its end date) this returns the
 * live running total denormalised into playerSeasonStats by eventSync. Once the
 * season has ended it recomputes the final table from the raw event results with
 * the "drop worst two results" rule applied (see seasonScoring.aggregateSeason).
 */
export async function getStandings(seasonId: string): Promise<StandingsRow[]> {
  const { data: endDate } = await sanityFetch({
    query: SEASON_END_DATE_QUERY,
    params: { seasonId },
  });
  const seasonEndDate = endDate as string | null;

  if (!seasonEndDate || getTodayString() <= seasonEndDate) {
    const { data } = await sanityFetch({
      query: STANDINGS_BY_SEASON_QUERY,
      params: { seasonId },
    });
    return (data as StandingsRow[] | null) ?? [];
  }

  const { data } = await sanityFetch({
    query: COMPLETED_SEASON_EVENTS_QUERY,
    params: { seasonId },
  });
  return computeFinalStandings(seasonId, (data as CompletedSeasonEvent[] | null) ?? []);
}

/** Builds the dropped final standings rows from a completed season's events. */
function computeFinalStandings(
  seasonId: string,
  events: CompletedSeasonEvent[],
): StandingsRow[] {
  const playersByRef = new Map<string, StandingsPlayer>();
  const stages: SeasonStageInput[] = events.map((event) => ({
    eventId: event._id,
    eventDate: event.eventDate,
    results: (event.results ?? [])
      .filter((r): r is CompletedSeasonEventResult & { player: StandingsPlayer } =>
        Boolean(r.player?._id),
      )
      .map((r) => {
        playersByRef.set(r.player._id, r.player);
        return {
          playerRef: r.player._id,
          wins: r.wins,
          draws: r.draws,
          losses: r.losses,
          omwPercentage: r.omwPercentage,
          gwPercentage: r.gwPercentage,
          ogwPercentage: r.ogwPercentage,
        };
      }),
  }));

  return aggregateSeason(stages, { dropWorstTwo: true }).flatMap((t) => {
    const player = playersByRef.get(t.playerRef);
    if (!player) return [];
    return [
      {
        _id: `playerSeasonStats-${seasonId}-${t.playerRef}`,
        player,
        matchesPlayed: t.matchesPlayed,
        wins: t.wins,
        draws: t.draws,
        losses: t.losses,
        points: t.points,
        omwPercentage: t.omwPercentage,
        gwPercentage: t.gwPercentage,
        ogwPercentage: t.ogwPercentage,
      },
    ];
  });
}

// ── Events ───────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(limit = 3): Promise<EventListItem[]> {
  const { data } = await sanityFetch({
    query: UPCOMING_EVENTS_QUERY,
    params: { limit, today: getTodayString() },
  });
  return (data as EventListItem[] | null) ?? [];
}

export async function getAllEvents(): Promise<EventListItem[]> {
  const { data } = await sanityFetch({ query: ALL_EVENTS_QUERY });
  return (data as EventListItem[] | null) ?? [];
}

export async function getPastEvents(): Promise<EventListItem[]> {
  const { data } = await sanityFetch({
    query: PAST_EVENTS_QUERY,
    params: { today: getTodayString() },
  });
  return (data as EventListItem[] | null) ?? [];
}

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  const { data } = await sanityFetch({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug },
  });
  return (data as EventDetail | null) ?? null;
}

export async function getEventSlugs(): Promise<string[]> {
  const data = await client.fetch(EVENT_SLUGS_QUERY);
  return (data as string[] | null) ?? [];
}

// ── Posts ──────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<PostListItem[]> {
  const { data } = await sanityFetch({ query: ALL_POSTS_QUERY });
  return (data as PostListItem[] | null) ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data } = await sanityFetch({
    query: POST_BY_SLUG_QUERY,
    params: { slug },
  });
  return (data as Post | null) ?? null;
}

export async function getPostSlugs(): Promise<string[]> {
  const data = await client.fetch(POST_SLUGS_QUERY);
  return (data as string[] | null) ?? [];
}

// ── Players ───────────────────────────────────────────────────────────────────

export async function getPublicPlayers(): Promise<PlayerCard[]> {
  const { data } = await sanityFetch({ query: PUBLIC_PLAYERS_QUERY });
  return (data as PlayerCard[] | null) ?? [];
}

export async function getPlayerBySlug(slug: string): Promise<PlayerProfile | null> {
  const { data } = await sanityFetch({
    query: PLAYER_BY_SLUG_QUERY,
    params: { slug },
  });
  return (data as PlayerProfile | null) ?? null;
}

export async function getPlayerSlugs(): Promise<string[]> {
  const data = await client.fetch(PLAYER_SLUGS_QUERY);
  return (data as string[] | null) ?? [];
}

// ── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  return (data as SiteSettings | null) ?? null;
}

// ── Loaner Decks ─────────────────────────────────────────────────────────────

export async function getLoanerDecks(): Promise<LoanerDeckListItem[]> {
  const { data } = await sanityFetch({ query: LOANER_DECKS_QUERY });
  return (data as LoanerDeckListItem[] | null) ?? [];
}

export async function getLoanerDeckBySlug(slug: string): Promise<LoanerDeckDetail | null> {
  const { data } = await sanityFetch({
    query: LOANER_DECK_BY_SLUG_QUERY,
    params: { slug },
  });
  return (data as LoanerDeckDetail | null) ?? null;
}

export async function getLoanerDeckSlugs(): Promise<string[]> {
  const data = await client.fetch(LOANER_DECK_SLUGS_QUERY);
  return (data as string[] | null) ?? [];
}
