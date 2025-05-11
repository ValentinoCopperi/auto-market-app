"use client"

export function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://carmarketarg.com/#webpage",
    url: "https://carmarketarg.com/",
    name: "CarMarket Argentina | Marketplace Líder de Compra y Venta de Autos",
    description:
      "El marketplace #1 de autos en Argentina. Miles de vehículos nuevos y usados de todas las marcas. Compra, vende y financia tu auto de forma segura y rápida.",
    isPartOf: {
      "@id": "https://carmarketarg.com/#website",
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://carmarketarg.com/og-home-image.jpg",
      width: 1200,
      height: 630,
    },
    inLanguage: "es-AR",
    potentialAction: [
      {
        "@type": "ReadAction",
        target: ["https://carmarketarg.com/"],
      },
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://carmarketarg.com/publicaciones?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Compra de Autos",
          url: "https://carmarketarg.com/publicaciones",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Venta de Autos",
          url: "https://carmarketarg.com/vender",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Financiación",
          url: "https://carmarketarg.com/financiacion",
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Tasación",
          url: "https://carmarketarg.com/tasacion",
        },
      ],
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-description"],
    },
    specialty: "Marketplace de autos en Argentina",
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function FeaturedVehiclesJsonLd({ vehicles }: { vehicles: any[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Vehicle",
        name: vehicle.title,
        description: vehicle.description,
        brand: {
          "@type": "Brand",
          name: vehicle.brand,
        },
        model: vehicle.model,
        modelDate: vehicle.year,
        vehicleIdentificationNumber: vehicle.vin,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "KMT",
        },
        fuelType: vehicle.fuelType,
        vehicleTransmission: vehicle.transmission,
        offers: {
          "@type": "Offer",
          price: vehicle.price,
          priceCurrency: "ARS",
          availability: "https://schema.org/InStock",
          url: `https://carmarketarg.com/vehiculo/${vehicle.id}`,
        },
        image: vehicle.images.map((img: string) => `https://carmarketarg.com${img}`),
      },
    })),
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function FAQJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo puedo vender mi auto en CarMarket Argentina?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Vender tu auto en CarMarket Argentina es muy sencillo. Solo necesitas registrarte, completar los datos de tu vehículo, subir fotos de calidad y publicarlo. Tu anuncio estará visible para miles de compradores potenciales. También ofrecemos servicios de tasación gratuita para ayudarte a establecer el precio correcto.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué documentación necesito para comprar un auto usado?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Para comprar un auto usado en Argentina necesitarás: DNI, comprobante de domicilio, formulario 08 firmado por el vendedor, verificación policial del vehículo, libre deuda de patentes y multas, y el título del automotor. En CarMarket Argentina te guiamos durante todo el proceso para que sea seguro y transparente.",
        },
      },
      {
        "@type": "Question",
        name: "¿CarMarket Argentina ofrece financiación para la compra de autos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, CarMarket Argentina ofrece diversas opciones de financiación para la compra de vehículos. Trabajamos con múltiples entidades financieras para ofrecerte las mejores tasas y plazos adaptados a tus necesidades. Puedes solicitar una pre-aprobación directamente desde nuestra plataforma.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo funciona la garantía en los autos usados?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En CarMarket Argentina, los autos usados pueden contar con garantía dependiendo del vendedor. Los concesionarios suelen ofrecer garantías de 3 a 12 meses en componentes principales. Además, ofrecemos un servicio de inspección técnica opcional para verificar el estado del vehículo antes de la compra, dándote mayor tranquilidad en tu decisión.",
        },
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function BreadcrumbJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://carmarketarg.com",
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
