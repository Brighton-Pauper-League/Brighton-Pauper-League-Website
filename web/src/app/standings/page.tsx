import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { StandingsView } from "@/components/StandingsView";
import {
  getActiveSeason,
  getAllSeasons,
  getSeasonEvents,
  getStandings,
} from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Standings",
  description:
    "Current season standings with official MTG tiebreakers (Points, OMW%, GW%, OGW%) for the Brighton Pauper League.",
  path: "/standings",
});

export default async function StandingsPage() {
  const [activeSeason, seasons] = await Promise.all([
    getActiveSeason(),
    getAllSeasons(),
  ]);
  const [rows, stages] = activeSeason
    ? await Promise.all([
        getStandings(activeSeason._id),
        getSeasonEvents(activeSeason._id),
      ])
    : [[], []];

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <StandingsView
          season={activeSeason}
          rows={rows}
          seasons={seasons}
          stages={stages}
          heading="Standings"
          intro="No season is currently active. Pick a season to view its final standings."
        />
      </main>
      <Footer />
    </>
  );
}
