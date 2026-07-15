import Link from "next/link";
import type { Season, SeasonStage, StandingsRow } from "@/lib/types";
import { formatSeasonRange, getSeasonStatus, type SeasonStatus } from "@/lib/dates";
import { playerDisplayName, playerProfilePath } from "@/lib/standings";
import { StandingsTable } from "./StandingsTable";

const SEASON_STATUS_LABEL: Record<SeasonStatus, string> = {
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

// Numbered list of the season's event nights. Stage numbers come from date
// order (earliest = Stage 1); each links to the event page.
function StageNav({ stages }: { stages: SeasonStage[] }) {
  if (stages.length === 0) return null;

  return (
    <nav className="bg-light-purple p-8 rounded-2xl">
      <h2 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue mb-4">
        Stages
      </h2>
      <ol className="flex flex-col gap-3">
        {stages.map((stage, index) => {
          const label = `Stage ${index + 1}`;
          return (
            <li key={stage._id} className="flex flex-col">
              {stage.slug ? (
                <Link
                  href={`/events/${stage.slug}`}
                  className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown hover:text-primary-blue transition-colors"
                >
                  <span className="font-bold text-primary-blue">{label}</span>{" "}
                  <span className="text-dark-brown/70">— {stage.title}</span>
                </Link>
              ) : (
                <span className="font-(family-name:--font-bricolage-grotesque) text-base">
                  <span className="font-bold text-primary-blue">{label}</span>{" "}
                  <span className="text-dark-brown/70">— {stage.title}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Banner announcing the overall season winner (decided by the top-8 finals).
// Honours anonymisation via the shared display/profile helpers.
function WinnerBanner({ winner }: { winner: NonNullable<Season["winner"]> }) {
  const profilePath = playerProfilePath(winner);
  const name = playerDisplayName(winner);

  return (
    <div className="bg-secondary-yellow rounded-2xl p-6 md:p-8 flex flex-col gap-1">
      <span className="font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs uppercase tracking-widest text-dark-brown/60">
        Season Winner
      </span>
      <span className="font-(family-name:--font-young-serif) text-2xl md:text-3xl text-dark-brown">
        {profilePath ? (
          <Link href={profilePath} className="hover:text-primary-blue transition-colors">
            {name}
          </Link>
        ) : (
          name
        )}
      </span>
      <span className="font-(family-name:--font-bricolage-grotesque) text-sm text-dark-brown/70">
        Crowned champion after the top-8 finals.
      </span>
    </div>
  );
}

// Shared layout for both the live standings page and season archive pages:
// season heading, full standings table, tiebreaker explainer, and season nav.
export function StandingsView({
  season,
  rows,
  seasons,
  stages = [],
  heading = "Standings",
  intro,
}: {
  season: Season | null;
  rows: StandingsRow[];
  seasons: Season[];
  stages?: SeasonStage[];
  heading?: string;
  intro?: string;
}) {
  const isCompleted =
    season != null &&
    getSeasonStatus(season.startDate, season.endDate) === "completed";
  // Only draw the top-8 cut line once the season is over and there are more
  // than eight players (otherwise a cut line is meaningless).
  const top8Cut = isCompleted && rows.length > 8;

  return (
    <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-12">
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <header className="flex flex-col gap-3">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-5xl lg:text-[64px] xl:text-[72px] 2xl:text-[80px] text-dark-brown leading-none">
            {season ? season.name : heading}
          </h1>
          {season ? (
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/60">
              {formatSeasonRange(season.startDate, season.endDate)} ·{" "}
              {SEASON_STATUS_LABEL[getSeasonStatus(season.startDate, season.endDate)]}
            </p>
          ) : (
            intro && (
              <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/60">
                {intro}
              </p>
            )
          )}
        </header>

        {season?.winner && <WinnerBanner winner={season.winner} />}

        <StandingsTable rows={rows} variant="full" top8Cut={top8Cut} />
      </div>

      <aside className="lg:w-[320px] flex flex-col gap-8 flex-shrink-0">
        <SeasonNav seasons={seasons} currentSeasonNumber={season?.seasonNumber} />
        <StageNav stages={stages} />
        <div className="bg-primary-blue p-8 rounded-2xl">
          <h2 className="font-(family-name:--font-young-serif) text-xl text-secondary-yellow mb-3">
            How standings work
          </h2>
          <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-white/80 leading-relaxed">
            Players earn 3 points for a win and 1 for a draw. Ties are broken
            using official MTG order: Points → OMW% → GW% → OGW%. After all
            stages, the top 8 advance to the finals to decide the season
            winner.
          </p>
        </div>
      </aside>
    </div>
  );
}
