import { defineQuery } from 'next-sanity'

// ── Seasons ──────────────────────────────────────────────────────────────────

export const ALL_SEASONS_QUERY = defineQuery(`
  *[_type == "season"] | order(seasonNumber desc) {
    _id,
    name,
    seasonNumber,
    startDate,
    endDate,
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
      isActive,
      isPublic,
      slug
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

// Just the season's end date, used to decide whether standings should show the
// live running total or the final "drop worst two" table.
export const SEASON_END_DATE_QUERY = defineQuery(`
  *[_type == "season" && _id == $seasonId][0].endDate
`)

// Every non-cancelled event in a season that has results entered — the raw
// per-stage material for computing the final dropped standings at read time.
// The player projection mirrors STANDINGS_BY_SEASON_QUERY so rows are identical.
export const COMPLETED_SEASON_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && season._ref == $seasonId && isCancelled != true && defined(results)] {
    _id,
    eventDate,
    results[] {
      wins,
      draws,
      losses,
      omwPercentage,
      gwPercentage,
      ogwPercentage,
      player-> {
        _id,
        name,
        nickname,
        pseudonym,
        isAnonymised,
        isActive,
        isPublic,
        slug
      }
    }
  }
`)

// ── Events ────────────────────────────────────────────────────────────────────

export const UPCOMING_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && isCancelled != true && dateTime(eventDate) >= dateTime($today + "T00:00:00Z")]
    | order(eventDate asc) [0...$limit] {
    _id,
    title,
    slug,
    eventDate,
    location,
    description,
    featuredImage,
    isCancelled
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
    isCancelled
  }
`)

export const PAST_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && dateTime(eventDate) < dateTime($today + "T00:00:00Z")]
    | order(eventDate desc) {
    _id,
    title,
    slug,
    eventDate,
    location,
    description,
    featuredImage,
    isCancelled
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
    isCancelled,
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
      "points": wins * 3 + draws
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
  *[_type == "player" && slug.current == $slug && isPublic == true && isAnonymised != true][0] {
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
  *[_type == "player" && isPublic == true && isAnonymised != true && defined(slug.current)].slug.current
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
    socialLinks
  }
`)

// ── Loaner Decks ──────────────────────────────────────────────────────────────

export const LOANER_DECKS_QUERY = defineQuery(`
  *[_type == "loanerDeck" && isHidden != true] | order(name asc) {
    _id,
    name,
    slug,
    featuredCardImageUri,
    cards[]{ cardName, quantity, quantityOwned, isSideboard },
    "isComplete": !defined(cards[quantityOwned < quantity][0])
  }
`)

export const LOANER_DECK_BY_SLUG_QUERY = defineQuery(`
  *[_type == "loanerDeck" && slug.current == $slug && isHidden != true][0] {
    _id,
    name,
    slug,
    featuredCardImageUri,
    cards[]{ cardName, quantity, quantityOwned, isSideboard, imageUri, imageUriBack, typeLine },
    "isComplete": !defined(cards[quantityOwned < quantity][0]),
    primer,
    donors
  }
`)

export const LOANER_DECK_SLUGS_QUERY = defineQuery(`
  *[_type == "loanerDeck" && isHidden != true && defined(slug.current)].slug.current
`)
