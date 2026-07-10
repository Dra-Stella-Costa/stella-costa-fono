import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Capas de artigo vivem no bucket público `media` do Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "odanxowwlxijkugpfxhv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
