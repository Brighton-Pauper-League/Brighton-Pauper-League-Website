import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventStatusBadge } from "@/components/EventStatusBadge";
import { getEventBySlug, getEventSlugs } from "@/lib/data";
import { playerDisplayName } from "@/lib/standings";
import { urlFor } from "@/sanity/lib/image";
import { formatLongDate, formatEventDateTime, getEventStatus } from "@/lib/dates";

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event not found" };

  const ogImage = event.featuredImage?.asset
    ? urlFor(event.featuredImage).width(1200).height(630).fit("crop").url()
    : undefined;

  return {
    title: event.title,
    description: event.description ?? `${event.title} — Brighton Pauper League`,
    openGraph: {
      title: event.title,
      description: event.description ?? undefined,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const heroUrl = event.featuredImage?.asset
    ? urlFor(event.featuredImage).width(1600).height(800).fit("crop").url()
    : null;

  const isPast = new Date(event.eventDate).getTime() < Date.now();

  return (
    <>
      <Navbar />
      <main className="bg-off-white min-h-[60vh]">

        {/* Hero image or colour block */}
        {heroUrl ? (
          <div className="relative w-full h-64 md:h-96 lg:h-[480px]">
            <Image
              src={heroUrl}
              alt={event.featuredImage?.alt || event.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-primary-blue/40" />
          </div>
        ) : (
          <div className="w-full h-32 bg-primary-blue" />
        )}

        <div className="px-6 md:px-12 lg:px-20 py-12 md:py-20">
          <div className="max-w-360 mx-auto flex flex-col gap-10">
            <Link
              href="/events"
              className="font-(family-name:--font-bricolage-grotesque) text-base text-primary-blue hover:text-darker-blue transition-colors w-fit"
            >
              ← Back to events
            </Link>

            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

              {/* Main content */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="flex flex-wrap items-center gap-3">
                  <EventStatusBadge status={getEventStatus(event.eventDate, event.isCancelled)} />
                  {event.season && (
                    <Link
                      href={`/standings/${event.season.seasonNumber}`}
                      className="font-(family-name:--font-bricolage-grotesque) text-sm text-primary-blue border border-primary-blue/30 rounded-full px-3 py-1 hover:bg-primary-blue/5 transition-colors"
                    >
                      {event.season.name}
                    </Link>
                  )}
                </div>

                <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-5xl lg:text-[64px] text-dark-brown leading-none">
                  {event.title}
                </h1>

                <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black/60">
                  {formatEventDateTime(event.eventDate)} · {event.location}
                </p>

                {event.description && (
                  <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black/70 leading-relaxed max-w-prose">
                    {event.description}
                  </p>
                )}

                {!isPast && event.registrationLink && (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-secondary-yellow text-dark-brown font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-[#d09602] transition-colors w-fit"
                  >
                    Register / Info →
                  </a>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-black/5">
                  <div className="flex flex-col gap-1">
                    <span className="font-(family-name:--font-bricolage-grotesque) text-xs text-black/40 uppercase font-semibold">Date</span>
                    <span className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown">{formatLongDate(event.eventDate)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-(family-name:--font-bricolage-grotesque) text-xs text-black/40 uppercase font-semibold">Location</span>
                    <span className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown">{event.location}</span>
                  </div>
                  {event.season && (
                    <div className="flex flex-col gap-1">
                      <span className="font-(family-name:--font-bricolage-grotesque) text-xs text-black/40 uppercase font-semibold">Season</span>
                      <span className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown">{event.season.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Results table */}
            {event.results && event.results.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="font-(family-name:--font-young-serif) text-3xl text-dark-brown">
                  Results
                </h2>
                <div className="bg-white rounded-2xl overflow-x-auto border border-black/5">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-primary-blue/10">
                        <th className="px-4 py-3 text-left font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase">Player</th>
                        <th className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase">W</th>
                        <th className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase">D</th>
                        <th className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase">L</th>
                        <th className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...event.results]
                        .sort((a, b) => b.points - a.points)
                        .map((result, i) => (
                          <tr key={i} className="border-t border-black/5">
                            <td className="px-4 py-3 font-(family-name:--font-bricolage-grotesque) text-dark-brown">
                              {playerDisplayName(result.player)}
                            </td>
                            <td className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) text-dark-brown">{result.wins}</td>
                            <td className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) text-dark-brown">{result.draws}</td>
                            <td className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) text-dark-brown">{result.losses}</td>
                            <td className="px-4 py-3 text-right font-(family-name:--font-bricolage-grotesque) font-bold text-primary-blue">{result.points}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
