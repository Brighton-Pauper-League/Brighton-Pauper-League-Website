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
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-dark-brown leading-none">
            Volunteer
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            Our Pauper league is proudly run by a group of dedicated volunteers! Whilst we&apos;re not looking for any volunteers at this time, please contact us if you would like register your interest and let us know what you’re specifically hoping to help with :)<a
              href="mailto:contact@brightonpauperleague.com?subject=Volunteering enquiry"
              className="border-b-2 border-primary-blue text-primary-blue font-semibold hover:border-darker-blue hover:text-darker-blue transition-colors"
            >
              contact@brightonpauperleague.com
            </a><br />
            Do note that all volunteers must be 18+.
          </p>

        </div>
      </main>
      <Footer />
    </>
  );
}
