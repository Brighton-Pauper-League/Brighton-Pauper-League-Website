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
    description,
    winner-> {
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
`)

// Every non-cancelled event in a season, oldest first. Used to build the
// numbered "stage" list in the season sidebar (Stage 1 = earliest event).
export const SEASON_EVENTS_QUERY = defineQuery(`
  *[_type == "event" && season._ref == $seasonId && isCancelled != true]
    | order(eventDate asc) {
    _id,
    title,
    "slug": slug.current,
    eventDate
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
    },
    seo
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
    joinDate,
    seo
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
    body,
    seo
  }
`)

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)].slug.current
`)

// ── Site Settings ─────────────────────────────────────────────────────────────

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    socialLinks,
    seo
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
    introText,
    deckPrimer,
    donors,
    seo
  }
`)

export const LOANER_DECK_SLUGS_QUERY = defineQuery(`
  *[_type == "loanerDeck" && isHidden != true && defined(slug.current)].slug.current
`)

// ── Resources ─────────────────────────────────────────────────────────────────

// The reader chooses the sort order on the page, so this returns everything in a
// stable order (title) and lets the client re-sort. `_createdAt` is projected so
// the "newest/oldest" options have something to sort on without a schema field.
export const RESOURCES_QUERY = defineQuery(`
  *[_type == "resource"] | order(title asc) {
    _id,
    title,
    url,
    description,
    tags,
    _createdAt
  }
`)

// ── Sitemap ───────────────────────────────────────────────────────────────────

// Slug queries scoped to what belongs in the sitemap: pages an editor has hidden
// from search (seo.hideFromSearch) are excluded, so the sitemap never advertises
// a URL whose page carries a noindex tag. These stay separate from the plain
// *_SLUGS_QUERY above, which feed generateStaticParams and must still build the
// hidden pages so they remain reachable by direct link.
export const INDEXABLE_POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current) && seo.hideFromSearch != true].slug.current
`)

export const INDEXABLE_PLAYER_SLUGS_QUERY = defineQuery(`
  *[_type == "player" && isPublic == true && isAnonymised != true && defined(slug.current) && seo.hideFromSearch != true].slug.current
`)

export const INDEXABLE_EVENT_SLUGS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current) && seo.hideFromSearch != true].slug.current
`)

export const INDEXABLE_LOANER_DECK_SLUGS_QUERY = defineQuery(`
  *[_type == "loanerDeck" && isHidden != true && defined(slug.current) && seo.hideFromSearch != true].slug.current
`)
