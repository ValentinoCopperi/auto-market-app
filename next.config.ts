import type { NextConfig } from "next";

const nextConfig : NextConfig = {
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: "10mb",
    }
  },
  
  images: {
    remotePatterns:[
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "kgpatxqsrtitjfqczaps.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/auto-market/**",
      },
    ],
  },
};
export default nextConfig;
