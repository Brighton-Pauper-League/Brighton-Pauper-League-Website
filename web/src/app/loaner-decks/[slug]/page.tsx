import type { Metadata } from "next";
import { buildMetadata, resolveSeo } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { scryfallArtCrop } from "@/lib/scryfall";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortableTextBody } from "@/components/PortableTextBody";
import { DeckCardsSection } from "@/components/DeckCardsSection";
import { getLoanerDeckBySlug, getLoanerDeckSlugs } from "@/lib/data";

export async function generateStaticParams() {
  const slugs = await getLoanerDeckSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const deck = await getLoanerDeckBySlug(slug);
  if (!deck) return { title: "Deck not found", robots: { index: false } };

  return buildMetadata(
    resolveSeo(deck.seo, {
      title: deck.name,
      description: `View the card list and primer for ${deck.name}, available to borrow at any Brighton Pauper League event.`,
      path: `/loaner-decks/${slug}`,
    })
  );
}

export default async function DeckDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deck = await getLoanerDeckBySlug(slug);
  if (!deck) notFound();

  const mainboard = deck.cards.filter((c) => !c.isSideboard);
  const sideboard = deck.cards.filter((c) => c.isSideboard);

  const heroArt = scryfallArtCrop(deck.featuredCardImageUri);

  const hasIntro = Array.isArray(deck.introText) && deck.introText.length > 0;
  const hasPrimer = Array.isArray(deck.deckPrimer) && deck.deckPrimer.length > 0;
  const hasDonors = Array.isArray(deck.donors) && deck.donors.length > 0;

  // Mainboard and sideboard entries are kept separate on purpose — a card can be
  // short in one zone but not the other.
  const missingCards = deck.cards.filter((c) => c.quantityOwned < c.quantity);

  return (
    <>
      <Navbar />

      {/* Hero — the featured card's art crop, under a blue gradient */}
      <div className="relative overflow-hidden bg-primary-blue px-6 md:px-12 lg:px-20 py-16 md:py-24">
        {heroArt && (
          <>
            <Image
              src={heroArt}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-blue via-primary-blue/85 to-primary-blue/50" />
          </>
        )}
        <div className="relative z-10 max-w-360 mx-auto flex flex-col gap-4">
          <Link
            href="/loaner-decks"
            className="font-(family-name:--font-bricolage-grotesque) text-sm text-white/60 hover:text-white transition-colors w-fit"
          >
            ← All Loaner Decks
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-secondary-yellow leading-none">
              {deck.name}
            </h1>
            {!deck.isComplete && (
              <a
                href="#donate"
                className="px-3 py-1.5 rounded font-(family-name:--font-bricolage-grotesque) font-extrabold text-sm uppercase bg-[#f59e0b] text-dark-brown hover:bg-[#d97706] transition-colors"
              >
                Incomplete
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Intro */}
      {hasIntro && (
        <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-200 mx-auto flex flex-col gap-6">
            <h2 className="font-(family-name:--font-young-serif) text-2xl md:text-3xl lg:text-[40px] text-dark-brown">
              About this deck
            </h2>
            <PortableTextBody value={deck.introText as PortableTextBlock[]} />
          </div>
        </section>
      )}

      {/* Cards */}
      <section className="bg-light-purple px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y">
        <div className="max-w-360 mx-auto">
          <DeckCardsSection mainboard={mainboard} sideboard={sideboard} />
        </div>
      </section>

      {/* Deck Primer / Sideboard Guide */}
      {hasPrimer && (
        <section className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-200 mx-auto flex flex-col gap-6">
            <h2 className="font-(family-name:--font-young-serif) text-2xl md:text-3xl lg:text-[40px] text-dark-brown">
              Deck Primer
            </h2>
            <PortableTextBody value={deck.deckPrimer as PortableTextBlock[]} />
          </div>
        </section>
      )}

      {/* Donate CTA */}
      {!deck.isComplete && (
        <section id="donate" className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-360 mx-auto flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex flex-col gap-2 flex-1">
                <h2 className="font-(family-name:--font-young-serif) text-2xl md:text-3xl text-dark-brown">
                  Help complete this deck
                </h2>
                <p className="font-(family-name:--font-bricolage-grotesque) text-black/60 text-lg">
                  This deck is missing some cards. If you have spare copies you
                  would be happy to donate, we would love to hear from you.
                </p>
              </div>
              <a
                href={`mailto:contact@brightonpauperleague.com?subject=${encodeURIComponent(`Donating cards for ${deck.name}`)}`}
                className="shrink-0 inline-flex items-center justify-center px-6 py-3 rounded font-(family-name:--font-bricolage-grotesque) font-extrabold text-sm uppercase bg-primary-blue text-white hover:bg-primary-blue/90 transition-colors"
              >
                Donate cards
              </a>
            </div>

            {missingCards.length > 0 && (
              <div className="flex flex-col gap-3">
                <h3 className="font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs uppercase text-black/50">
                  Cards still needed
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {missingCards.map((card, i) => (
                    <li
                      key={`${card.cardName}-${card.isSideboard}-${i}`}
                      className="bg-red-placeholder text-white font-(family-name:--font-bricolage-grotesque) text-sm px-3 py-1 rounded"
                    >
                      <span className="font-extrabold">
                        ×{card.quantity - card.quantityOwned}
                      </span>{" "}
                      {card.cardName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Special Thanks */}
      {hasDonors && (
        <section className="bg-dark-brown px-6 md:px-12 lg:px-20 py-16 md:py-24">
          <div className="max-w-360 mx-auto flex flex-col gap-4">
            <h2 className="font-(family-name:--font-young-serif) text-2xl md:text-3xl text-secondary-yellow">
              Special Thanks
            </h2>
            <p className="font-(family-name:--font-bricolage-grotesque) text-off-white/80 text-lg">
              Thank you to everyone who donated cards to make this deck possible:{" "}
              <span className="text-off-white font-semibold">
                {deck.donors!.join(", ")}
              </span>
              .
            </p>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
