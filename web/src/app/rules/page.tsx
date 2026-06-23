import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "League Rules | Brighton Pauper League",
  description: "Brighton Pauper League rules — Swiss rounds, REL Casual enforcement, match points, and MTG tiebreakers.",
};

export default function RulesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-[#371e22] leading-none">
            League Rules
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            Swiss rounds with REL Casual enforcement, match points, and official MTG tiebreakers. Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
