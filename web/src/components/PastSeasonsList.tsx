import Link from "next/link";
import type { Season } from "@/lib/types";
import { formatSeasonRange } from "@/lib/dates";

// Compact list of seasons linking to their archived standings. Used in the
// homepage standings sidebar and the /standings sidebar.
export function PastSeasonsList({ seasons }: { seasons: Season[] }) {
  if (seasons.length === 0) {
    return (
      <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/60">
        No past seasons yet — this is the first one.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {seasons.map((season) => (
        <Link
          key={season._id}
          href={`/standings/${season.seasonNumber}`}
          className="group flex flex-col"
        >
          <span className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown group-hover:text-primary-blue transition-colors">
            {season.name} →
          </span>
          <span className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/60">
            {formatSeasonRange(season.startDate, season.endDate)}
          </span>
        </Link>
      ))}
    </div>
  );
}
