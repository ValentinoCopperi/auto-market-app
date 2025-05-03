import { getPublicacionesByUsuario } from "@/actions/publicaciones-actions"
import { getSession } from "@/lib/session/session"
import { notFound } from "next/navigation"
import { TabsContent } from "@/components/ui/tabs"
import { SearchBar } from "@/components/search-bar"
import { PublicacionesGrid } from "@/components/publicaciones/publicaciones-grid"
import PublicarBtn from "../../_components/publicar-btn"






export default async function PerfilPublicacionesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [q: string]: string }>
}) {
  const { id } = await params
  const { q } = await searchParams

  if (!id) {
      notFound()
  }

  // Ejecutar consultas en paralelo
  const publicaciones = await getPublicacionesByUsuario(Number(id), q)



  return (
      <div className="mt-0">
          <SearchBar baseUrl={`/perfil/${id}/publicaciones`} />
          <PublicacionesGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2" publicaciones={publicaciones} />
      </div>

  )
}

