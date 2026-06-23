import { sanityFetch } from "@/sanity/lib/live";
import {
  ACTIVE_SEASON_QUERY,
  ALL_EVENTS_QUERY,
  ALL_POSTS_QUERY,
  ALL_SEASONS_QUERY,
  PAST_SEASONS_QUERY,
  PLAYER_BY_SLUG_QUERY,
  PLAYER_SLUGS_QUERY,
  POST_BY_SLUG_QUERY,
  POST_SLUGS_QUERY,
  PUBLIC_PLAYERS_QUERY,
  SEASON_BY_NUMBER_QUERY,
  SITE_SETTINGS_QUERY,
  STANDINGS_BY_SEASON_QUERY,
  UPCOMING_EVENTS_QUERY,
} from "@/sanity/lib/queries";
import { getTodayString } from "./standings";
import type {
  EventListItem,
  PlayerCard,
  PlayerProfile,
  Post,
  PostListItem,
  Season,
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

// ── Standings ──────────────────────────────────────────────────────────────

export async function getStandings(seasonId: string): Promise<StandingsRow[]> {
  const { data } = await sanityFetch({
    query: STANDINGS_BY_SEASON_QUERY,
    params: { seasonId },
  });
  return (data as StandingsRow[] | null) ?? [];
}

// ── Events ───────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(limit = 3): Promise<EventListItem[]> {
  const { data } = await sanityFetch({
    query: UPCOMING_EVENTS_QUERY,
    params: { limit },
  });
  return (data as EventListItem[] | null) ?? [];
}

export async function getAllEvents(): Promise<EventListItem[]> {
  const { data } = await sanityFetch({ query: ALL_EVENTS_QUERY });
  return (data as EventListItem[] | null) ?? [];
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
  const { data } = await sanityFetch({ query: POST_SLUGS_QUERY });
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
  const { data } = await sanityFetch({ query: PLAYER_SLUGS_QUERY });
  return (data as string[] | null) ?? [];
}

// ── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
  return (data as SiteSettings | null) ?? null;
}
