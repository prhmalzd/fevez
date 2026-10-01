import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "coverartarchive.org" },
      { protocol: "https", hostname: "archive.org" },
      { protocol: "https", hostname: "images.igdb.com" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
