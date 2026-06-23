import { sortStandings, playerDisplayName, type StandingsRow } from "@/lib/standings";
import { EmptyState } from "./EmptyState";

// One standings component, two looks:
//  - "preview" (homepage): Rank · Player · Points · W-L-D, top N rows
//  - "full" (standings pages): adds played/W/D/L and the OMW%/GW%/OGW% tiebreakers
// Rows are always sorted by the MTG tiebreaker hierarchy via sortStandings, so
// callers can pass raw data in any order.

function formatPct(value: number | null): string {
  return value == null ? "—" : `${value.toFixed(1)}%`;
}

const HEAD_CLASS =
  "px-4 py-4 font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase";
const CELL_CLASS = "px-4 py-4 font-(family-name:--font-bricolage-grotesque) text-dark-brown";

export function StandingsTable({
  rows,
  variant = "full",
  maxRows,
  emptyMessage = "No standings have been recorded for this season yet.",
}: {
  rows: StandingsRow[];
  variant?: "preview" | "full";
  maxRows?: number;
  emptyMessage?: string;
}) {
  const sorted = sortStandings(rows);
  const display = maxRows ? sorted.slice(0, maxRows) : sorted;

  if (display.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const isFull = variant === "full";

  return (
    <div className="bg-white rounded-2xl overflow-x-auto border border-[rgba(0,74,173,0.13)]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[rgba(0,74,173,0.13)]">
            <th className={`${HEAD_CLASS} text-left w-16`}>Rank</th>
            <th className={`${HEAD_CLASS} text-left`}>Player</th>
            {isFull && <th className={`${HEAD_CLASS} text-right`} title="Matches played">P</th>}
            {isFull && <th className={`${HEAD_CLASS} text-right`} title="Wins">W</th>}
            {isFull && <th className={`${HEAD_CLASS} text-right`} title="Draws">D</th>}
            {isFull && <th className={`${HEAD_CLASS} text-right`} title="Losses">L</th>}
            <th className={`${HEAD_CLASS} text-right`}>Points</th>
            {!isFull && <th className={`${HEAD_CLASS} text-right`}>W-L-D</th>}
            {isFull && (
              <th className={`${HEAD_CLASS} text-right`} title="Opponent Match Win %">
                OMW%
              </th>
            )}
            {isFull && (
              <th className={`${HEAD_CLASS} text-right`} title="Game Win %">
                GW%
              </th>
            )}
            {isFull && (
              <th className={`${HEAD_CLASS} text-right`} title="Opponent Game Win %">
                OGW%
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {display.map((row, index) => (
            <tr key={row._id} className="border-t border-[rgba(0,74,173,0.13)]">
              <td className={`${CELL_CLASS} font-bold text-lg`}>{index + 1}</td>
              <td className={`${CELL_CLASS} text-base`}>
                {playerDisplayName(row.player)}
                {!row.player.isActive && (
                  <span className="ml-2 text-xs text-black/40 uppercase">inactive</span>
                )}
              </td>
              {isFull && <td className={`${CELL_CLASS} text-right`}>{row.matchesPlayed}</td>}
              {isFull && <td className={`${CELL_CLASS} text-right`}>{row.wins}</td>}
              {isFull && <td className={`${CELL_CLASS} text-right`}>{row.draws}</td>}
              {isFull && <td className={`${CELL_CLASS} text-right`}>{row.losses}</td>}
              <td className={`${CELL_CLASS} text-right font-bold text-lg text-primary-blue`}>
                {row.points}
              </td>
              {!isFull && (
                <td className={`${CELL_CLASS} text-right text-base text-dark-brown/70`}>
                  {row.wins}-{row.losses}-{row.draws}
                </td>
              )}
              {isFull && <td className={`${CELL_CLASS} text-right`}>{formatPct(row.omwPercentage)}</td>}
              {isFull && <td className={`${CELL_CLASS} text-right`}>{formatPct(row.gwPercentage)}</td>}
              {isFull && <td className={`${CELL_CLASS} text-right`}>{formatPct(row.ogwPercentage)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
