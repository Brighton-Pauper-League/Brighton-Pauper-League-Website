"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { TooltipProps } from "recharts";
import { EmptyState } from "./EmptyState";
import type { ArchetypeCount } from "@/lib/archetypeStats";

function ChartTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload || payload.length === 0) return null;
  const entry = payload[0].payload as ArchetypeCount;
  return (
    <div className="bg-white rounded-xl border border-black/10 px-4 py-3 shadow-lg">
      <p className="font-(family-name:--font-bricolage-grotesque) font-bold text-dark-brown">
        {entry.name}
      </p>
      <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60">
        {entry.count} deck{entry.count === 1 ? "" : "s"} · {entry.percentage.toFixed(1)}%
      </p>
    </div>
  );
}

export function ArchetypeChart({
  data,
  title,
  emptyMessage = "No archetype data recorded yet.",
}: {
  data: ArchetypeCount[];
  title: string;
  emptyMessage?: string;
}) {
  if (data.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center">
      <div className="w-full md:w-80 h-80 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="name"
              innerRadius={70}
              outerRadius={130}
              strokeWidth={2}
              stroke="#fcfcfb"
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="flex-1 w-full flex flex-col gap-2" aria-label={`${title} legend`}>
        {data.map((entry) => (
          <li
            key={entry.key}
            className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg bg-off-white"
          >
            <span className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: entry.color }}
                aria-hidden
              />
              <span className="font-(family-name:--font-bricolage-grotesque) text-dark-brown">
                {entry.name}
              </span>
            </span>
            <span className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60 shrink-0">
              {entry.count} · {entry.percentage.toFixed(1)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
