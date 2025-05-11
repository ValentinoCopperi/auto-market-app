import LandingPage from "./_componenets/landing-page"
import { CategorySection } from "./_componenets/category-section"
import { BrandsSection } from "./_componenets/brands-section"
import { PublicacionesDestacadas } from "./_componenets/publicaciones-destacadas"
import { HomeJsonLd } from "./_componenets/home-json"
import type { Metadata } from "next"

// Metadatos optimizados para la página de inicio
export const metadata: Metadata = {
  title: "CarMarket Argentina | Marketplace Líder de Compra y Venta de Autos",
  description:
    "El marketplace #1 de autos en Argentina. Miles de vehículos nuevos y usados de todas las marcas. Compra, vende y financia tu auto de forma segura y rápida. ¡Publica gratis!",
  keywords: [
    "compra de autos",
    "venta de autos",
    "autos usados",
    "autos nuevos",
    "marketplace de autos",
    "autos en Argentina",
    "comprar auto usado",
    "vender mi auto",
    "autos baratos",
    "mejores ofertas de autos",
    "financiación de autos",
    "tasación de vehículos",
    "concesionarios",
    "particulares",
    "carmarketarg",
  ],
  alternates: {
    canonical: "https://carmarketarg.com",
  },
  openGraph: {
    title: "CarMarket Argentina | El Marketplace Líder de Autos",
    description:
      "El marketplace #1 de autos en Argentina. Miles de vehículos nuevos y usados de todas las marcas. Compra, vende y financia tu auto de forma segura y rápida.",
    url: "https://carmarketarg.com",
    siteName: "CarMarket Argentina",
    images: [
      {
        url: "https://carmarketarg.com/og-home-image.jpg",
        width: 1200,
        height: 630,
        alt: "CarMarket Argentina - Marketplace líder de autos",
      },
    ],
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarMarket Argentina | Marketplace Líder de Autos",
    description:
      "El marketplace #1 de autos en Argentina. Miles de vehículos nuevos y usados de todas las marcas. Compra, vende y financia tu auto de forma segura y rápida.",
    images: ["https://carmarketarg.com/twitter-home-image.jpg"],
    creator: "@carmarket",
    site: "@carmarket",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
}

const HomePage = async () => {
  return (
    <div>
      {/* JSON-LD para la página de inicio */}
      <HomeJsonLd />

      <LandingPage />
      <div className="bg-[#F9FAFB] dark:bg-[#00000063]">
        <div className="container">
          <CategorySection />
          <BrandsSection />
          <PublicacionesDestacadas />
        </div>
      </div>
    </div>
  )
}

export default HomePage
