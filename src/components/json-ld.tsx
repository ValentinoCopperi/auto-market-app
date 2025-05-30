"use client"


export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CarMarket Argentina",
    alternateName: "CarMarket",
    url: "https://carmarketarg.com",
    description: "El marketplace líder de autos en Argentina. Compra, vende y financia vehículos nuevos y usados.",
    inLanguage: "es-AR",
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://carmarketarg.com/publicaciones?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    ],
    publisher: {
      "@type": "Organization",
      name: "CarMarket Argentina",
      url: "https://carmarketarg.com",
    },
    // Descomenta cuando tengas redes sociales
    // sameAs: [
    //   "https://facebook.com/carmarketarg",
    //   "https://twitter.com/carmarketarg",
    //   "https://instagram.com/carmarketarg",
    //   "https://linkedin.com/company/carmarketarg",
    // ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://carmarketarg.com/#organization",
    name: "CarMarket Argentina",
    legalName: "CarMarket Argentina S.A.", // Ajusta según tu razón social
    url: "https://carmarketarg.com",
    logo: {
      "@type": "ImageObject",
      url: "https://carmarketarg.com/logo.png", // Cambia por tu logo real
      width: 512,
      height: 512,
    },
    image: "https://carmarketarg.com/logo.png",
    description:
      "El marketplace líder de autos en Argentina. Compra, vende y financia vehículos nuevos y usados de todas las marcas con garantía y financiación.",
    foundingDate: "2020", // Ajusta según tu fecha real
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressLocality: "Buenos Aires",
      addressRegion: "CABA",
      // streetAddress: "Av. Corrientes 1234", // Descomenta si tienes dirección física
      // postalCode: "C1043AAZ"
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+54-9-2494-628279",
        contactType: "customer service",
        availableLanguage: ["Spanish"],
        areaServed: "AR",
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      },
      {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: ["Spanish"],
        areaServed: "AR",
      },
    ],
    areaServed: {
      "@type": "Country",
      name: "Argentina",
    },
    knowsAbout: [
      "Venta de automóviles",
      "Compra de vehículos usados",
      "Financiación automotriz",
      "Tasación de vehículos",
      "Marketplace automotriz",
    ],
    // sameAs: [
    //   "https://facebook.com/carmarketarg",
    //   "https://twitter.com/carmarketarg",
    //   "https://instagram.com/carmarketarg",
    // ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function AutomotiveBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutomotiveBusiness",
    "@id": "https://carmarketarg.com/#business",
    name: "CarMarket Argentina",
    image: ["https://carmarketarg.com/favicon.ico", "https://carmarketarg.com/apple-touch-icon.png"],
    url: "https://carmarketarg.com",
    telephone: "+54-9-2494-628279",
    priceRange: "$$-$$$",
    currenciesAccepted: "ARS",
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer", "Financing"],
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressLocality: "Buenos Aires",
      addressRegion: "Buenos Aires",
      // streetAddress: "Av. Corrientes 1234", // Descomenta si tienes dirección
      // postalCode: "C1043AAZ"
    },
    // geo: {
    //   "@type": "GeoCoordinates",
    //   latitude: -34.6037,
    //   longitude: -58.3816,
    // },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "14:00",
      },
    ],
    areaServed: [
      {
        "@type": "State",
        name: "Buenos Aires",
      },
      {
        "@type": "State",
        name: "Córdoba",
      },
      {
        "@type": "State",
        name: "Santa Fe",
      },
      {
        "@type": "Country",
        name: "Argentina",
      },
    ],
    serviceType: ["New Car Sales", "Used Car Sales", "Auto Financing", "Vehicle Appraisal", "Auto Marketplace"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de Vehículos",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Autos Nuevos",
          itemListElement: {
            "@type": "Product",
            category: "Automóviles Nuevos",
          },
        },
        {
          "@type": "OfferCatalog",
          name: "Autos Usados",
          itemListElement: {
            "@type": "Product",
            category: "Automóviles Usados",
          },
        },
      ],
    },
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Venta de vehículos nuevos",
          serviceType: "Automotive Sales",
        },
        areaServed: "Argentina",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Venta de vehículos usados",
          serviceType: "Used Car Sales",
        },
        areaServed: "Argentina",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Financiación automotriz",
          serviceType: "Auto Financing",
        },
        areaServed: "Argentina",
      },
    ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
