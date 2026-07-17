import { siteUrl } from "./site";
import { siteConfig, ogImageUrl } from "./seo";
import type { EventDetail, SocialLinks } from "./types";

// Structured-data builders. These return plain JSON-LD objects; the <JsonLd>
// component serialises them into a script tag. Kept out of seo.ts because that
// module is specifically the Next `Metadata` builder — this is a separate SEO
// surface (schema.org) that search engines and AI read alongside the meta tags.

type JsonLdObject = Record<string, unknown>;

/**
 * Site-wide Organization entity, rendered once from the root layout. `sameAs`
 * links Google to the league's social profiles when they are configured in
 * Sanity; omitted entirely when none are set rather than emitting an empty array.
 */
export function organizationJsonLd(socialLinks?: SocialLinks): JsonLdObject {
  const sameAs = [
    socialLinks?.instagram,
    socialLinks?.youtube,
    socialLinks?.discord,
    socialLinks?.facebook,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: siteConfig.name,
    alternateName: siteConfig.shortName,
    url: siteUrl,
    logo: `${siteUrl}/logo.webp`,
    description: siteConfig.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * Event entity for a single event night. Location is modelled as a Place; the
 * league runs at a fixed venue so the string is enough without a full address.
 * A cancelled event is marked with the schema.org eventStatus so it renders
 * correctly in search results rather than looking live.
 */
export function eventJsonLd(event: EventDetail, path: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.eventDate,
    eventStatus: event.isCancelled
      ? "https://schema.org/EventCancelled"
      : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${siteUrl}${path}`,
    ...(event.description ? { description: event.description } : {}),
    ...(event.location
      ? { location: { "@type": "Place", name: event.location } }
      : {}),
    ...(event.featuredImage?.asset
      ? { image: ogImageUrl(event.featuredImage) }
      : {}),
    organizer: {
      "@type": "SportsOrganization",
      name: siteConfig.name,
      url: siteUrl,
    },
  };
}
