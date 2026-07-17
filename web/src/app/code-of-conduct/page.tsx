import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Code of Conduct",
  description:
    "Our commitment to a welcoming, respectful environment for all Brighton Pauper League players.",
  path: "/code-of-conduct",
});

export default function CodeOfConductPage() {
  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-[#371e22] leading-none">
            Code of Conduct
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            We maintain a welcoming, respectful environment for all players. Harassment, discrimination, and unsportsmanlike conduct are not tolerated. Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
