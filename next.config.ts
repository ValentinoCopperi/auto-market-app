/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    useCache: true,
    serverActions: {
      bodySizeLimit: "50mb",
    },
    serverComponentsExternalPackages: ["sharp"],
  },
  images: {
    remotePatterns: [
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
    unoptimized: true,
  },
  // Configuración para aumentar el tiempo de ejecución en Vercel
  serverRuntimeConfig: {
    maxDuration: 300, // 5 minutos en segundos
  },
}

export default nextConfig
