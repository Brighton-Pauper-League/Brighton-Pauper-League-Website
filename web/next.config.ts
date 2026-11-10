import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["next-sanity"],
  turbopack: {
    root: path.join(__dirname, ".."),
  },
  // Permanent (308) redirects for URLs that have moved, so old links and search
  // results keep working. Add an entry here whenever a player's slug changes.
  async redirects() {
    return [
      {
        source: "/players/xavier-e",
        destination: "/players/xavier-evenden-davis",
        permanent: true,
      },
    ];
  },
  images: {
    contentDispositionType: "inline",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cards.scryfall.io",
      },
    ],
  },
};

export default nextConfig;
