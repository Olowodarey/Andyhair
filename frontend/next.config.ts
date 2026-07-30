import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // TypeORM does dynamic requires / native driver loading — keep it out of the
  // server bundle and require it natively at runtime. (`pg` is auto-externalized.)
  serverExternalPackages: ["typeorm"],
  images: {
    // Product photos are served from Vercel Blob's public CDN.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
