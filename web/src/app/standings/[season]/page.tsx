import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StandingsView } from "@/components/StandingsView";
import { getAllSeasons, getSeasonByNumber, getStandings } from "@/lib/data";

function parseSeasonNumber(value: string): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ season: string }>;
}): Promise<Metadata> {
  const { season } = await params;
  const seasonNumber = parseSeasonNumber(season);
  const found = seasonNumber ? await getSeasonByNumber(seasonNumber) : null;

  return {
    title: found ? `${found.name} Standings` : "Season Standings",
    description: found
      ? `Final standings for ${found.name} of the Brighton Pauper League.`
      : "Historical season standings for the Brighton Pauper League.",
  };
}

export default async function SeasonStandingsPage({
  params,
}: {
  params: Promise<{ season: string }>;
}) {
  const { season } = await params;
  const seasonNumber = parseSeasonNumber(season);
  if (!seasonNumber) notFound();

  const [seasonDoc, seasons] = await Promise.all([
    getSeasonByNumber(seasonNumber),
    getAllSeasons(),
  ]);
  if (!seasonDoc) notFound();

  const rows = await getStandings(seasonDoc._id);

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <StandingsView season={seasonDoc} rows={rows} seasons={seasons} />
      </main>
      <Footer />
    </>
  );
}
