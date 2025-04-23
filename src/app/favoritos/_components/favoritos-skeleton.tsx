import { Skeleton } from "@/components/ui/skeleton"

export function FavoritosSkeleton() {
  return (
    <div className="space-y-8">
      {/* Título y contador skeleton */}
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Barra de búsqueda skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Grid de favoritos skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card rounded-lg border border-border overflow-hidden shadow-sm animate-pulse">
            {/* Imagen skeleton */}
            <Skeleton className="h-48 w-full" />

            <div className="p-4">
              {/* Título y precio */}
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              {/* Vendedor */}
              <div className="flex justify-between mb-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>

              {/* Estadísticas y botón */}
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación skeleton */}
      <div className="flex justify-center mt-8">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-9" />
          ))}
        </div>
      </div>
    </div>
  )
}

