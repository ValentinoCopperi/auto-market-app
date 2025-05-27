import { SearchBar } from "@/components/search-bar"
import PublicacionCard from "@/components/publicaciones/publicacion-card"
import { getSession } from "@/lib/session/session"
import { Metadata } from "next"
import { Publicacion } from "@/types/publicaciones"


type SearchParams = Promise<{ [q: string]: string | undefined }>

export const metadata: Metadata = {
  title: 'Mis Favoritos',
  description: 'Publicaciones que te gustan',
  alternates: {
    canonical: "https://carmarket.com/favoritos",
  },
  openGraph: {
    title: 'Mis Favoritos',
    description: 'Publicaciones que te gustan',
  },
}

const getFavoritos = async (q?: string) : Promise<Publicacion[]> => {

  const params = new URLSearchParams()

  const session = await getSession();
  if(!session?.userId){
    return []
  }

  if(q){
    params.set("q",q)
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/favoritos/${session.userId}?${params.toString()}`)

  if(!response.ok){
    return []
  }

  const data = await response.json()

  return data.favoritos;

}

export default async function FavoritosPage(props: { searchParams: SearchParams }) {

  const { q } = await (props.searchParams);

  const favoritos = await getFavoritos(q)

  const totalCount = favoritos ? favoritos.length : 0

  //   // Obtener parámetros de búsqueda y paginación
  //   const page = Number(searchParams.page) || 1
  //   const searchQuery = searchParams.q || ""

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>
        <p className="text-sm text-muted-foreground mb-4">Total de favoritos: {totalCount}</p>

        {/* Barra de búsqueda */}
        <div className="mb-8">
          <SearchBar placeholder="Buscar en mis favoritos..." baseUrl="/favoritos" />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {favoritos.length === 0 || !favoritos ? (
            <div className="text-center text-muted-foreground">No se encontraron publicaciones</div>
          ) : (
            favoritos.map((favorito) => (
              <PublicacionCard key={favorito.id} publicacion={favorito} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
