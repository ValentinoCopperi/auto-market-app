import { getPublicacionesByUsuario, getPublicacionesByUsuarioVendidos } from "@/actions/publicaciones-actions"
import { getSession } from "@/lib/session/session"
import { notFound } from "next/navigation"
import { TabsContent } from "@/components/ui/tabs"
import { SearchBar } from "@/components/search-bar"
import { PublicacionesGrid } from "@/components/publicaciones/publicaciones-grid"
import PublicarBtn from "../../_components/publicar-btn"






export default async function PerfilPublicacionesPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  if (!id) {
      notFound()
  }

  // Ejecutar consultas en paralelo
  const publicaciones = await getPublicacionesByUsuarioVendidos(Number(id))



  return (
      <div className="mt-0">
          <PublicacionesGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2" publicaciones={publicaciones} />
      </div>

  )
}

