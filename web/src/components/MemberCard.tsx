import Link from "next/link";
import Image from "next/image";
import type { PlayerCard } from "@/lib/types";
import { playerDisplayName } from "@/lib/standings";
import { urlFor } from "@/sanity/lib/image";

export function MemberCard({ player }: { player: PlayerCard }) {
  const displayName = playerDisplayName(player);
  const imageUrl = player.image?.asset
    ? urlFor(player.image).width(400).height(400).fit("crop").url()
    : null;
  const slug = player.slug?.current;

  const card = (
    <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(0,74,173,0.13)] hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-light-purple">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={player.image?.alt || displayName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-(family-name:--font-young-serif) text-5xl text-primary-blue/30">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 p-5">
        <div className="flex items-center gap-2">
          <h3 className="font-(family-name:--font-young-serif) text-xl text-dark-brown group-hover:text-primary-blue transition-colors flex-1">
            {displayName}
          </h3>
          {!player.isActive && (
            <span className="text-xs font-(family-name:--font-bricolage-grotesque) text-black/40 uppercase">
              inactive
            </span>
          )}
        </div>
        {player.bio && (
          <p className="font-(family-name:--font-bricolage-grotesque) text-sm text-black/60 line-clamp-3 leading-relaxed">
            {player.bio}
          </p>
        )}
      </div>
    </div>
  );

  if (!slug) return card;

  return (
    <Link href={`/players/${slug}`} className="block">
      {card}
    </Link>
  );
}
