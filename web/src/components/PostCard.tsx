import Link from "next/link";
import Image from "next/image";
import type { PostListItem } from "@/lib/types";
import { formatLongDate } from "@/lib/dates";
import { urlFor } from "@/sanity/lib/image";

// A blog post preview card linking to the full post. Renders a featured image
// when one is set, otherwise a branded placeholder block.
export function PostCard({ post }: { post: PostListItem }) {
  const imageUrl = post.featuredImage?.asset
    ? urlFor(post.featuredImage).width(800).height(450).fit("crop").url()
    : null;

  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[rgba(0,74,173,0.13)] hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-video bg-light-purple">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={post.featuredImage?.alt || post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        )}
      </div>
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center gap-3 text-sm text-dark-brown/60 font-(family-name:--font-bricolage-grotesque)">
          <span>{formatLongDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{post.author}</span>
        </div>
        <h3 className="font-(family-name:--font-young-serif) text-2xl text-dark-brown group-hover:text-primary-blue transition-colors">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-(family-name:--font-bricolage-grotesque) text-base text-black/70 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-primary-blue/10 text-primary-blue px-3 py-1 rounded-full text-xs font-(family-name:--font-bricolage-grotesque) font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
