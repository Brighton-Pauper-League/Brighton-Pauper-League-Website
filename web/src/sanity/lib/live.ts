import { defineLive } from "next-sanity/live";
import { client } from "./client";

// NOTE: Only the server-side `serverToken` is configured. We deliberately do
// NOT set a `browserToken`, because a Sanity read token is a secret credential
// and any value exposed via a NEXT_PUBLIC_* env var is bundled into the
// client-side JS for anyone to read. Live updates for published content work
// without a browser token; draft/preview content is fetched server-side using
// `serverToken`.
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: "2025-02-01",
  }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
});
