import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "./safari.css"
import NavBar from "@/components/navbar"
import { Providers } from "@/components/providers/providers"
import { LoginDialog } from "@/components/dialogs/auth/login-dialog"
import { PublishDialog } from "@/components/dialogs/publicar/publicar-dialog"
import { RegisterDialog } from "@/components/dialogs/auth/register-dialog"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { LocalBusinessJsonLd } from "@/components/json-ld"
import { WebsiteJsonLd } from "@/components/json-ld"
import { OrganizationJsonLd } from "@/components/json-ld"


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
  metadataBase: new URL("https://carmarketarg.com"),
  title: {
    default: "CarMarket Argentina - Compra y venta de autos nuevos y usados",
    template: "%s | CarMarket Argentina",
  },
  description:
    "El marketplace líder de autos en Argentina. Compra, vende y financia vehículos nuevos y usados de todas las marcas. Precios competitivos y proceso seguro.",
  keywords: [
    "autos en venta",
    "vehículos usados",
    "comprar auto",
    "vender auto",
    "marketplace de autos",
    "argentina",
    "autos en argentina",
    "autos en venta en argentina",
    "buenos aires",
    "córdoba",
    "rosario",
    "mendoza",
    "financiación de autos",
    "concesionarios",
    "particulares",
    "tasación de vehículos",
    "comparador de precios",
    "mejores ofertas autos",
    "carmarketarg",
  ],
  authors: [{ name: "CarMarket Argentina" }],
  creator: "CarMarket Argentina",
  publisher: "CarMarket Argentina",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      // { url: "/logo.png", sizes: "16x16", type: "image/png" },
      // { url: "/logo.png", sizes: "32x32", type: "image/png" },
      // { url: "/logo.png", sizes: "192x192", type: "image/png" },
      // { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://carmarketarg.com",
    siteName: "CarMarket Argentina",
    title: "CarMarket Argentina - El marketplace líder de autos",
    description:
      "Encuentra los mejores autos nuevos y usados en Argentina. Amplio catálogo con todas las marcas y modelos a los mejores precios.",
    images: [
      {
        url: "https://carmarketarg.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CarMarket Argentina - Marketplace de autos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarMarket Argentina - El marketplace líder de autos",
    description:
      "Encuentra los mejores autos nuevos y usados en Argentina. Amplio catálogo con todas las marcas y modelos a los mejores precios.",
    images: ["https://carmarketarg.com/favicon.ico"],
    creator: "@carmarket",
    site: "@carmarket",
  },
  verification: {
    google: "tu-código-de-verificación-de-google", // Reemplaza con tu código real
    yandex: "tu-código-de-verificación-de-yandex", // Opcional
    
  },
  alternates: {
    canonical: "https://carmarketarg.com",
    languages: {
      "es-AR": "https://carmarketarg.com",
      "en-US": "https://carmarketarg.com", // Si tienes versión en inglés
    },
  },
  category: "automotive",
  applicationName: "CarMarket Argentina",
  other: {
    "geo.region": "AR",
    "geo.placename": "Argentina",
    "revisit-after": "7 days",
    "msapplication-TileColor": "#ffffff",
    "msapplication-config": "/browserconfig.xml",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={`${inter.className} antialiased`} itemScope itemType="https://schema.org/WebPage">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-background flex flex-col">
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
        <script src="https://www.mercadopago.com/v2/security.js"></script>
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <LocalBusinessJsonLd />
        <Analytics />
      </body>
    </html>
  )
}
