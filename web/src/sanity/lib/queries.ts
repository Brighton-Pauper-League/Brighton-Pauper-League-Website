import { defineQuery } from 'next-sanity'

// ── Seasons ──────────────────────────────────────────────────────────────────

export const ALL_SEASONS_QUERY = defineQuery(`
  *[_type == "season"] | order(seasonNumber desc) {
    _id,
    name,
    seasonNumber,
    startDate,
    endDate,
    status,
    description
  }
`)

export const PAST_SEASONS_QUERY = defineQuery(`
  *[_type == "season" && endDate < $today] | order(seasonNumber desc) {
    _id,
    name,
    seasonNumber,
    startDate,
    endDate,
    status,
    description
  }
`)

export const ACTIVE_SEASON_QUERY = defineQuery(`
  *[_type == "season" && startDate <= $today && endDate >= $today]
    | order(seasonNumber desc) [0] {
    _id,
    name,
    seasonNumber,
    startDate,
    endDate,
    status,
    description
  }
`)

export const SEASON_BY_NUMBER_QUERY = defineQuery(`
  *[_type == "season" && seasonNumber == $seasonNumber][0] {
    _id,
    name,
    seasonNumber,
    startDate,
    endDate,
    status,
    description
  }
`)

// ── Standings ─────────────────────────────────────────────────────────────────

export const STANDINGS_BY_SEASON_QUERY = defineQuery(`
  *[_type == "playerSeasonStats" && season._ref == $seasonId] {
    _id,
    player-> {
      _id,
      name,
      nickname,
      pseudonym,
      isAnonymised,
      isActive
    },
    matchesPlayed,
    wins,
    draws,
    losses,
    points,
    omwPercentage,
    gwPercentage,
    ogwPercentage
  }
`)

// ── Events ────────────────────────────────────────────────────────────────────

export const UPCOMING_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && status != "cancelled" && dateTime(eventDate) >= dateTime(now())]
    | order(eventDate asc) [0...$limit] {
    _id,
    title,
    slug,
    eventDate,
    location,
    description,
    featuredImage,
    status
  }
`)

export const ALL_EVENTS_QUERY = defineQuery(`
  *[_type == "event"] | order(eventDate desc) {
    _id,
    title,
    slug,
    eventDate,
    location,
    description,
    featuredImage,
    status
  }
`)

export const PAST_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && dateTime(eventDate) < dateTime(now())]
    | order(eventDate desc) {
    _id,
    title,
    slug,
    eventDate,
    location,
    description,
    featuredImage,
    status
  }
`)

export const EVENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    eventDate,
    location,
    description,
    featuredImage,
    status,
    registrationLink,
    season-> {
      _id,
      name,
      seasonNumber
    },
    results[] {
      player-> {
        _id,
        name,
        nickname,
        pseudonym,
        isAnonymised
      },
      wins,
      draws,
      losses,
      points
    }
  }
`)

export const EVENT_SLUGS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)].slug.current
`)

// ── Players ───────────────────────────────────────────────────────────────────

export const PUBLIC_PLAYERS_QUERY = defineQuery(`
  *[_type == "player" && isPublic == true] | order(name asc) {
    _id,
    name,
    nickname,
    pseudonym,
    isAnonymised,
    isActive,
    slug,
    image,
    bio
  }
`)

export const PLAYER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "player" && slug.current == $slug][0] {
    _id,
    name,
    nickname,
    pseudonym,
    isAnonymised,
    isActive,
    slug,
    image,
    bio,
    joinDate
  }
`)

export const PLAYER_SLUGS_QUERY = defineQuery(`
  *[_type == "player" && isPublic == true && defined(slug.current)].slug.current
`)

// ── Posts ─────────────────────────────────────────────────────────────────────

export const ALL_POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    featuredImage,
    tags,
    featured
  }
`)

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    author,
    publishedAt,
    excerpt,
    featuredImage,
    tags,
    featured,
    body
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`)

// ── Site Settings ─────────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    siteName,
    siteDescription,
    logo,
    socialLinks,
    contactEmail
  }
`)
