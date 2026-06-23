import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MemberCard } from "@/components/MemberCard";
import { EmptyState } from "@/components/EmptyState";
import { getPublicPlayers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Members",
  description: "Meet the players of the Brighton Pauper League.",
};

export default async function PlayersPage() {
  const players = await getPublicPlayers();

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-12">
          <header className="flex flex-col gap-3">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-5xl lg:text-[64px] text-dark-brown leading-none">
              Members
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/60">
              The players who make up the Brighton Pauper League.
            </p>
          </header>

          {players.length === 0 ? (
            <EmptyState message="No member profiles have been published yet." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {players.map((player) => (
                <MemberCard key={player._id} player={player} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
