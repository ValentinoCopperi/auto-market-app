import LandingPage from "./_componenets/landing-page"
import { CategorySection } from "./_componenets/category-section"
import { BrandsSection } from "./_componenets/brands-section"
import { PublicacionesDestacadas } from "./_componenets/publicaciones-destacadas"
import { HomeJsonLd } from "./_componenets/home-json"
import type { Metadata } from "next"

// Metadatos optimizados para la página de inicio
export const metadata: Metadata = {
  title: "CarMarket | Compra y venta de autos en Argentina",
  description:
    "Encuentra los mejores autos nuevos y usados en Argentina. Miles de vehículos de todas las marcas y modelos a los mejores precios. ¡Publica gratis o encuentra tu próximo auto hoy!",
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
  ],
  // alternates: {
  //   canonical: "https://carmarket.com.ar",
  // },
  // openGraph: {
  //   title: "CarMarket | El marketplace líder de autos en Argentina",
  //   description:
  //     "Encuentra los mejores autos nuevos y usados en Argentina. Miles de vehículos de todas las marcas y modelos a los mejores precios.",
  //   url: "https://carmarket.com.ar",
  //   siteName: "CarMarket Argentina",
  //   images: [
  //     {
  //       url: "/og-home-image.jpg", // Asegúrate de tener esta imagen
  //       width: 1200,
  //       height: 630,
  //       alt: "CarMarket - Compra y venta de autos en Argentina",
  //     },
  //   ],
  //   locale: "es_AR",
  //   type: "website",
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "CarMarket | Compra y venta de autos en Argentina",
  //   description:
  //     "Encuentra los mejores autos nuevos y usados en Argentina. Miles de vehículos de todas las marcas y modelos a los mejores precios.",
  //   images: ["/twitter-home-image.jpg"], // Asegúrate de tener esta imagen
  //   creator: "@carmarket",
  //   site: "@carmarket",
  // },
  // robots: {
  //   index: true,
  //   follow: true,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     "max-image-preview": "large",
  //     "max-snippet": -1,
  //   },
  // },
}

const HomePage = async () => {
  return (
    <div>
      {/* JSON-LD para la página de inicio */}
      {/* <HomeJsonLd /> */}

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
