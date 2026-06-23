import type { EventStatus } from "@/lib/types";

// Maps an event's status to a labelled, colour-coded pill. Single source of
// truth for status presentation across event cards and lists.
const STATUS_STYLES: Record<EventStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-secondary-yellow text-dark-brown" },
  "in-progress": { label: "Live", className: "bg-primary-blue text-white" },
  completed: { label: "Completed", className: "bg-sage-green text-dark-brown" },
  cancelled: { label: "Cancelled", className: "bg-red-placeholder text-white" },
};

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.upcoming;
  return (
    <span
      className={`px-3 py-1 rounded font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs uppercase whitespace-nowrap ${style.className}`}
    >
      {style.label}
    </span>
  );
}
