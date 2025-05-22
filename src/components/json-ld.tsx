"use client"

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CarMarket Argentina",
    url: "https://carmarketarg.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://carmarketarg.com/publicaciones?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    // sameAs: [
    //   "https://facebook.com/carmarket",
    //   "https://twitter.com/carmarket",
    //   "https://instagram.com/carmarket",
    //   "https://linkedin.com/company/carmarket",
    // ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CarMarket Argentina",
    url: "https://carmarketarg.com",
    logo: "https://carmarketarg.com/favicon.ico",
    description:
      "El marketplace líder de autos en Argentina. Compra, vende y financia vehículos nuevos y usados de todas las marcas.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "AR",
      addressLocality: "Buenos Aires",
      addressRegion: "CABA",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+54 9 2494628279",
      contactType: "customer service",
      availableLanguage: ["Spanish", "English"],
    },
    // sameAs: [
    //   "https://facebook.com/carmarket",
    //   "https://twitter.com/carmarket",
    //   "https://instagram.com/carmarket",
    //   "https://linkedin.com/company/carmarket",
    // ],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "CarMarket Argentina",
    image: "https://carmarketarg.com/apple-touch-icon.png",
    "@id": "https://carmarketarg.com",
    url: "https://carmarketarg.com",
    telephone: "+54 9 2494628279",
    // address: {
    //   "@type": "PostalAddress",
    //   streetAddress: "Av. Corrientes 1234",
    //   addressLocality: "Buenos Aires",
    //   postalCode: "C1043AAZ",
    //   addressCountry: "AR",
    // },
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
    priceRange: "$$",
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Compra y venta de vehículos",
      },
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
