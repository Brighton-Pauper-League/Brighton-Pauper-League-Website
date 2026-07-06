import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "About | Brighton Pauper League",
  description: "An independent, community-led Pauper Magic league in Brighton, UK — run by players, for players.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>

        {/* Hero */}
        <section className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col gap-6 max-w-prose-xl">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-secondary-yellow leading-none">
              About Us
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl md:text-2xl text-light-purple max-w-200 leading-relaxed">
              We are an independently run and community-led Magic: The Gathering Pauper league, hosted on Tuesdays at Dice Saloon in Brighton!
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex flex-col gap-6 flex-1">
              <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-dark-brown leading-tight">
                Our Story
              </h2>
              <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black/70 leading-relaxed">
                It all began with a dream of a deep yet accessible format, jointly realised by players and Dice Saloon employees. Quickly, the community grew and before we knew it our players became more competitive and have attended various tournaments together. Every Tuesday our community grows tighter as we hone our skills, test decks, share strategies, and chat about anything in between.
              </p>
            </div>

            <div className="w-full lg:w-130 shrink-0">
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden">
                <Image
                  src="/away-day-in-bristol.jpeg"
                  alt="Brighton Pauper League away day in Bristol"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 520px"
                />
              </div>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/40 mt-3">
                Ursa's Saga, Bristol Pauper League's IPT - First tournament in the team kits
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="bg-light-purple px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col gap-10">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-primary-blue leading-tight">
              What We Do
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl flex flex-col gap-4">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue">
                  Competitive League
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 leading-relaxed">
                  Player scores are tracked on our bi-weekly league nights, culminating in a cut to top 8 where players battle in a single-elimination bracket for the seasonal title.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl flex flex-col gap-4">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue">
                  Casual Play
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 leading-relaxed">
                  Come along and bring your pet decks and brews! Expect lower stakes and lower-tiered decks every other Tuesday.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl flex flex-col gap-4">
                <h3 className="font-(family-name:--font-young-serif) text-2xl text-primary-blue">
                  Community Events
                </h3>
                <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 leading-relaxed">
                  We run a variety of special events in our off-season to keep the community engaged and interacting with the beautiful game of Magic in fresh ways.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Photo Strip */}
        <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-360 mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden bg-light-purple">
              <Image
                  src="/neils-farewell.jpg"
                  alt="Founding member Neil's last Pauper Tuesday"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-square sm:aspect-4/3 rounded-2xl overflow-hidden bg-primary-blue/20">
              <Image
                  src="/top-8.jpg"
                  alt="Top-8 at a tournament on the 17/05/26"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* People */}
        <section className="bg-dark-brown px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
          <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="w-full lg:w-110 shrink-0">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-primary-blue/30">
                {/* placeholder — replace with a group photo */}
              </div>
              <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-white/40 mt-3">
                A photo from our very first league night — where it all began.
              </p>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-secondary-yellow leading-tight">
                The People Behind It
              </h2>
              <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-white/70 leading-relaxed">
                Get to know our most dedicated regular players, who are more than happy to help with anything a new player may feel nervous about. Whether you need to borrow a deck, would like some advice, or just want to chat, we’re here to help!
              </p>
              <Link
                href="/players"
                className="border-b-2 border-secondary-yellow text-secondary-yellow font-(family-name:--font-bricolage-grotesque) font-semibold text-lg pb-1 w-fit hover:border-[#d09602] hover:text-[#d09602] transition-colors"
              >
                Meet the members →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-360 mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl text-secondary-yellow leading-tight">
                Ready to play?
              </h2>
              <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-light-purple">
                Come along to a league night.
              </p>
            </div>
            <Link
              href="/events"
              className="shrink-0 px-8 py-4 bg-secondary-yellow text-dark-brown font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-[#d09602] transition-colors"
            >
              See upcoming events
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
