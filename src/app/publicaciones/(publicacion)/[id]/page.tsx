import { notFound } from "next/navigation"
import { getSession } from "@/lib/session/session"
import { PublicacionHeader } from "./_components/publicacion-header"
import { ImageCarousel } from "./_components/image-carrousel"
import { PublicacionDetails } from "./_components/publicacion-details"
import { PublicacionActions } from "./_components/publicacion-actions"
import { PublicacionContacto } from "./_components/publicacion-contacto"
import { VendedorCard } from "./_components/vendedor-card"
import { MensajesProvider } from "@/hooks/use-mensajes"
import type { PublicacionCompleto } from "@/types/publicaciones"
import { agregarVista } from "@/actions/publicaciones-actions"
import PublicacionEstadisticas from "./_components/publicacion-estadisticas"
import { puedeVerEstadisticas } from "@/actions/suscripcion-actions"
import { Breadcrumbs } from "./_components/breadcrumbs"
import { PublicacionJsonLd } from "./_components/publicacion-json-id"
import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { PublicacionesGrid } from "@/components/publicaciones/publicaciones-grid"
import Sugerencias from "./_components/sugerencias"

// Función para obtener la publicación con caché
const getPublicacion = async (id: string): Promise<PublicacionCompleto> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/${id}`)

  if (!response.ok) {
    notFound()
  }

  const data = await response.json()

  if (data.error) {
    notFound()
  }

  return data.publicacion
}



// Función para verificar si es favorito
const esPublicacionFavorita = async (id: string, userId: string | undefined): Promise<boolean> => {
  if (!userId) {
    return false
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/favoritos`, {
    method: "POST",
    body: JSON.stringify({ publicacionId: id, userId }),
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    return false
  }

  const data = await response.json()
  return data.esFavorito
}



// Generación de metadatos dinámicos
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params
    const publicacion = await getPublicacion(id)

    // Acceder a las propiedades de manera segura
    const marca = publicacion.marca.nombre
    const modelo = publicacion.modelo
    const año = publicacion.anio || ""

    const precio = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(publicacion.precio)

    const title = `${publicacion.titulo} | CarMarket`

    // Acceder a las propiedades de manera segura para la descripción
    const kilometraje = publicacion.kilometraje || ""
    const combustible = publicacion.tipo_combustible || ""
    const transmision = publicacion.tipo_transmision || ""

    const description = publicacion.descripcion
      ? publicacion.descripcion.substring(0, 155)
      : `${año} ${marca} ${modelo} en venta. ${kilometraje} km, ${combustible}, ${transmision}. Excelente estado.`

    // Construir URL de imagen principal
    const imagenPrincipal =
      publicacion.publicacion_imagenes && publicacion.publicacion_imagenes.length > 0
        ? publicacion.publicacion_imagenes[0].url
        : "/placeholder-car.jpg"

    return {
      title,
      description,
      keywords: [
        marca,
        modelo,
        `${marca} ${modelo}`,
        `${año} ${marca} ${modelo}`,
        "autos usados",
        "autos en venta",
        "comprar auto",
        combustible,
        transmision,
      ].filter(Boolean), // Filtrar valores vacíos o nulos
      alternates: {
        canonical: `https://carmarket.com.ar/publicaciones/${id}`,
      },
      openGraph: {
        title,
        description,
        url: `https://carmarket.com.ar/publicaciones/${id}`,
        type: "website",
        images: [
          {
            url: imagenPrincipal,
            width: 1200,
            height: 630,
            alt: `${año} ${marca} ${modelo}`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imagenPrincipal],
      },
    }
  } catch (error) {
    console.error("Error generando metadatos:", error)
    return {
      title: "Publicación no encontrada | CarMarket",
      description: "Lo sentimos, la publicación que estás buscando no existe o ha sido eliminada.",
    }
  }
}



const PublicacionPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const session = await getSession()

  // Obtener la publicación con sus relaciones
  const publicacion = await getPublicacion(id)

  if (!publicacion) {
    notFound()
  }

  let esFavorito = false
  let verEstadisticas = false

  // Verificar si el usuario actual es el propietario de la publicación
  const esEditable = session?.userId.toString() === publicacion.cliente.id.toString()

  if (!esEditable && session?.userId) {
    await agregarVista(publicacion.id, Number.parseInt(session?.userId))
    esFavorito = await esPublicacionFavorita(id, session?.userId)
  }

  if (esEditable && session?.userId) {
    const { data } = await puedeVerEstadisticas(Number(session?.userId))
    verEstadisticas = data || false
  }


  // Extraer marca y modelo de manera segura
  const marcaNombre = publicacion.marca.nombre
  const modeloNombre = publicacion.modelo

  return (
    <div className="min-h-screen bg-background pb-12">
      <PublicacionJsonLd publicacion={publicacion} />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs mejorados */}
        <Breadcrumbs marca={marcaNombre} modelo={modeloNombre} titulo={publicacion.titulo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Encabezado móvil (visible solo en móvil) */}
            <div className="block lg:hidden">
              <PublicacionHeader publicacion={publicacion} />
            </div>

            {/* Carrusel de imágenes */}
            <ImageCarousel imagenes={publicacion.publicacion_imagenes} titulo={publicacion.titulo} />

            {/* Encabezado desktop (visible solo en desktop) */}
            <div className="hidden lg:block">
              <PublicacionHeader publicacion={publicacion} />
            </div>

            {/* Detalles de la publicación visible en desktop*/}
            <div className="hidden lg:block">
              <PublicacionDetails publicacion={publicacion} />
            </div>

            {/* Acciones de publicación (solo visible en móvil) */}
            <div className="block lg:hidden space-y-4">
              <PublicacionActions publicacion={publicacion} esEditable={esEditable} esFavorito={esFavorito} />
              <PublicacionDetails publicacion={publicacion} />
              {esEditable && (
                <PublicacionEstadisticas id_publicacion={publicacion.id} verEstadisticas={verEstadisticas} />
              )}
            </div>
          </div>

          {/* Columna lateral (1/3) */}
          <div className="space-y-6">
            {/* Acciones de publicación (solo visible en desktop) */}
            <div className="hidden lg:block space-y-4">
              <PublicacionActions publicacion={publicacion} esEditable={esEditable} esFavorito={esFavorito} />
              {esEditable && (
                <PublicacionEstadisticas id_publicacion={publicacion.id} verEstadisticas={verEstadisticas} />
              )}
            </div>

            {/* Información de contacto */}
            <MensajesProvider>
              <PublicacionContacto
                telefono={publicacion.cliente.telefono}
                vendedorId={publicacion.cliente.id}
                esEditable={esEditable}
              />
            </MensajesProvider>

            {/* Tarjeta del vendedor */}
            <VendedorCard vendedor={publicacion.cliente} />
          </div>
        </div>
      </div>
      <Sugerencias marca={marcaNombre} id={id} />
    </div>
  )
}

export default PublicacionPage
