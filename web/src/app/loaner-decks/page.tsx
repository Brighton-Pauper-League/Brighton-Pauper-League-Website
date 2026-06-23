import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Loaner Decks | Brighton Pauper League",
  description: "Borrow a competitive, tournament-legal Pauper deck at any Brighton Pauper League event.",
};

export default function LoanerDecksPage() {
  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-[#371e22] leading-none">
            Loaner Decks
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            Our library of competitive, tournament-legal decks is free to borrow at every event. Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
