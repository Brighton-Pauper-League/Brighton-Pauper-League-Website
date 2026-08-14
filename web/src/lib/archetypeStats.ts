import { getArchetypeColor } from "./archetypeColors";
import type { ArchetypeRef } from "./types";

export interface ArchetypeCount {
  key: string;
  name: string;
  color: string;
  count: number;
  percentage: number;
}

const UNASSIGNED_KEY = "unassigned";
const UNASSIGNED_NAME = "No archetype recorded";

export function countArchetypes(
  results: Array<{ archetype?: ArchetypeRef | null }>,
): ArchetypeCount[] {
  const counts = new Map<string, { name: string; count: number }>();

  for (const result of results) {
    const archetype = result.archetype;
    const key = archetype?._id ?? UNASSIGNED_KEY;
    const existing = counts.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(key, {
        name: archetype?.name ?? UNASSIGNED_NAME,
        count: 1,
      });
    }
  }

  const total = results.length;

  return Array.from(counts.entries())
    .map(([key, { name, count }]) => ({
      key,
      name,
      color: getArchetypeColor(key === UNASSIGNED_KEY ? null : key),
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);
}
