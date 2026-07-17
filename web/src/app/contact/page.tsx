import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with the Brighton Pauper League.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-dark-brown leading-none">
            Contact
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
            Questions about the league? Email us at{" "}
            <a
              href="mailto:contact@brightonpauperleague.com"
              className="border-b-2 border-primary-blue text-primary-blue font-semibold hover:border-darker-blue hover:text-darker-blue transition-colors"
            >
              contact@brightonpauperleague.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
