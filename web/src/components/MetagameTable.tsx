import { EmptyState } from "./EmptyState";
import type { MetagameRow } from "@/lib/metagameStats";

const HEAD_CLASS =
  "px-4 py-4 font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs text-primary-blue uppercase";
const CELL_CLASS = "px-4 py-4 font-(family-name:--font-bricolage-grotesque) text-dark-brown";

function Bar({ percentage, max, colorClass }: { percentage: number; max: number; colorClass: string }) {
  const width = max > 0 ? Math.min(100, (percentage / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-black/5 overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${width}%` }} />
      </div>
      <span className="w-14 shrink-0 text-right tabular-nums">{percentage.toFixed(1)}%</span>
    </div>
  );
}

function formatDelta(deltaPp: number): string {
  const sign = deltaPp > 0 ? "+" : "";
  return `${sign}${deltaPp.toFixed(1)}pp`;
}

export function MetagameTable({
  rows,
  emptyMessage = "No archetype data recorded for this season yet.",
}: {
  rows: MetagameRow[];
  emptyMessage?: string;
}) {
  if (rows.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const maxMetagame = Math.max(...rows.map((r) => r.metagamePercentage));
  const maxTop8 = Math.max(...rows.map((r) => r.top8Percentage));

  return (
    <div className="bg-white rounded-2xl overflow-x-auto border border-black/5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-primary-blue/10">
            <th className={`${HEAD_CLASS} text-left`}>Deck</th>
            <th className={`${HEAD_CLASS} text-left w-56`}>Metagame %</th>
            <th className={`${HEAD_CLASS} text-left w-56`}>Top 8 %</th>
            <th className={`${HEAD_CLASS} text-right`}>Wins</th>
            <th className={`${HEAD_CLASS} text-right`} title="Top 8% minus Metagame%">
              Conversion
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-black/5">
              <td className={CELL_CLASS}>
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                    aria-hidden
                  />
                  {row.name}
                </span>
              </td>
              <td className={CELL_CLASS}>
                <Bar percentage={row.metagamePercentage} max={maxMetagame} colorClass="bg-primary-blue" />
              </td>
              <td className={CELL_CLASS}>
                <Bar percentage={row.top8Percentage} max={maxTop8} colorClass="bg-secondary-yellow" />
              </td>
              <td className={`${CELL_CLASS} text-right`}>{row.wins}</td>
              <td
                className={`${CELL_CLASS} text-right font-bold ${
                  row.conversionDeltaPp > 0
                    ? "text-green-700"
                    : row.conversionDeltaPp < 0
                      ? "text-red-700"
                      : "text-black/40"
                }`}
              >
                {formatDelta(row.conversionDeltaPp)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
