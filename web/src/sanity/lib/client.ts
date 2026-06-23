import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "sdzciglo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-05-15",
  useCdn: true, // Use CDN for fast responses, except in Draft Mode
  stega: {
    enabled: process.env.NODE_ENV === "development",
    studioUrl:
      process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || "http://localhost:3333",
  },
});
