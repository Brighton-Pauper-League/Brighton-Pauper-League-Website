import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

// Enables Next.js Draft Mode so editors can preview unpublished Sanity content.
// Paired with the Presentation tool / `previewUrl.previewMode.enable` in Studio.
// Uses the server-only read token so draft documents can be fetched.
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
