import { ArchetypeChart } from "./ArchetypeChart";
import { countArchetypes } from "@/lib/archetypeStats";
import type { EventResult } from "@/lib/types";

export function EventArchetypeSection({ results }: { results: EventResult[] }) {
  const data = countArchetypes(results);

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-(family-name:--font-young-serif) text-3xl text-dark-brown">
        Archetypes Played
      </h2>
      <div className="bg-white rounded-2xl p-6 border border-black/5">
        <ArchetypeChart data={data} title="Archetypes Played" />
      </div>
    </div>
  );
}
