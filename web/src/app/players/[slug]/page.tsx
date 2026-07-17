import type { Metadata } from "next";
import { buildMetadata, resolveSeo } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getPlayerBySlug, getPlayerSlugs } from "@/lib/data";
import { playerDisplayName } from "@/lib/standings";
import { urlFor } from "@/sanity/lib/image";
import { formatLongDate } from "@/lib/dates";

export async function generateStaticParams() {
  const slugs = await getPlayerSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) return { title: "Player not found", robots: { index: false } };

  const displayName = playerDisplayName(player);

  return buildMetadata(
    resolveSeo(player.seo, {
      title: displayName,
      description: player.bio ?? `${displayName} — Brighton Pauper League member.`,
      path: `/players/${slug}`,
      fallbackImage: player.image,
    })
  );
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = await getPlayerBySlug(slug);
  if (!player) notFound();

  const displayName = playerDisplayName(player);
  const imageUrl = player.image?.asset
    ? urlFor(player.image).width(800).height(800).fit("crop").url()
    : null;

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-8">
          <Link
            href="/players"
            className="font-(family-name:--font-bricolage-grotesque) text-base text-primary-blue hover:text-darker-blue transition-colors w-fit"
          >
            ← Back to members
          </Link>

          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* Avatar */}
            <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-2xl overflow-hidden bg-light-purple flex-shrink-0">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={player.image?.alt || displayName}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 224px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-(family-name:--font-young-serif) text-7xl text-primary-blue/30">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-5xl text-dark-brown leading-none">
                  {displayName}
                </h1>
                <div className="flex items-center gap-3 font-(family-name:--font-bricolage-grotesque) text-sm text-black/50">
                  {player.joinDate && (
                    <span>Member since {formatLongDate(player.joinDate)}</span>
                  )}
                  {!player.isActive && (
                    <>
                      {player.joinDate && <span>·</span>}
                      <span className="uppercase">Inactive</span>
                    </>
                  )}
                </div>
              </div>

              {player.bio && (
                <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black/70 leading-relaxed max-w-prose">
                  {player.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
