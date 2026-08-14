// Real archetype data rarely has the `colors` (WUBRG) field populated, even
// when the name implies one (e.g. "Grixis Affinity", "Boros Tribe"), so
// slice colors are assigned per distinct archetype instead: a deterministic
// hash of the archetype's id picks a hue, kept at a fixed saturation/
// lightness for legibility. Same archetype -> same color everywhere (event
// and season charts alike), without depending on data entry in Studio.

const UNASSIGNED_COLOR = "#b0b0b6";
const SATURATION = 62;
const LIGHTNESS = 46;

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Deterministically derives a display color for an archetype from a stable
 * key (its `_id`), or a neutral grey for the "no archetype recorded" bucket.
 */
export function getArchetypeColor(key: string | null | undefined): string {
  if (!key) return UNASSIGNED_COLOR;
  const hue = hashString(key) % 360;
  return `hsl(${hue}, ${SATURATION}%, ${LIGHTNESS}%)`;
}
