export function HomeJsonLd() {
    // JSON-LD para la organización/negocio
    const organizationJsonLd = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "CarMarket Argentina",
      url: "https://carmarket.com.ar",
      logo: "https://carmarket.com.ar/logo.png",
      sameAs: [
        "https://facebook.com/carmarket",
        "https://twitter.com/carmarket",
        "https://instagram.com/carmarket",
        "https://linkedin.com/company/carmarket",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+54-11-1234-5678",
          contactType: "customer service",
          areaServed: "AR",
          availableLanguage: "Spanish",
        },
      ],
    }
  
    // JSON-LD para el sitio web
    const websiteJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "CarMarket Argentina",
      url: "https://carmarket.com.ar",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://carmarket.com.ar/publicaciones?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    }
  
    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </>
    )
  }
  