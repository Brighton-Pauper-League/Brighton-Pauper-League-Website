import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventList } from "@/components/EventList";
import { getPastEvents } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Past Events",
  description: "A history of Brighton Pauper League nights and events.",
  path: "/events/past",
});

export default async function PastEventsPage() {
  const events = await getPastEvents();

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <Link
              href="/events"
              className="font-(family-name:--font-bricolage-grotesque) text-base text-primary-blue hover:text-darker-blue transition-colors w-fit"
            >
              ← Back to events
            </Link>
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-dark-brown leading-none">
              Past Events
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
              A history of league nights and events.
            </p>
          </div>

          <EventList
            events={events}
            emptyMessage="No past events yet."
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
