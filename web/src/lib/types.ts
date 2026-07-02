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

export type { SeasonStatus, EventStatus } from "./dates";

export interface Season {
  _id: string;
  name: string;
  seasonNumber: number;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface EventListItem {
  _id: string;
  title: string;
  slug?: { current: string };
  eventDate: string;
  location: string;
  description?: string;
  featuredImage?: SanityImage;
  isCancelled?: boolean;
}

export interface EventResult {
  player: {
    _id: string;
    name: string;
    nickname?: string | null;
    pseudonym?: string | null;
    isAnonymised?: boolean;
  };
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

export interface EventDetail extends EventListItem {
  description?: string;
  registrationLink?: string;
  season?: { _id: string; name: string; seasonNumber: number } | null;
  results?: EventResult[];
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
  socialLinks?: SocialLinks;
}

// ── Loaner Decks ─────────────────────────────────────────────────────────────

export interface DeckCard {
  cardName: string;
  quantity: number;
  quantityOwned: number;
  isSideboard: boolean;
  imageUri?: string | null;
  imageUriBack?: string | null;
  typeLine?: string | null;
}

export interface LoanerDeckListItem {
  _id: string;
  name: string;
  slug: { current: string };
  featuredCardImageUri?: string | null;
  cards: DeckCard[];
  isComplete: boolean;
}

export interface LoanerDeckDetail extends LoanerDeckListItem {
  primer?: unknown[];
  donors?: string[];
}
