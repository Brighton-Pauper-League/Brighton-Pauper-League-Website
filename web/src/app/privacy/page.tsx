import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy & Data | Brighton Pauper League",
  description: "How the Brighton Pauper League collects, stores, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-[#371e22] leading-none">
            Privacy &amp; Data
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            Your data is stored securely and never shared with third parties. We only collect what&apos;s needed to run the league. Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
