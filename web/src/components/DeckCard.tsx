import Link from "next/link";
import Image from "next/image";
import type { LoanerDeckListItem } from "@/lib/types";

interface DeckCardProps {
  deck: LoanerDeckListItem;
  imageUri: string | null;
}

export function DeckCard({ deck, imageUri }: DeckCardProps) {
  const mainboard = deck.cards.filter((c) => !c.isSideboard);
  const cardCount = mainboard.reduce((sum, c) => sum + c.quantity, 0);

  return (
    <Link
      href={`/loaner-decks/${deck.slug.current}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-[rgba(0,74,173,0.13)] bg-white hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
    >
      {/* Card image */}
      <div className="relative w-full" style={{ aspectRatio: "488 / 340" }}>
        {imageUri ? (
          <Image
            src={imageUri}
            alt={deck.name}
            fill
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="w-full h-full bg-dark-card flex items-center justify-center">
            <span className="font-(family-name:--font-bricolage-grotesque) text-off-white/50 text-sm">
              No image
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-(family-name:--font-young-serif) text-xl text-dark-brown leading-tight">
            {deck.name}
          </h3>
          {!deck.isComplete && (
            <span className="shrink-0 px-2.5 py-1 rounded font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs uppercase bg-[#f59e0b] text-dark-brown">
              Incomplete
            </span>
          )}
        </div>
        <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/50">
          {cardCount} cards
        </p>
      </div>
    </Link>
  );
}
