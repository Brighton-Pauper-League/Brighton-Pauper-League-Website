import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EventList } from "@/components/EventList";
import { getAllEvents } from "@/lib/data";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming league nights, casual evenings, and events for the Brighton Pauper League.",
};

export default async function EventsPage() {
  const events = await getAllEvents();
  const now = Date.now();

  // getAllEvents is newest-first; upcoming reads best oldest-first.
  const upcoming = events
    .filter((e) => e.status !== "cancelled" && new Date(e.eventDate).getTime() >= now)
    .reverse();
  const past = events.filter((e) => new Date(e.eventDate).getTime() < now);

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

          {past.length > 0 && (
            <section className="flex flex-col gap-8">
              <h2 className="font-(family-name:--font-young-serif) text-4xl text-dark-brown/70">
                Past Events
              </h2>
              <EventList events={past} />
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
