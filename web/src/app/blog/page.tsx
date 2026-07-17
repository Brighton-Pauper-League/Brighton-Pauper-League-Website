import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PostList } from "@/components/PostList";
import { getAllPosts } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "News, deck techs, tournament coverage, and community highlights from the Brighton Pauper League.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <Navbar />
      <main className="bg-off-white px-6 md:px-12 lg:px-20 py-16 md:py-24 lg:py-section-y min-h-[60vh]">
        <div className="max-w-360 mx-auto flex flex-col gap-12">
          <header className="flex flex-col gap-4">
            <h1 className="font-(family-name:--font-young-serif) text-4xl md:text-6xl lg:text-[72px] text-dark-brown leading-none">
              Blog
            </h1>
            <p className="font-(family-name:--font-bricolage-grotesque) text-xl text-black/70 max-w-200">
              News, deck techs, and community highlights from around the league.
            </p>
          </header>

          <PostList posts={posts} />
        </div>
      </main>
      <Footer />
    </>
  );
}
