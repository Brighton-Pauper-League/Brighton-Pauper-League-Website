import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ResourceList } from "@/components/ResourceList";
import { getResources } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Resources",
  description:
    "A curated list of useful Pauper links — format rules, deck databases and tools — maintained by the Brighton Pauper League.",
  path: "/resources",
});

export default async function ResourcesPage() {
  const resources = await getResources();

  return (
    <>
      <Navbar />

      <div className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col gap-4">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-secondary-yellow leading-none">
            Resources
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-white/80 max-w-200">
            Handy links for Pauper players — format rules, deck databases and the
            tools we lean on. If you know of something that belongs here, let us
            know.
          </p>
        </div>
      </div>

      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[40vh]">
        <div className="max-w-260 mx-auto">
          <ResourceList resources={resources} />
        </div>
      </main>

      <Footer />
    </>
  );
}
