// Shared season scoring, used by two callers:
//   1. eventSync.ts (write path) — aggregates the raw running total that is
//      denormalised into playerSeasonStats and shown live during a season.
//   2. data.ts getStandings (read path) — for a completed season, recomputes
//      the final table with each player's best N stage results kept, where N
//      comes from keptStageCount().
//
// Keeping the maths in one pure module means the live total and the final
// trimmed total can never drift apart on the parts they share (points = 3W+D,
// how percentages are averaged, etc.).

/**
 * How many of a player's best stage results count towards a completed season's
 * final table.
 *
 * Season 1 ran 8 stages and dropped each player's worst two (so its best 6 were
 * kept). That result is settled, so it is preserved exactly. Season 2 onwards
 * keep the best 7 stages. Expressed as a count of kept results, not dropped
 * ones, so the rule still reads sensibly as the number of stages changes.
 */
export function keptStageCount(seasonNumber: number | null | undefined): number {
  return seasonNumber === 1 ? 6 : 7
}

export interface StageResultInput {
  playerRef: string
  wins: number
  draws: number
  losses: number
  omwPercentage?: number | null
  gwPercentage?: number | null
  ogwPercentage?: number | null
}

/** One stage = one event night, with the per-player results entered for it. */
export interface SeasonStageInput {
  eventId: string
  /** ISO date; used only to break ties deterministically when dropping stages. */
  eventDate: string
  results: StageResultInput[]
}

export interface PlayerSeasonTotals {
  playerRef: string
  matchesPlayed: number
  wins: number
  draws: number
  losses: number
  points: number
  omwPercentage: number | null
  gwPercentage: number | null
  ogwPercentage: number | null
}

/** 3 points for a win, 1 for a draw — never a field admins enter. */
export function resultPoints(r: Pick<StageResultInput, 'wins' | 'draws'>): number {
  return r.wins * 3 + r.draws
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

// A single stage's contribution to one player. `attended` is false for a
// derived zero (an event the player has no results row in) — those never feed
// the tiebreaker averages.
interface StageEntry {
  points: number
  wins: number
  draws: number
  losses: number
  omwPercentage: number | null
  gwPercentage: number | null
  ogwPercentage: number | null
  attended: boolean
  eventDate: string
}

function attendedEntry(r: StageResultInput, eventDate: string): StageEntry {
  return {
    points: resultPoints(r),
    wins: r.wins,
    draws: r.draws,
    losses: r.losses,
    omwPercentage: r.omwPercentage ?? null,
    gwPercentage: r.gwPercentage ?? null,
    ogwPercentage: r.ogwPercentage ?? null,
    attended: true,
    eventDate,
  }
}

function missedEntry(eventDate: string): StageEntry {
  return {
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    omwPercentage: null,
    gwPercentage: null,
    ogwPercentage: null,
    attended: false,
    eventDate,
  }
}

function averageOf(values: number[]): number | null {
  if (values.length === 0) return null
  const sum = values.reduce((a, b) => a + b, 0)
  return round2(sum / values.length)
}

/**
 * Aggregates a season's stages into per-player totals.
 *
 * - `keepBest: null` — the raw running total: sum every result row,
 *   average each percentage over the rows that carry it. Behaviour matches the
 *   pre-existing eventSync aggregation exactly.
 * - `keepBest: N` — the final table: every player gets an entry for every
 *   stage (a derived 0 where they have no row), then only their N
 *   highest-scoring stages are kept before totalling. Ties on the cut-off
 *   value are broken by earliest event date so the result is deterministic.
 *   If a player has N or fewer entries, all of them are kept, so a season with
 *   fewer than N stages does not lose any results.
 */
export function aggregateSeason(
  stages: SeasonStageInput[],
  options: { keepBest: number | null },
): PlayerSeasonTotals[] {
  const entriesByPlayer = new Map<string, StageEntry[]>()
  const pushEntry = (playerRef: string, entry: StageEntry) => {
    const list = entriesByPlayer.get(playerRef) ?? []
    list.push(entry)
    entriesByPlayer.set(playerRef, list)
  }

  // Attended entries, one per result row.
  for (const stage of stages) {
    for (const r of stage.results) {
      pushEntry(r.playerRef, attendedEntry(r, stage.eventDate))
    }
  }

  // Full-slate padding: charge every known player a 0 for every stage they did
  // not appear in. Only relevant to the keep-best path.
  if (options.keepBest !== null) {
    for (const stage of stages) {
      const present = new Set(stage.results.map((r) => r.playerRef))
      for (const playerRef of entriesByPlayer.keys()) {
        if (!present.has(playerRef)) {
          pushEntry(playerRef, missedEntry(stage.eventDate))
        }
      }
    }
  }

  const totals: PlayerSeasonTotals[] = []
  for (const [playerRef, entries] of entriesByPlayer) {
    let kept = entries
    if (options.keepBest !== null) {
      // Drop whatever exceeds the kept count; always keep at least one stage.
      const dropCount = Math.max(0, entries.length - Math.max(1, options.keepBest))
      const ordered = [...entries].sort(
        (a, b) => a.points - b.points || a.eventDate.localeCompare(b.eventDate),
      )
      kept = ordered.slice(dropCount)
    }

    const attended = kept.filter((e) => e.attended)
    totals.push({
      playerRef,
      matchesPlayed: kept.reduce((n, e) => n + e.wins + e.draws + e.losses, 0),
      wins: kept.reduce((n, e) => n + e.wins, 0),
      draws: kept.reduce((n, e) => n + e.draws, 0),
      losses: kept.reduce((n, e) => n + e.losses, 0),
      points: kept.reduce((n, e) => n + e.points, 0),
      omwPercentage: averageOf(
        attended.flatMap((e) => (e.omwPercentage != null ? [e.omwPercentage] : [])),
      ),
      gwPercentage: averageOf(
        attended.flatMap((e) => (e.gwPercentage != null ? [e.gwPercentage] : [])),
      ),
      ogwPercentage: averageOf(
        attended.flatMap((e) => (e.ogwPercentage != null ? [e.ogwPercentage] : [])),
      ),
    })
  }

  return totals
}
