import { defineLive } from "next-sanity/live";
import { client } from "./client";

// NOTE: Only the server-side `serverToken` is configured. We deliberately do
// NOT set a `browserToken`, because a Sanity read token is a secret credential
// and any value exposed via a NEXT_PUBLIC_* env var is bundled into the
// client-side JS for anyone to read. Live updates for published content work
// without a browser token; draft/preview content is fetched server-side using
// `serverToken`.
// The apiVersion is part of the request URL and therefore of Next's data-cache
// key. Bumping it (2025-02-01 → 2026-05-15, matching the rest of the codebase)
// abandoned a set of stale immortal cache entries created before fetches
// carried the shared "sanity" tag below — those entries had revalidate: false
// and no tag the revalidation webhook could name, and Vercel persists the
// fetch cache across deployments, so they survived every deploy.
const { sanityFetch: baseSanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "2026-05-15",
  }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
});

export { SanityLive };

// Every fetch carries a shared "sanity" cache tag so the /api/revalidate
// webhook can expire the data cache with a single revalidateTag call.
// Without it, only the per-query sync tags exist, and those are expired
// solely by the <SanityLive /> browser event stream — server-rendered pages
// would otherwise keep serving stale query results after a publish, since
// revalidatePath clears the route cache but not tagged data-cache entries.
export const sanityFetch: typeof baseSanityFetch = (options) =>
  baseSanityFetch({ ...options, tags: ["sanity", ...(options.tags ?? [])] });
