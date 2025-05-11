"use client"

import type { Publicacion } from "@/types/publicaciones"

export function PublicacionesJsonLd({ publicaciones }: { publicaciones: Publicacion[] }) {
  // Structured data para la página de listados
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: publicaciones.map((publicacion, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Vehicle",
        name: publicacion.titulo,
        description: publicacion.descripcion,
        brand: {
          "@type": "Brand",
          name: publicacion.marca.nombre,
        },
        model: publicacion.modelo,
        modelDate: publicacion.anio,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: publicacion.kilometraje,
          unitCode: "KMT",
        },
        fuelType: publicacion.tipo_combustible,
        vehicleTransmission: publicacion.tipo_transmision,
        color: publicacion.color,
        offers: {
          "@type": "Offer",
          price: publicacion.precio,
          priceCurrency: "ARS",
          availability: "https://schema.org/InStock",
          url: `https://carmarketarg.com/publicaciones/${publicacion.id}`,
        },
        image: publicacion?.url_portada ? publicacion?.url_portada : "/",
        url: `https://carmarketarg.com/publicaciones/${publicacion.id}`,
      },
    })),
  }

  // Structured data para la página como WebPage
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Comprar Autos en Argentina | Vehículos Nuevos y Usados | CarMarket",
    description:
      "Encuentra los mejores autos en venta en Argentina. Miles de vehículos nuevos y usados de todas las marcas y modelos a precios competitivos.",
    url: "https://carmarketarg.com/publicaciones",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".description"],
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: publicaciones.slice(0, 3).map((publicacion, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://carmarketarg.com/publicaciones/${publicacion.id}`,
      })),
    },
  }

  // Structured data para FAQs relacionadas con la compra de autos
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo puedo comprar un auto en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para comprar un auto en Argentina a través de CarMarket, simplemente navega por nuestro catálogo, filtra según tus preferencias, contacta al vendedor y coordina la compra. Ofrecemos opciones de financiación y verificación de vehículos para una compra segura.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué documentos necesito para comprar un auto usado en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para comprar un auto usado en Argentina necesitarás: DNI, comprobante de domicilio, formulario 08 firmado por el vendedor, verificación policial del vehículo, libre deuda de patentes y multas, y el título del automotor.",
        },
      },
      {
        "@type": "Question",
        name: "¿Dónde puedo encontrar los mejores precios de autos en Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En CarMarket Argentina encontrarás los mejores precios de autos nuevos y usados. Nuestra plataforma conecta a compradores y vendedores directamente, eliminando intermediarios y ofreciendo precios más competitivos en todo el país.",
        },
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  )
}
