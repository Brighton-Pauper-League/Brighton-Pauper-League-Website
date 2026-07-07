import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { getPostSlugs, getPlayerSlugs, getAllSeasons } from "@/lib/data";

const staticRoutes = [
  "",
  "/about",
  "/how-it-works",
  "/events",
  "/blog",
  "/standings",
  "/players",
  "/loaner-decks",
  "/code-of-conduct",
  "/privacy",
  "/volunteer",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [postSlugs, playerSlugs, seasons] = await Promise.all([
    getPostSlugs(),
    getPlayerSlugs(),
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

  const standingsArchive: MetadataRoute.Sitemap = seasons.map((season) => ({
    url: `${siteUrl}/standings/${season.seasonNumber}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...static_, ...posts, ...players, ...standingsArchive];
}
