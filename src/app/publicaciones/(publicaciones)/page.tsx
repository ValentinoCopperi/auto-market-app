import { getPublicaciones } from "@/actions/publicaciones-actions"
import { filtros } from "@/types/filtros"
import { FilterSidebar } from "./_components/filter-sidebar"
import { PublicacionesGrid } from "@/components/publicaciones/publicaciones-grid"
import { Pagination } from "./_components/pagination"
import { getMarcas } from "@/actions/marcas-actions"
import type { Marca } from "@/types/publicaciones"
import { Home } from "lucide-react"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import type { Metadata } from "next"
import { PublicacionesJsonLd } from "./_components/publicaciones-json-ld"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

// 1. Metadata dinámico mejorado para SEO
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams
  const marca = params.marca ? String(params.marca) : null
  const modelo = params.modelo ? String(params.modelo) : null
  const año = params.año ? String(params.año) : null
  const ubicacion = params.ubicacion ? String(params.ubicacion) : "Argentina"

  // Títulos y descripciones optimizados para SEO
  let title = "Comprar Autos en Argentina | Vehículos Nuevos y Usados | CarMarket"
  let description =
    "Encuentra los mejores autos en venta en Argentina. Miles de vehículos nuevos y usados de todas las marcas y modelos a precios competitivos. ¡Compra tu auto hoy!"

  if (marca) {
    title = `Autos ${marca}${modelo ? ` ${modelo}` : ""}${año ? ` ${año}` : ""} en venta en Argentina | CarMarket`
    description = `Explora nuestra selección de autos ${marca}${modelo ? ` ${modelo}` : ""}${año ? ` del año ${año}` : ""} en venta en Argentina. Precios competitivos y financiación disponible. ¡Encuentra tu ${marca} ideal!`
  }

  // Keywords más específicas y relevantes
  const keywordsList = [
    "autos en venta Argentina",
    "comprar autos Argentina",
    "vehículos usados Argentina",
    "autos nuevos Argentina",
    "marketplace autos Argentina",
    "mejores precios autos",
    "financiación autos Argentina",
    marca && `${marca} Argentina`,
    marca && modelo && `${marca} ${modelo} Argentina`,
    marca && `comprar ${marca}`,
    marca && modelo && `comprar ${marca} ${modelo}`,
    "catálogo de autos Argentina",
    "autos baratos Argentina",
    "ofertas autos Argentina",
    ubicacion && `autos en ${ubicacion}`,
    "venta de autos",
    "compra de autos",
  ].filter((keyword): keyword is string => keyword !== null)

  return {
    title,
    description,
    keywords: keywordsList,
    alternates: {
      canonical: `https://carmarketarg.com/publicaciones${new URLSearchParams(params as Record<string, string>).toString() ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://carmarketarg.com/publicaciones${new URLSearchParams(params as Record<string, string>).toString() ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""}`,
      images: [
        {
          url: "https://carmarketarg.com/og-publicaciones.jpg",
          width: 1200,
          height: 630,
          alt: `Autos en venta en Argentina${marca ? ` - ${marca}` : ""}`,
        },
      ],
    },
  }
}

export default async function PublicacionesPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams

  // Recomendado - más flexible
  const validSearchParams = Object.fromEntries(Object.entries(searchParams).filter(([key]) => filtros.includes(key)))

  const marcas: Marca[] = await getMarcas()

  let marca = null

  if (searchParams.marca) {
    marca = marcas.find((m) => m.nombre === searchParams.marca)
  }
  const { data: publicaciones, totalCount } = await getPublicaciones(validSearchParams, marca?.id)

  const page = searchParams.page ? Number.parseInt(searchParams.page as string) : 1
  const pageSize = searchParams.pageSize ? Number.parseInt(searchParams.pageSize as string) : 9
  const totalPages = Math.ceil((totalCount || 0) / pageSize)

  // Título optimizado para SEO
  const pageTitle = marca
    ? `Autos ${marca.nombre} en venta en Argentina`
    : "Comprar Autos en Argentina - Nuevos y Usados"

  // Descripción para la página
  const pageDescription = marca
    ? `Explora nuestra selección de autos ${marca.nombre} en venta en Argentina. Encuentra el vehículo perfecto para ti.`
    : "Encuentra los mejores autos nuevos y usados en Argentina. Amplio catálogo con todas las marcas y modelos a precios competitivos."

  return (
    <div className="min-h-screen bg-background">
      {/* Structured data para la página de listados */}
      <PublicacionesJsonLd publicaciones={publicaciones} />

      <main className="px-3 md:px-12 lg:px-5 py-8">
        {/* Breadcrumbs mejorados con microdata */}
        <nav aria-label="Breadcrumb" className="flex items-center text-sm mb-6">
          <ol itemScope itemType="https://schema.org/BreadcrumbList" className="flex items-center">
            <li
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
              className="flex items-center"
            >
              <Link href="/" itemProp="item" className="text-muted-foreground hover:text-foreground flex items-center">
                <Home className="h-4 w-4 mr-1" />
                <span itemProp="name">Inicio</span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>

            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />

            <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
              <Link href="/publicaciones" itemProp="item" className="text-muted-foreground hover:text-foreground">
                <span itemProp="name">Publicaciones</span>
              </Link>
              <meta itemProp="position" content="2" />
            </li>

            {marca && (
              <>
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                  <span itemProp="name" className="font-medium">
                    {marca.nombre}
                  </span>
                  <meta itemProp="position" content="3" />
                </li>
              </>
            )}
          </ol>
        </nav>

        {/* Título principal optimizado para SEO */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-muted-foreground mt-2">{pageDescription}</p>
        </div>

        {/* Contador de resultados */}
        <div className="mb-4">
          <p className="text-lg">
            <strong>{totalCount}</strong> vehículos encontrados
            {marca ? ` de la marca ${marca.nombre}` : " en Argentina"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-3 xl:gap-8">
          {/* Sidebar que carga las marcas - ahora se maneja responsivamente */}
          <div className="w-full lg:w-1/4">
            <FilterSidebar marcas={marcas} currentFilters={validSearchParams} />
          </div>

          {/* Contenido principal con publicaciones */}
          <div className="w-full flex flex-col gap-4 lg:w-3/4">
            <SearchBar />

            <PublicacionesGrid publicaciones={publicaciones} />

            {totalPages > 1 && <Pagination totalPages={totalPages} currentPage={page} searchParams={searchParams} />}
          </div>
        </div>
      </main>
    </div>
  )
}
