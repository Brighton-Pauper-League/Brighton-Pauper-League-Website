/**
 * Canonical, absolute base URL for the site. Used for metadata, Open Graph,
 * sitemap, and robots. Override per-environment with NEXT_PUBLIC_SITE_URL
 * (e.g. a Vercel preview URL); falls back to the production domain.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://brightonpauperleague.com"
).replace(/\/$/, "");
