// Cookie-consent helpers shared by the consent UI and the Google Analytics
// loader. Consent is stored in a first-party functional cookie so it can be read
// both server-side (to set the correct Consent Mode default on first paint) and
// client-side (by the banner/preferences UI).

export const CONSENT_COOKIE = "bpl-consent";
const CONSENT_VERSION = 1;
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // ~180 days

/** GA4 Measurement ID. Overridable per-environment; falls back to the league's property. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-NHBSLZLKW2";

export interface ConsentState {
  /** Whether the visitor has consented to analytics (Google Analytics). */
  analytics: boolean;
}

interface StoredConsent extends ConsentState {
  v: number;
}

/**
 * Parses a raw cookie value into a consent decision, or null when there is no
 * (valid) decision yet. Works with any cookie string, so it is safe to call on
 * the server with a value read from `next/headers` `cookies()`.
 */
export function parseConsent(raw: string | undefined | null): ConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<StoredConsent>;
    if (typeof parsed?.analytics !== "boolean") return null;
    return { analytics: parsed.analytics };
  } catch {
    return null;
  }
}

/** Reads the current consent decision from `document.cookie` (client only). */
export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsent(match?.slice(CONSENT_COOKIE.length + 1));
}

/** Persists a consent decision to the first-party cookie (client only). */
export function writeConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(
    JSON.stringify({ v: CONSENT_VERSION, analytics: state.analytics } satisfies StoredConsent),
  );
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Deletes Google Analytics cookies (`_ga`, `_ga_*`, `_gid`) when analytics
 * consent is withdrawn. GA cookies are set on the registrable domain, so clear
 * them for both the exact host and the parent domain.
 */
export function deleteGaCookies(): void {
  if (typeof document === "undefined") return;
  const names = document.cookie
    .split("; ")
    .map((row) => row.split("=")[0])
    .filter((name) => name === "_gid" || name === "_ga" || name.startsWith("_ga_"));

  const host = window.location.hostname;
  const parentDomain = host.replace(/^www\./, "");
  const domains = [undefined, host, `.${host}`, `.${parentDomain}`];

  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}
