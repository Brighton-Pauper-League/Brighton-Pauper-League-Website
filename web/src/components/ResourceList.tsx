"use client";

import { useMemo, useState } from "react";
import type { Resource } from "@/lib/types";
import { EmptyState } from "./EmptyState";

// The reader picks the order. All resources are already loaded on the server, so
// sorting happens in the browser with no refetch. Tags are stored on each
// resource but deliberately not rendered yet — the schema keeps them so the page
// can grow filtering/grouping later without a data migration.

type SortOption = "alpha" | "newest" | "oldest";

const SORT_LABELS: Record<SortOption, string> = {
  alpha: "Alphabetical",
  newest: "Newest first",
  oldest: "Oldest first",
};

function sortResources(resources: Resource[], sort: SortOption): Resource[] {
  const copy = [...resources];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => b._createdAt.localeCompare(a._createdAt));
    case "oldest":
      return copy.sort((a, b) => a._createdAt.localeCompare(b._createdAt));
    case "alpha":
    default:
      return copy.sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
      );
  }
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function ResourceList({ resources }: { resources: Resource[] }) {
  const [sort, setSort] = useState<SortOption>("alpha");
  const sorted = useMemo(() => sortResources(resources, sort), [resources, sort]);

  if (resources.length === 0) {
    return (
      <EmptyState
        title="No resources yet"
        message="Check back soon — we're gathering the most useful Pauper links."
      />
    );
  }

  return (
    <>
      <div className="flex items-center justify-end gap-3 mb-8">
        <label
          htmlFor="resource-sort"
          className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60"
        >
          Sort by
        </label>
        <select
          id="resource-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as SortOption)}
          className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown bg-white border border-[rgba(0,74,173,0.3)] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-blue"
        >
          {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
            <option key={option} value={option}>
              {SORT_LABELS[option]}
            </option>
          ))}
        </select>
      </div>

      <ul className="flex flex-col gap-4">
        {sorted.map((resource) => (
          <li key={resource._id}>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-white/60 border border-[rgba(0,74,173,0.2)] rounded-2xl p-6 transition-colors hover:border-primary-blue hover:bg-white"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown group-hover:text-primary-blue transition-colors">
                    {resource.title}
                  </h2>
                  <span className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/40 shrink-0">
                    {hostname(resource.url)}
                  </span>
                </div>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                  {resource.description}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
