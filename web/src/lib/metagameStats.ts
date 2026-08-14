import { getColorForIndex, UNASSIGNED_COLOR } from "./archetypeColors";
import type { ArchetypeRef } from "./types";

interface MetagameResult {
  archetype?: ArchetypeRef | null;
  wins: number;
  draws: number;
  losses: number;
  omwPercentage?: number | null;
  gwPercentage?: number | null;
  ogwPercentage?: number | null;
}

export interface MetagameRow {
  key: string;
  name: string;
  color: string;
  entries: number;
  metagamePercentage: number;
  top8Count: number;
  top8Percentage: number;
  wins: number;
  // Top 8 % minus Metagame % — positive means the archetype makes Top 8 more
  // often than its metagame share alone would predict.
  conversionDeltaPp: number;
}

const UNASSIGNED_KEY = "unassigned";
const UNASSIGNED_NAME = "No archetype recorded";

function points(r: MetagameResult): number {
  return r.wins * 3 + r.draws;
}

// Ranks a single event's own results by the standard MTG tiebreak order
// (Points → OMW% → GW% → OGW%), the same hierarchy used for season
// standings, but applied within one event rather than cumulatively.
function rankEventResults<T extends MetagameResult>(results: T[]): T[] {
  return [...results].sort((a, b) => {
    const byPoints = points(b) - points(a);
    if (byPoints) return byPoints;
    const omwA = a.omwPercentage ?? -1;
    const omwB = b.omwPercentage ?? -1;
    if (omwB !== omwA) return omwB - omwA;
    const gwA = a.gwPercentage ?? -1;
    const gwB = b.gwPercentage ?? -1;
    if (gwB !== gwA) return gwB - gwA;
    return (b.ogwPercentage ?? -1) - (a.ogwPercentage ?? -1);
  });
}

/**
 * Builds a per-archetype metagame breakdown across every event passed in:
 * entries (how many decks of this archetype were played), Top 8 appearances
 * (summed across each event's own top-8 finishers), total wins, and the
 * Top 8% vs Metagame% conversion delta.
 */
export function computeMetagameTable(
  events: Array<{ results?: MetagameResult[] | null }>,
): MetagameRow[] {
  const buckets = new Map<
    string,
    { name: string; entries: number; top8: number; wins: number }
  >();

  for (const event of events) {
    const results = event.results ?? [];
    if (results.length === 0) continue;

    for (const result of results) {
      const key = result.archetype?._id ?? UNASSIGNED_KEY;
      const existing = buckets.get(key);
      if (existing) {
        existing.entries += 1;
        existing.wins += result.wins;
      } else {
        buckets.set(key, {
          name: result.archetype?.name ?? UNASSIGNED_NAME,
          entries: 1,
          top8: 0,
          wins: result.wins,
        });
      }
    }

    const top8 = rankEventResults(results).slice(0, 8);
    for (const result of top8) {
      const key = result.archetype?._id ?? UNASSIGNED_KEY;
      const bucket = buckets.get(key);
      if (bucket) bucket.top8 += 1;
    }
  }

  const totalEntries = Array.from(buckets.values()).reduce((sum, b) => sum + b.entries, 0);
  const totalTop8Slots = Array.from(buckets.values()).reduce((sum, b) => sum + b.top8, 0);

  const sorted = Array.from(buckets.entries())
    .map(([key, { name, entries, top8, wins }]) => {
      const metagamePercentage = totalEntries > 0 ? (entries / totalEntries) * 100 : 0;
      const top8Percentage = totalTop8Slots > 0 ? (top8 / totalTop8Slots) * 100 : 0;
      return {
        key,
        name,
        entries,
        metagamePercentage,
        top8Count: top8,
        top8Percentage,
        wins,
        conversionDeltaPp: top8Percentage - metagamePercentage,
      };
    })
    .sort((a, b) => b.entries - a.entries);

  let colorIndex = 0;
  return sorted.map((row) => ({
    ...row,
    color: row.key === UNASSIGNED_KEY ? UNASSIGNED_COLOR : getColorForIndex(colorIndex++),
  }));
}
