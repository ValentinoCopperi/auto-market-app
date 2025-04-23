import { Skeleton } from "@/components/ui/skeleton"
import { PublicacionesSkeleton } from "@/components/publicaciones/publicaciones-skeleton"
import { PerfilHeaderSkeleton } from "./_components/perfil-header-skeleton"
        
export default function PerfilLoading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Banner y perfil skeleton */}
      <PerfilHeaderSkeleton />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 mt-6">
        {/* Título y botón */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Publicaciones skeleton */}
        <PublicacionesSkeleton />
      </div>
    </div>
  )
}

