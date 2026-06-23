// Date formatting helpers. The league is Brighton-based, so everything is
// rendered in UK locale and the Europe/London timezone for consistency
// regardless of where the page is rendered (server, edge, or build).

const TZ = "Europe/London";
const LOCALE = "en-GB";

/** Day-number + short month for the square date badge on event cards. */
export function getDateBadge(iso: string): { day: string; month: string } {
  const date = new Date(iso);
  return {
    day: new Intl.DateTimeFormat(LOCALE, { day: "numeric", timeZone: TZ }).format(date),
    month: new Intl.DateTimeFormat(LOCALE, { month: "short", timeZone: TZ })
      .format(date)
      .toUpperCase(),
  };
}

/** e.g. "Tuesday 6:45pm" — weekday + time, as shown on event cards. */
export function formatEventDateTime(iso: string): string {
  const date = new Date(iso);
  const weekday = new Intl.DateTimeFormat(LOCALE, { weekday: "long", timeZone: TZ }).format(date);
  const time = new Intl.DateTimeFormat(LOCALE, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TZ,
  })
    .format(date)
    .replace(/\s/g, "")
    .toLowerCase();
  return `${weekday} ${time}`;
}

/** e.g. "20 June 2026" — long date for blog posts and season ranges. */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(iso));
}

/** e.g. "Jan 2026 – Apr 2026" — a season's date range. */
export function formatSeasonRange(startIso: string, endIso: string): string {
  const fmt = (iso: string) =>
    new Intl.DateTimeFormat(LOCALE, { month: "short", year: "numeric", timeZone: TZ }).format(
      new Date(iso),
    );
  return `${fmt(startIso)} – ${fmt(endIso)}`;
}
