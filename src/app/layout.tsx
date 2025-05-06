import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavBar from "@/components/navbar"
import { Providers } from "@/components/providers/providers"
import { LoginDialog } from "@/components/dialogs/auth/login-dialog"
import { PublishDialog } from "@/components/dialogs/publicar/publicar-dialog"
import { RegisterDialog } from "@/components/dialogs/auth/register-dialog"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"

// Optimización de fuentes: cargar solo los pesos necesarios
const inter = Inter({
  weight: ["400", "500", "600"],
  style: "normal",
  display: "swap",
  subsets: ["latin-ext"],
  preload: true,
})

// Configuración de viewport para dispositivos móviles
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
}

// Metadatos mejorados para SEO
export const metadata: Metadata = {
  metadataBase: new URL("https://carmarket.com.ar"), // Cambia a tu dominio real
  title: {
    default: "CarMarket - Compra y venta de autos en Argentina",
    template: "%s | CarMarket Argentina",
  },
  description:
    "Encuentra los mejores autos nuevos y usados en Argentina. Amplio catálogo con todas las marcas y modelos a los mejores precios.",
  keywords: [
    "autos en venta",
    "vehículos usados",
    "comprar auto",
    "argentina",
    "autos en argentina",
    "autos en venta en argentina",
    "buenos aires",
    "buenos aires autos",
    "buenos aires autos en venta",
    "buenos aires autos usados",
    "buenos aires autos nuevos",
    "buenos aires autos baratos",
    "comprar auto en buenos aires",
    "comprar auto en argentina",
  ],
  // authors: [{ name: "CarMarket" }],
  // creator: "CarMarket",
  // publisher: "CarMarket Argentina",
  // formatDetection: {
  //   email: false,
  //   address: false,
  //   telephone: false,
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
  // icons: {
  //   icon: [
  //     { url: "/favicon.ico", sizes: "any" },
  //     { url: "/logo.png", sizes: "16x16", type: "image/png" },
  //     { url: "/logo.png", sizes: "32x32", type: "image/png" },
  //     { url: "/logo.png", sizes: "192x192", type: "image/png" },
  //     { url: "/logo.png", sizes: "512x512", type: "image/png" },
  //   ],
  //   apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  //   shortcut: "/logo.png",
  // },
  // manifest: "/manifest.json",
  // openGraph: {
  //   type: "website",
  //   locale: "es_AR",
  //   url: "https://carmarket.com.ar",
  //   siteName: "CarMarket Argentina",
  //   title: "CarMarket - Compra y venta de autos en Argentina",
  //   description:
  //     "Encuentra los mejores autos nuevos y usados en Argentina. Amplio catálogo con todas las marcas y modelos a los mejores precios.",
  //   images: [
  //     {
  //       url: "/og-image.jpg",
  //       width: 1200,
  //       height: 630,
  //       alt: "CarMarket - Compra y venta de autos en Argentina",
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "CarMarket - Compra y venta de autos en Argentina",
  //   description:
  //     "Encuentra los mejores autos nuevos y usados en Argentina. Amplio catálogo con todas las marcas y modelos a los mejores precios.",
  //   images: ["/twitter-image.jpg"],
  //   creator: "@carmarket",
  //   site: "@carmarket",
  // },
  // verification: {
  //   google: "tu-código-de-verificación-de-google", // Reemplaza con tu código real
  //   yandex: "tu-código-de-verificación-de-yandex", // Opcional
  // },
  // alternates: {
  //   canonical: "https://carmarket.com.ar",
  //   languages: {
  //     "es-AR": "https://carmarket.com.ar",
  //     "en-US": "https://carmarket.com.ar/en", // Si tienes versión en inglés
  //   },
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${inter.className} antialiased`}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background  flex flex-col">
          <Providers>
            <NavBar />
            <main className="flex-grow">
              <Suspense>{children}</Suspense>
            </main>
            <LoginDialog />
            <PublishDialog />
            <RegisterDialog />
            <Footer />
          </Providers>
        </div>
        <Analytics />
      </body>
    </html>
  )
}

// // Componente para agregar datos estructurados JSON-LD
// function WebsiteJsonLd() {
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     name: "CarMarket Argentina",
//     url: "https://carmarket.com.ar",
//     potentialAction: {
//       "@type": "SearchAction",
//       target: {
//         "@type": "EntryPoint",
//         urlTemplate: "https://carmarket.com.ar/publicaciones?q={search_term_string}",
//       },
//       "query-input": "required name=search_term_string",
//     },
//     sameAs: ["https://facebook.com/carmarket", "https://twitter.com/carmarket", "https://instagram.com/carmarket"],
//   }

//   return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
// }
