import Link from "next/link";
import { getDateBadge, formatEventDateTime } from "@/lib/dates";
import type { EventListItem } from "@/lib/types";
import { EventStatusBadge } from "./EventStatusBadge";

export function EventCard({ event }: { event: EventListItem }) {
  const { day, month } = getDateBadge(event.eventDate);
  const slug = event.slug?.current;

  const inner = (
    <div className="bg-white p-6 sm:p-8 rounded-2xl flex gap-4 sm:gap-8 items-center hover:shadow-md transition-shadow">
      <div className="w-20 h-20 flex flex-col items-center justify-center bg-primary-blue/10 rounded-xl flex-shrink-0">
        <span className="font-(family-name:--font-bricolage-grotesque) font-bold text-3xl text-primary-blue">
          {day}
        </span>
        <span className="font-(family-name:--font-bricolage-grotesque) text-xs text-primary-blue uppercase">
          {month}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-(family-name:--font-young-serif) text-xl sm:text-2xl text-dark-brown mb-2 group-hover:text-primary-blue transition-colors">
          {event.title}
        </h3>
        <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/60">
          {formatEventDateTime(event.eventDate)} • {event.location}
        </p>
      </div>

      <EventStatusBadge status={event.status} />
    </div>
  );

  if (!slug) return inner;

  return (
    <Link href={`/events/${slug}`} className="group block">
      {inner}
    </Link>
  );
}

export default EventCard;
