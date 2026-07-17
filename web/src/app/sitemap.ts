import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import {
  getIndexablePostSlugs,
  getIndexablePlayerSlugs,
  getIndexableEventSlugs,
  getIndexableLoanerDeckSlugs,
  getAllSeasons,
} from "@/lib/data";

const staticRoutes = [
  "",
  "/about",
  "/how-it-works",
  "/events",
  "/events/past",
  "/blog",
  "/standings",
  "/players",
  "/loaner-decks",
  "/resources",
  "/code-of-conduct",
  "/privacy",
  "/volunteer",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, playerSlugs, eventSlugs, deckSlugs, seasons] =
    await Promise.all([
      getIndexablePostSlugs(),
      getIndexablePlayerSlugs(),
      getIndexableEventSlugs(),
      getIndexableLoanerDeckSlugs(),
      getAllSeasons(),
    ]);

  const static_: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = postSlugs.map((slug) => ({
    url: `${siteUrl}/blog/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const players: MetadataRoute.Sitemap = playerSlugs.map((slug) => ({
    url: `${siteUrl}/players/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const events: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${siteUrl}/events/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const decks: MetadataRoute.Sitemap = deckSlugs.map((slug) => ({
    url: `${siteUrl}/loaner-decks/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const standingsArchive: MetadataRoute.Sitemap = seasons.map((season) => ({
    url: `${siteUrl}/standings/${season.seasonNumber}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...static_,
    ...posts,
    ...players,
    ...events,
    ...decks,
    ...standingsArchive,
  ];
}
