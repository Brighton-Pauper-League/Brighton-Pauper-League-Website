import type { Metadata } from "next";
import { siteUrl } from "./site";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImage, SeoFields } from "./types";

export type { SeoFields };

// Single source of truth for page metadata.
//
// Every page builds its metadata through `buildMetadata` rather than hand-writing
// a Metadata object. That is what keeps canonical URLs, Open Graph and Twitter
// cards consistent as pages are added later: a new page supplies a title, a
// description and its path, and gets the rest for free.
//
// `siteUrl` stays in ./site so robots/sitemap can import it without pulling in
// the Sanity image builder.

export const siteConfig = {
  name: "Brighton Pauper League",
  shortName: "BPL",
  description:
    "Accessible, community-led Pauper Magic — open to everyone, run by players, for players.",
  tagline: "The home of Magic: The Gathering Pauper in Brighton, Sussex UK.",
  locale: "en_GB",
  keywords: [
    "Pauper",
    "Magic: The Gathering",
    "MTG",
    "Brighton",
    "league",
    "Dice Saloon",
    "competitive Pauper",
  ],
  // Brand colours, mirrored from the --color-* tokens in app/globals.css.
  // Duplicated rather than imported because the OG renderer and the web app
  // manifest cannot read Tailwind's CSS custom properties.
  colors: {
    primaryBlue: "#004aad",
    secondaryYellow: "#e7a802",
    darkBrown: "#371e22",
    offWhite: "#fcfbfa",
  },
} as const;

export interface BuildMetadataOptions {
  /** Page title, slotted into the `%s | Brighton Pauper League` template. Omit on the home page. */
  title?: string;
  description?: string;
  /** Root-relative path, e.g. "/resources". Becomes the canonical URL. */
  path?: string;
  /** Absolute share image URL. Omit to let the route's opengraph-image.tsx supply one. */
  image?: string;
  imageAlt?: string;
  /** Open Graph type. "article" for blog posts, "website" otherwise. */
  type?: "website" | "article";
  noIndex?: boolean;
  /** Article-only Open Graph fields, ignored for type "website". */
  publishedTime?: string;
  authors?: string[];
}

/**
 * Builds a complete Metadata object: canonical URL, Open Graph and Twitter card,
 * falling back to the site defaults for anything omitted.
 *
 * Note on images: when `image` is undefined we deliberately leave `openGraph.images`
 * unset rather than defaulting to the logo. Next's cascading `opengraph-image.tsx`
 * convention then fills the gap with the generated branded card — including for
 * pages that do not exist yet. Setting an explicit image here would suppress it.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  image,
  imageAlt,
  type = "website",
  noIndex = false,
  publishedTime,
  authors,
}: BuildMetadataOptions = {}): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const ogTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const images = image ? [{ url: image, alt: imageAlt ?? ogTitle }] : undefined;

  return {
    title,
    description,
    alternates: { canonical },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type,
      siteName: siteConfig.name,
      title: ogTitle,
      description,
      url: `${siteUrl}${canonical}`,
      locale: siteConfig.locale,
      images,
      ...(type === "article" ? { publishedTime, authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/**
 * Merges a document's optional `seo` object over defaults derived from its own
 * content, so a document with an untouched SEO field behaves exactly as it did
 * before the field existed.
 */
export function resolveSeo(
  seo: SeoFields | undefined,
  fallbacks: BuildMetadataOptions & { fallbackImage?: SanityImage | null }
): BuildMetadataOptions {
  const { fallbackImage, ...rest } = fallbacks;
  const chosenImage = seo?.shareImage?.asset ? seo.shareImage : fallbackImage;

  return {
    ...rest,
    title: seo?.metaTitle || rest.title,
    description: seo?.metaDescription || rest.description,
    image: chosenImage?.asset ? ogImageUrl(chosenImage) : rest.image,
    noIndex: seo?.hideFromSearch || rest.noIndex,
  };
}

/** Renders a Sanity image at the 1200x630 Open Graph aspect ratio. */
export function ogImageUrl(source: SanityImage): string {
  return urlFor(source).width(1200).height(630).fit("crop").url();
}
