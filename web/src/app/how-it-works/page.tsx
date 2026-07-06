import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "How It Works | Brighton Pauper League",
  description:
    "How the Brighton Pauper League works - three seasons a year, fortnightly Swiss stages, match points, OMW% tiebreakers, and the end-of-season Top 8 bracket.",
};

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />

      {/* Header */}
      <header className="bg-off-white px-6 md:px-12 lg:px-20 pt-16 md:pt-24 lg:pt-section-y pb-12 md:pb-16">
        <div className="max-w-360 mx-auto flex flex-col gap-6">
          <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-dark-brown leading-none">
            How the League Works
          </h1>
          <p className="font-(family-name:--font-bricolage-grotesque) text-lg md:text-xl text-black/70 max-w-200">
            We run three seasons a year - Spring, Summer, and Winter - each
            starting after their respective Paupergeddon tournaments.
          </p>
        </div>
      </header>

      {/* Season Structure */}
      <section className="bg-light-purple px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-primary-blue leading-tight">
              Season structure
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-primary-blue/80">
              What makes up a season?
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 flex flex-col gap-2">
              <span className="font-(family-name:--font-young-serif) text-5xl text-primary-blue leading-none">
                3
              </span>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                Seasons a year - Spring, Summer, and Winter.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 flex flex-col gap-2">
              <span className="font-(family-name:--font-young-serif) text-5xl text-primary-blue leading-none">
                7&ndash;8
              </span>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                Fortnightly stages per season, feeding one overall league table.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 flex flex-col gap-2">
              <span className="font-(family-name:--font-young-serif) text-5xl text-primary-blue leading-none">
                3
              </span>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70">
                Rounds of Swiss make up each stage, with results counting towards
                your standing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scoring */}
      <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-200">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-dark-brown leading-tight">
              How scoring works
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black/70">
              Every match earns points towards the league table.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-primary-blue rounded-2xl p-8 flex flex-col gap-1">
              <span className="font-(family-name:--font-young-serif) text-5xl md:text-6xl text-secondary-yellow leading-none">
                3
              </span>
              <span className="font-(family-name:--font-bricolage-grotesque) text-sm uppercase tracking-wide text-white/60">
                Points
              </span>
              <span className="font-(family-name:--font-bricolage-grotesque) font-semibold text-xl text-white mt-2">
                Win
              </span>
            </div>
            <div className="bg-primary-blue rounded-2xl p-8 flex flex-col gap-1">
              <span className="font-(family-name:--font-young-serif) text-5xl md:text-6xl text-secondary-yellow leading-none">
                1
              </span>
              <span className="font-(family-name:--font-bricolage-grotesque) text-sm uppercase tracking-wide text-white/60">
                Point
              </span>
              <span className="font-(family-name:--font-bricolage-grotesque) font-semibold text-xl text-white mt-2">
                Draw
              </span>
            </div>
            <div className="bg-primary-blue rounded-2xl p-8 flex flex-col gap-1">
              <span className="font-(family-name:--font-young-serif) text-5xl md:text-6xl text-secondary-yellow leading-none">
                0
              </span>
              <span className="font-(family-name:--font-bricolage-grotesque) text-sm uppercase tracking-wide text-white/60">
                Points
              </span>
              <span className="font-(family-name:--font-bricolage-grotesque) font-semibold text-xl text-white mt-2">
                Loss
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule & Fairness */}
      <section className="bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-secondary-yellow leading-tight">
              Schedule &amp; fair play
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-light-purple">
              Keeping the table fair, balanced, and welcoming.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-2">
                Every other Tuesday
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/80 leading-relaxed">
                Stages run every other Tuesday, alternating with casual Pauper
                nights so there is always something happening at the table.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-white mb-2">
                Your worst two results are dropped
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-white/80 leading-relaxed">
                To keep scores fair and balanced, the worst two results each
                season are not counted towards the league table. Missed weeks are
                recorded as a score of 0.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tiebreaks & Top 8 */}
      <section className="bg-sage-green px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16">
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-dark-brown leading-tight">
              Tiebreaks &amp; the Top 8
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-dark-brown/80">
              How a season is settled and a champion is crowned.
            </p>
          </div>

          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-off-white rounded-2xl p-8">
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown mb-2">
                OMW% tiebreakers
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown/70 leading-relaxed">
                When players are level on points, ties are broken using OMW%
                (Opponent Match Win) - rewarding those who faced the
                toughest field.
              </p>
            </div>
            <div className="bg-off-white rounded-2xl p-8">
              <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown mb-2">
                The Top 8 bracket
              </h3>
              <p className="font-(family-name:--font-bricolage-grotesque) text-base text-dark-brown/70 leading-relaxed">
                The top 8 players each season compete in a single-elimination
                bracket. The winner is declared the Brighton Pauper League
                Champion - and returns to defend their glorious status in
                the next competitive season!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-dark-brown px-6 md:px-12 lg:px-20 py-16 md:py-24">
        <div className="max-w-360 mx-auto flex flex-col items-start gap-6">
          <h2 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-secondary-yellow leading-tight">
            Ready to play?
          </h2>
          <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-white/80 max-w-200">
            Follow the standings, or come down on a league night and take your
            first stage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/events"
              className="px-8 py-4 bg-secondary-yellow text-dark-brown font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-[#d09602] transition-colors text-center"
            >
              See upcoming events
            </Link>
            <Link
              href="/standings"
              className="px-8 py-4 border-2 border-white text-white font-(family-name:--font-inter) font-bold text-sm rounded-lg hover:bg-white/10 transition-colors text-center"
            >
              View standings
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}