import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["next-sanity"],
  turbopack: {
    root: path.join(__dirname, ".."),
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
