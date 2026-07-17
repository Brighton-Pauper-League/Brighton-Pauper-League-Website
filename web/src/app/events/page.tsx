import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventList } from "@/components/EventList";
import { getUpcomingEvents } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Events",
  description:
    "Upcoming league nights, casual evenings, and events for the Brighton Pauper League.",
  path: "/events",
});

export default async function EventsPage() {
  const upcoming = await getUpcomingEvents(20);

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-16">
          <header className="flex flex-col gap-4">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-dark-brown leading-none">
              Events
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
              League nights, casual evenings, and special events hosted by Brighton Pauper League.
            </p>
          </header>

          <section className="flex flex-col gap-8">
            <h2 className="font-(family-name:--font-young-serif) text-4xl text-primary-blue">
              Upcoming
            </h2>
            <EventList
              events={upcoming}
              emptyMessage="No upcoming events scheduled yet — check back soon."
            />
          </section>

          <div className="border-t border-black/10 pt-8">
            <Link
              href="/events/past"
              className="font-(family-name:--font-bricolage-grotesque) font-semibold text-lg text-primary-blue border-b-2 border-primary-blue pb-1 hover:text-darker-blue hover:border-darker-blue transition-colors"
            >
              View past events →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
