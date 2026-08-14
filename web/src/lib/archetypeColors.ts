// Slice colors are assigned by position within a chart's sorted archetype
// list, using the golden-angle hue rotation (a standard trick for spreading
// N arbitrary categorical colors around the wheel with minimal clustering,
// since consecutive hues 137.5° apart never re-converge). Lightness and
// saturation also cycle on a short period so hue-adjacent slices (which can
// still land close together for larger N) stay visually separable. This
// trades cross-chart color stability (the same archetype can get a
// different color on the event page vs. the season page, since ranking
// differs) for maximum distinctness within whichever chart is on screen.

const GOLDEN_ANGLE = 137.50776;
const BASE_HUE = 205;
const LIGHTNESS_CYCLE = [46, 60, 36];
const SATURATION_CYCLE = [65, 55, 75];

export const UNASSIGNED_COLOR = "#a8a8ae";

export function getColorForIndex(index: number): string {
  const hue = (BASE_HUE + index * GOLDEN_ANGLE) % 360;
  const lightness = LIGHTNESS_CYCLE[index % LIGHTNESS_CYCLE.length];
  const saturation = SATURATION_CYCLE[index % SATURATION_CYCLE.length];
  return `hsl(${hue.toFixed(1)}, ${saturation}%, ${lightness}%)`;
}
