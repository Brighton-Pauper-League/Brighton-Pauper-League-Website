"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { ArchetypeChart } from "./ArchetypeChart";
import { countArchetypes } from "@/lib/archetypeStats";
import { formatLongDate } from "@/lib/dates";
import type { EventResult } from "@/lib/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function triggerDownload(href: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

export function EventArchetypeSection({
  title,
  eventDate,
  slug,
  results,
}: {
  title: string;
  eventDate: string;
  slug: string;
  results: EventResult[];
}) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "exporting" | "error">("idle");

  const data = countArchetypes(results);

  const handleDownload = useCallback(async () => {
    const node = captureRef.current;
    if (!node) return;
    setStatus("exporting");
    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: "#fcfcfb",
      });
      triggerDownload(dataUrl, `archetypes-${slugify(slug)}.png`);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, [slug]);

  if (data.length === 0) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-(family-name:--font-young-serif) text-3xl text-dark-brown">
          Archetypes Played
        </h2>
        <button
          type="button"
          onClick={handleDownload}
          disabled={status === "exporting"}
          className="px-5 py-2.5 bg-secondary-yellow text-dark-brown font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-[#d09602] transition-colors disabled:opacity-60"
        >
          {status === "exporting" ? "Preparing…" : "Download PNG"}
        </button>
      </div>

      {status === "error" && (
        <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-red-700">
          Could not generate the image. Please try again.
        </p>
      )}

      <div ref={captureRef} className="bg-off-white rounded-2xl p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-(family-name:--font-young-serif) text-xl text-dark-brown">
              {title}
            </span>
            <span className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60">
              {formatLongDate(eventDate)}
            </span>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.webp" alt="Brighton Pauper League" className="h-10 w-auto" />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-black/5">
          <ArchetypeChart data={data} title="Archetypes Played" />
        </div>
      </div>
    </div>
  );
}
