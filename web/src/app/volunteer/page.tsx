import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Volunteer | Brighton Pauper League",
  description: "Help run the Brighton Pauper League — judging, content creation, event support, and deck donation.",
};

export default function VolunteerPage() {
  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-[#371e22] leading-none">
            Volunteer
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            The league runs entirely on volunteer power — judging, content, event support, and deck donation. Get in touch at{" "}
            <a
              href="mailto:contact@brightonpauperleague.com?subject=Volunteering enquiry"
              className="border-b-2 border-[#004aad] text-[#004aad] font-semibold hover:border-[#003a8a] hover:text-[#003a8a] transition-colors"
            >
              contact@brightonpauperleague.com
            </a>
            . Content coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
