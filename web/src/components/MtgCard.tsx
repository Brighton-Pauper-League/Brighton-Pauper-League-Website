import Image from "next/image";

interface MtgCardProps {
  cardName: string;
  imageUri: string | null;
  imageUriBack?: string | null;
  quantity: number;
  quantityOwned: number;
}

export function MtgCard({
  cardName,
  imageUri,
  imageUriBack,
  quantity,
  quantityOwned,
}: MtgCardProps) {
  const missing = quantity - quantityOwned;
  const isIncomplete = missing > 0;
  const isDfc = Boolean(imageUriBack);

  return (
    <div className="relative flex flex-col">
      <div
        className={`relative rounded-lg ${isIncomplete ? "ring-2 ring-red-placeholder" : ""}`}
        style={{ aspectRatio: "488 / 680", ...(isDfc ? { perspective: "1000px" } : {}) }}
      >
        {isDfc ? (
          // Double-faced card — CSS hover flip
          <div className="absolute inset-0 transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]">
            <div className="absolute inset-0 rounded-lg overflow-hidden [backface-visibility:hidden]">
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
            </div>
            <div className="absolute inset-0 rounded-lg overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <Image
                src={imageUriBack!}
                alt={`${cardName} — back face`}
                fill
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
                className="object-cover"
              />
            </div>
          </div>
        ) : imageUri ? (
          <Image
            src={imageUri}
            alt={cardName}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 20vw"
            className="object-cover rounded-lg"
          />
        ) : (
          <div className="absolute inset-0 rounded-lg bg-dark-card flex items-center justify-center p-3">
            <p className="font-(family-name:--font-bricolage-grotesque) text-off-white text-xs text-center leading-snug">
              {cardName}
            </p>
          </div>
        )}

        {/* Quantity badge — sits above the flip container so it doesn't rotate */}
        <span className="absolute top-1.5 right-1.5 z-10 bg-dark-brown/90 text-off-white font-(family-name:--font-inter) font-bold text-xs px-1.5 py-0.5 rounded">
          ×{quantity}
        </span>
      </div>

      {isIncomplete && (
        <span className="mt-1 self-center bg-red-placeholder text-white font-(family-name:--font-bricolage-grotesque) font-extrabold text-xs px-2 py-0.5 rounded uppercase">
          Missing {missing}
        </span>
      )}
    </div>
  );
}
