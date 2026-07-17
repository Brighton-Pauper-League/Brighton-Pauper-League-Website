import type { Metadata } from "next";
import { buildMetadata, resolveSeo } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PortableTextBody } from "@/components/PortableTextBody";
import { getPostBySlug } from "@/lib/data";
import { formatLongDate } from "@/lib/dates";
import { urlFor } from "@/sanity/lib/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };

  return buildMetadata(
    resolveSeo(post.seo, {
      title: post.title,
      description: post.excerpt,
      path: `/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      fallbackImage: post.featuredImage,
    })
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const heroUrl = post.featuredImage?.asset
    ? urlFor(post.featuredImage).width(1600).height(900).fit("crop").url()
    : null;

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <article className="max-w-200 mx-auto flex flex-col gap-8">
          <Link
            href="/blog"
            className="font-(family-name:--font-bricolage-grotesque) text-base text-primary-blue hover:text-darker-blue transition-colors w-fit"
          >
            ← Back to blog
          </Link>

          <header className="flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-dark-brown/60 font-(family-name:--font-bricolage-grotesque)">
              <span>{formatLongDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.author}</span>
            </div>
            <h1 className="font-(family-name:--font-young-serif) text-3xl md:text-4xl lg:text-[56px] text-dark-brown leading-tight">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70">
                {post.excerpt}
              </p>
            )}
          </header>

          {heroUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
              <Image
                src={heroUrl}
                alt={post.featuredImage?.alt || post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 800px) 100vw, 800px"
              />
            </div>
          )}

          {post.body && post.body.length > 0 ? (
            <PortableTextBody value={post.body as PortableTextBlock[]} />
          ) : (
            <p className="font-(family-name:--font-bricolage-grotesque) text-lg text-black/60">
              This post has no content yet.
            </p>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
