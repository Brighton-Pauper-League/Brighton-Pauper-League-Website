"use client";

import { useState } from "react";
import { MtgCard } from "@/components/MtgCard";
import type { DeckCard } from "@/lib/types";

// The card display for a loaner deck, with a Visual/Text toggle. Visual is the
// image grid; Text is a plain decklist showing each card's quantity and, when
// the club doesn't own enough copies, the owned/needed "incomplete" numbers.
// A client component because the tab switch needs interactivity.

const CATEGORIES = [
  "Creature",
  "Instant",
  "Sorcery",
  "Enchantment",
  "Artifact",
  "Land",
] as const;

type Category = (typeof CATEGORIES)[number] | "Other";

const CATEGORY_LABEL: Record<Category, string> = {
  Creature: "Creatures",
  Instant: "Instants",
  Sorcery: "Sorceries",
  Enchantment: "Enchantments",
  Artifact: "Artifacts",
  Land: "Lands",
  Other: "Other",
};

function getCategory(typeLine: string | null | undefined): Category {
  if (!typeLine) return "Other";
  for (const cat of CATEGORIES) {
    if (typeLine.includes(cat)) return cat;
  }
  return "Other";
}

function groupByCategory(cards: DeckCard[]): [Category, DeckCard[]][] {
  return ([...CATEGORIES, "Other"] as Category[])
    .map(
      (cat) =>
        [cat, cards.filter((c) => getCategory(c.typeLine) === cat)] as [
          Category,
          DeckCard[],
        ],
    )
    .filter(([, catCards]) => catCards.length > 0);
}

function SectionHeader({ title, cards }: { title: string; cards: DeckCard[] }) {
  const total = cards.reduce((sum, c) => sum + c.quantity, 0);
  const owned = cards.reduce((sum, c) => sum + c.quantityOwned, 0);
  const missing = total - owned;

  return (
    <div className="flex items-baseline gap-3 mb-8">
      <h2 className="font-(family-name:--font-young-serif) text-2xl md:text-3xl text-dark-brown">
        {title}
      </h2>
      <span className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/50">
        {total} cards
        {missing > 0 && (
          <span className="ml-2 text-red-placeholder font-semibold">
            · {missing} missing
          </span>
        )}
      </span>
    </div>
  );
}

// ── Visual grid ───────────────────────────────────────────────────────────────

function CardGrid({ cards }: { cards: DeckCard[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <MtgCard
          key={`${card.cardName}-${i}`}
          cardName={card.cardName}
          imageUri={card.imageUri ?? null}
          imageUriBack={card.imageUriBack ?? null}
          quantity={card.quantity}
          quantityOwned={card.quantityOwned}
        />
      ))}
    </div>
  );
}

function VisualSection({
  title,
  cards,
  grouped = false,
}: {
  title: string;
  cards: DeckCard[];
  grouped?: boolean;
}) {
  const groups = grouped ? groupByCategory(cards) : [];
  const showGroups =
    groups.length > 1 || (groups.length === 1 && groups[0][0] !== "Other");

  return (
    <section>
      <SectionHeader title={title} cards={cards} />
      {showGroups ? (
        <div className="flex flex-col gap-10">
          {groups.map(([cat, catCards]) => {
            const catTotal = catCards.reduce((sum, c) => sum + c.quantity, 0);
            return (
              <div key={cat}>
                <h3 className="font-(family-name:--font-bricolage-grotesque) font-semibold text-sm uppercase tracking-widest text-black/40 mb-4">
                  {CATEGORY_LABEL[cat]} ({catTotal})
                </h3>
                <CardGrid cards={catCards} />
              </div>
            );
          })}
        </div>
      ) : (
        <CardGrid cards={cards} />
      )}
    </section>
  );
}

// ── Text decklist ─────────────────────────────────────────────────────────────

function TextCardLine({ card }: { card: DeckCard }) {
  const incomplete = card.quantityOwned < card.quantity;
  const missing = card.quantity - card.quantityOwned;

  return (
    <li className="flex items-baseline gap-2 font-(family-name:--font-bricolage-grotesque) text-dark-brown">
      <span className="font-semibold tabular-nums">{card.quantity}</span>
      <span>{card.cardName}</span>
      {incomplete && (
        <span className="text-red-placeholder text-sm font-semibold">
          ({card.quantityOwned}/{card.quantity} · {missing} missing)
        </span>
      )}
    </li>
  );
}

function TextSection({
  title,
  cards,
  grouped = false,
}: {
  title: string;
  cards: DeckCard[];
  grouped?: boolean;
}) {
  const groups = grouped ? groupByCategory(cards) : [];
  const showGroups =
    groups.length > 1 || (groups.length === 1 && groups[0][0] !== "Other");

  return (
    <section>
      <SectionHeader title={title} cards={cards} />
      {showGroups ? (
        <div className="flex flex-col gap-8">
          {groups.map(([cat, catCards]) => {
            const catTotal = catCards.reduce((sum, c) => sum + c.quantity, 0);
            return (
              <div key={cat}>
                <h3 className="font-(family-name:--font-bricolage-grotesque) font-semibold text-sm uppercase tracking-widest text-black/40 mb-3">
                  {CATEGORY_LABEL[cat]} ({catTotal})
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {catCards.map((card, i) => (
                    <TextCardLine key={`${card.cardName}-${i}`} card={card} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {cards.map((card, i) => (
            <TextCardLine key={`${card.cardName}-${i}`} card={card} />
          ))}
        </ul>
      )}
    </section>
  );
}

// ── Tabbed container ──────────────────────────────────────────────────────────

type View = "visual" | "text";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2 rounded font-(family-name:--font-bricolage-grotesque) font-extrabold text-sm uppercase transition-colors ${
        active
          ? "bg-primary-blue text-white"
          : "bg-transparent text-dark-brown/60 hover:text-dark-brown"
      }`}
    >
      {children}
    </button>
  );
}

export function DeckCardsSection({
  mainboard,
  sideboard,
}: {
  mainboard: DeckCard[];
  sideboard: DeckCard[];
}) {
  const [view, setView] = useState<View>("visual");

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-2 self-start bg-white/50 p-1 rounded-lg">
        <TabButton active={view === "visual"} onClick={() => setView("visual")}>
          Visual
        </TabButton>
        <TabButton active={view === "text"} onClick={() => setView("text")}>
          Text
        </TabButton>
      </div>

      <div className="flex flex-col gap-16">
        {view === "visual" ? (
          <>
            {mainboard.length > 0 && (
              <VisualSection title="Mainboard" cards={mainboard} grouped />
            )}
            {sideboard.length > 0 && (
              <VisualSection title="Sideboard" cards={sideboard} />
            )}
          </>
        ) : (
          <>
            {mainboard.length > 0 && (
              <TextSection title="Mainboard" cards={mainboard} grouped />
            )}
            {sideboard.length > 0 && (
              <TextSection title="Sideboard" cards={sideboard} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
