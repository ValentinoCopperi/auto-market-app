import type { PublicacionCompleto } from "@/types/publicaciones"

export function PublicacionJsonLd({ publicacion }: { publicacion: PublicacionCompleto }) {
  // Formatear el precio con separador de miles
  const precioFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(publicacion.precio)

  // Construir URL de imagen principal
  const imagenPrincipal =
    publicacion.publicacion_imagenes && publicacion.publicacion_imagenes.length > 0
      ? publicacion.publicacion_imagenes[0].url
      : "/placeholder-car.jpg"

  // Construir la descripción
  const descripcion =
    publicacion.descripcion ||
    `${publicacion.anio} ${publicacion.marca} ${publicacion.modelo}. ${publicacion.kilometraje} km, ${publicacion.tipo_combustible}, ${publicacion.tipo_transmision}.`

  // Construir el objeto JSON-LD para vehículos
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${publicacion.anio} ${publicacion.marca} ${publicacion.modelo}`,
    description: descripcion,
    brand: {
      "@type": "Brand",
      name: publicacion.marca,
    },
    model: publicacion.modelo,
    modelDate: publicacion.anio,
    vehicleIdentificationNumber: publicacion.id,
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
      priceValidUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Person",
        name: publicacion.cliente.nombre,
        telephone: publicacion.cliente.telefono,
      },
    },
    image: publicacion.publicacion_imagenes?.map((img) => img.url) || [imagenPrincipal],
    url: `https://carmarket.com.ar/publicaciones/${publicacion.id}`,
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
