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

export type SeasonStatus = "upcoming" | "active" | "completed";

/** Derives a season's status from today's date rather than a manually-set field. */
export function getSeasonStatus(startDate: string, endDate: string, today = new Date()): SeasonStatus {
  const todayStr = today.toISOString().slice(0, 10);
  if (todayStr < startDate) return "upcoming";
  if (todayStr > endDate) return "completed";
  return "active";
}

export type EventStatus = "upcoming" | "in-progress" | "completed" | "cancelled";

// League nights run for a few hours — treat an event as "in progress" for this
// long after its start time before it's considered completed.
const EVENT_DURATION_MS = 4 * 60 * 60 * 1000;

/** Derives an event's status from its date (and a manual cancellation flag) rather than a stored field. */
export function getEventStatus(eventDate: string, isCancelled?: boolean, now = new Date()): EventStatus {
  if (isCancelled) return "cancelled";
  const start = new Date(eventDate).getTime();
  const nowMs = now.getTime();
  if (nowMs < start) return "upcoming";
  if (nowMs < start + EVENT_DURATION_MS) return "in-progress";
  return "completed";
}
