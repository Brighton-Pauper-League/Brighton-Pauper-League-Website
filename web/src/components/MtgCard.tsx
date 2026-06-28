import Image from "next/image";

interface MtgCardProps {
  cardName: string;
  imageUri: string | null;
  quantity: number;
  quantityOwned: number;
}

export function MtgCard({ cardName, imageUri, quantity, quantityOwned }: MtgCardProps) {
  const missing = quantity - quantityOwned;
  const isIncomplete = missing > 0;

  return (
    <div className="relative flex flex-col">
      <div
        className={`relative rounded-lg overflow-hidden ${
          isIncomplete ? "ring-2 ring-red-placeholder" : ""
        }`}
        style={{ aspectRatio: "488 / 680" }}
      >
        {imageUri ? (
          <Image
            src={imageUri}
            alt={cardName}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-dark-card flex items-center justify-center p-3">
            <p className="font-(family-name:--font-bricolage-grotesque) text-off-white text-xs text-center leading-snug">
              {cardName}
            </p>
          </div>
        )}

        {/* Quantity badge */}
        <span className="absolute top-1.5 right-1.5 bg-dark-brown/90 text-off-white font-(family-name:--font-inter) font-bold text-xs px-1.5 py-0.5 rounded">
          ×{quantity}
        </span>
      </div>

      {/* Missing indicator */}
      {isIncomplete && (
        <span className="mt-1 self-center bg-red-placeholder text-white font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs px-2 py-0.5 rounded uppercase">
          Missing {missing}
        </span>
      )}
    </div>
  );
}
