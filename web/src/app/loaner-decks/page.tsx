import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DeckCard } from "@/components/DeckCard";
import { EmptyState } from "@/components/EmptyState";
import { getLoanerDecks } from "@/lib/data";

export const metadata: Metadata = {
  title: "Loaner Decks",
  description:
    "Borrow a competitive, tournament-legal Pauper deck at any Brighton Pauper League event. Free to use — just ask on the night.",
};

export default async function LoanerDecksPage() {
  const decks = await getLoanerDecks();
  const imageMap = Object.fromEntries(
    decks.map((deck) => [deck._id, deck.featuredCardImageUri ?? null])
  );

  return (
    <>
      <Navbar />

      <div className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col gap-4">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-secondary-yellow leading-none">
            Loaner Decks
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-white/80 max-w-200">
              We are currently building a library of loaner decks that will make it easier than ever for you lovely people to participate in competitive league play.
              Forget the hefty financial investment for now and simply jam the deck first! Ask us to borrow one on the night.
          </p>
        </div>
      </div>

      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[40vh]">
        <div className="max-w-360 mx-auto">
          {decks.length === 0 ? (
            <EmptyState
              title="No decks yet"
              message="Check back soon — we're adding our loaner deck library."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {decks.map((deck) => (
                <DeckCard
                  key={deck._id}
                  deck={deck}
                  imageUri={imageMap[deck._id] ?? null}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
