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
import { Metadata } from "next"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>


// 1. Metadata dinámico para mejorar SEO
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const params = await searchParams
  const marca = params.marca ? String(params.marca) : null
  const modelo = params.modelo ? String(params.modelo) : null
  const año = params.año ? String(params.año) : null

  let title = "Publicaciones de autos"
  let description = "Encuentra los mejores autos nuevos y usados. Amplio catálogo con todas las marcas y modelos."

  if (marca) {
    title = `Autos ${marca}${modelo ? ` ${modelo}` : ""}${año ? ` ${año}` : ""} en venta`
    description = `Explora nuestra selección de autos ${marca}${modelo ? ` ${modelo}` : ""}${año ? ` del año ${año}` : ""} en venta. Encuentra el vehículo perfecto para ti.`
  }

  return {
    title,
    description,
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
      "buenos aires autos baratos",
      marca,
      modelo,
      `${marca} ${modelo}`,
      "catálogo de autos",
    ].filter((keyword): keyword is string => keyword !== null),
    alternates: {
      canonical: `https://tudominio.com/publicaciones${new URLSearchParams(params as Record<string, string>).toString() ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tudominio.com/publicaciones${new URLSearchParams(params as Record<string, string>).toString() ? `?${new URLSearchParams(params as Record<string, string>).toString()}` : ""}`,
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

  return (
    <div className="min-h-screen bg-background">
      <main className="px-3 md:px-12 lg:px-5 py-8">
        {/* Breadcrumbs no necesita esperar a que se carguen las publicaciones */}

        <div className="flex items-center text-sm mb-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Inicio
          </Link>

          <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />

          <Link href="/publicaciones" className="text-muted-foreground hover:text-foreground">
            Publicaciones
          </Link>
        </div>

        <h1 className="text-2xl font-bold py-2">{totalCount} Publicaciones encontradas</h1>

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
