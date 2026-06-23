import type { PostListItem } from "@/lib/types";
import { PostCard } from "./PostCard";
import { EmptyState } from "./EmptyState";

// Responsive grid of post cards with an empty state. Used on the /blog page.
export function PostList({
  posts,
  emptyMessage = "No posts published yet — check back soon.",
}: {
  posts: PostListItem[];
  emptyMessage?: string;
}) {
  if (posts.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}
