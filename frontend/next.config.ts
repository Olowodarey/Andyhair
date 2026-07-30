import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeORM + the pg driver do dynamic requires / native loading — keep them out
  // of the server bundle and require them natively at runtime.
  serverExternalPackages: ["typeorm", "pg"],
  images: {
    // Product photos are served from Vercel Blob's public CDN.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
