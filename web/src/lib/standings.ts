export interface StandingsPlayer {
  _id: string
  name: string
  nickname?: string | null
  pseudonym?: string | null
  isAnonymised?: boolean
  isActive?: boolean
  isPublic?: boolean
  slug?: { current?: string | null } | null
}

export interface StandingsRow {
  _id: string
  player: StandingsPlayer
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  points: number
  omwPercentage: number | null
  gwPercentage: number | null
  ogwPercentage: number | null
}

/** Returns the name that should appear in standings and all public-facing displays. */
export function playerDisplayName(player: StandingsPlayer): string {
  if (player.isAnonymised && player.pseudonym) return player.pseudonym
  return player.nickname ?? player.name
}

/**
 * Returns the player's profile page path, or null when no link should be shown:
 * the player is hidden from public pages, has no slug, or is anonymised
 * (the slug is derived from the real name, so linking would defeat the pseudonym).
 */
export function playerProfilePath(player: StandingsPlayer): string | null {
  if (player.isPublic === false || player.isAnonymised) return null
  const slug = player.slug?.current
  return slug ? `/players/${slug}` : null
}

/**
 * Sorts standings rows using the standard MTG tiebreaker hierarchy:
 * 1. Match Points (descending)
 * 2. OMW% — Opponent Match Win % (descending)
 * 3. GW%  — Game Win % (descending)
 * 4. OGW% — Opponent Game Win % (descending)
 *
 * Null tiebreaker values sort to the bottom within each tier.
 */
export function sortStandings(rows: StandingsRow[]): StandingsRow[] {
  return [...rows].sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points

    // 2. OMW%
    const omwA = a.omwPercentage ?? -1
    const omwB = b.omwPercentage ?? -1
    if (omwB !== omwA) return omwB - omwA

    // 3. GW%
    const gwA = a.gwPercentage ?? -1
    const gwB = b.gwPercentage ?? -1
    if (gwB !== gwA) return gwB - gwA

    // 4. OGW%
    const ogwA = a.ogwPercentage ?? -1
    const ogwB = b.ogwPercentage ?? -1
    if (ogwB !== ogwA) return ogwB - ogwA

    // Final fallback: alphabetical by player name
    return a.player.name.localeCompare(b.player.name)
  })
}

/**
 * Returns today's date as a YYYY-MM-DD string, used as the $today
 * parameter in ACTIVE_SEASON_QUERY.
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}
