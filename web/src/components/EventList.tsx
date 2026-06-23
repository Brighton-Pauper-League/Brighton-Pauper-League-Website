import type { EventListItem } from "@/lib/types";
import { EventCard } from "./EventCard";
import { EmptyState } from "./EmptyState";

// Renders a stack of event cards, falling back to an empty state. Reused for the
// homepage "Upcoming Events" preview and the full /events page.
export function EventList({
  events,
  emptyMessage = "No events scheduled right now — check back soon.",
}: {
  events: EventListItem[];
  emptyMessage?: string;
}) {
  if (events.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
}
