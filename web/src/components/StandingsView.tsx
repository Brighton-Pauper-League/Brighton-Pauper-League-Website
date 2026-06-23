import Link from "next/link";
import type { Season, StandingsRow } from "@/lib/types";
import { formatSeasonRange } from "@/lib/dates";
import { StandingsTable } from "./StandingsTable";

const SEASON_STATUS_LABEL: Record<Season["status"], string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
};

// Vertical list of every season, linking to its standings and highlighting the
// one being viewed. Server-rendered — no client JS needed for navigation.
function SeasonNav({
  seasons,
  currentSeasonNumber,
}: {
  seasons: Season[];
  currentSeasonNumber?: number;
}) {
  if (seasons.length === 0) return null;

  return (
    <nav className="bg-light-purple p-8 rounded-2xl">
      <h2 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue mb-4">
        Seasons
      </h2>
      <ul className="flex flex-col gap-3">
        {seasons.map((season) => {
          const isCurrent = season.seasonNumber === currentSeasonNumber;
          return (
            <li key={season._id}>
              <Link
                href={`/standings/${season.seasonNumber}`}
                aria-current={isCurrent ? "page" : undefined}
                className={`font-(family-name:--font-bricolage-grotesque) text-base transition-colors ${
                  isCurrent
                    ? "font-bold text-primary-blue"
                    : "text-dark-brown hover:text-primary-blue"
                }`}
              >
                {season.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// Shared layout for both the live standings page and season archive pages:
// season heading, full standings table, tiebreaker explainer, and season nav.
export function StandingsView({
  season,
  rows,
  seasons,
  heading = "Standings",
  intro,
}: {
  season: Season | null;
  rows: StandingsRow[];
  seasons: Season[];
  heading?: string;
  intro?: string;
}) {
  return (
    <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <header className="flex flex-col gap-3">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-5xl lg:text-[64px] text-dark-brown leading-none">
            {season ? season.name : heading}
          </h1>
          {season ? (
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/60">
              {formatSeasonRange(season.startDate, season.endDate)} ·{" "}
              {SEASON_STATUS_LABEL[season.status]}
            </p>
          ) : (
            intro && (
              <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/60">
                {intro}
              </p>
            )
          )}
        </header>

        <StandingsTable rows={rows} variant="full" />
      </div>

      <aside className="lg:w-[320px] flex flex-col gap-8 flex-shrink-0">
        <SeasonNav seasons={seasons} currentSeasonNumber={season?.seasonNumber} />
        <div className="bg-primary-blue p-8 rounded-2xl">
          <h2 className="font-(family-name:--font-young-serif) text-xl text-secondary-yellow mb-3">
            How standings work
          </h2>
          <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-white/80 leading-relaxed">
            Players earn 3 points for a win and 1 for a draw. Ties are broken
            using official MTG order: Points → OMW% → GW% → OGW%.
          </p>
        </div>
      </aside>
    </div>
  );
}
