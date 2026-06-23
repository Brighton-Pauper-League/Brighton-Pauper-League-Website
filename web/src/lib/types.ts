import type { StandingsRow } from "./standings";

export type { StandingsRow };

/** A Sanity image field (asset reference + optional alt). Accepted by `urlFor`. */
export interface SanityImage {
  _type?: string;
  asset?: { _ref: string; _type?: string };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export type SeasonStatus = "upcoming" | "active" | "completed";

export interface Season {
  _id: string;
  name: string;
  seasonNumber: number;
  startDate: string;
  endDate: string;
  status: SeasonStatus;
  description?: string;
}

export type EventStatus = "upcoming" | "in-progress" | "completed" | "cancelled";

export interface EventListItem {
  _id: string;
  title: string;
  slug?: { current: string };
  eventDate: string;
  location: string;
  description?: string;
  featuredImage?: SanityImage;
  status: EventStatus;
}

export interface PostListItem {
  _id: string;
  title: string;
  slug: { current: string };
  author: string;
  publishedAt: string;
  excerpt?: string;
  featuredImage?: SanityImage;
  tags?: string[];
  featured?: boolean;
}

export interface Post extends PostListItem {
  // Portable Text blocks — rendered by PortableTextBody.
  body?: unknown[];
}

export interface PlayerCard {
  _id: string;
  name: string;
  nickname?: string | null;
  pseudonym?: string | null;
  isAnonymised?: boolean;
  isActive: boolean;
  slug?: { current: string };
  image?: SanityImage;
  bio?: string;
}

export interface PlayerProfile extends PlayerCard {
  joinDate?: string;
}

export interface SocialLinks {
  instagram?: string;
  youtube?: string;
  discord?: string;
  facebook?: string;
}

export interface SiteSettings {
  siteName?: string;
  siteDescription?: string;
  logo?: SanityImage;
  socialLinks?: SocialLinks;
  contactEmail?: string;
}
