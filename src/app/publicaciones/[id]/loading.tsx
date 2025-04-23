import { Skeleton } from "@/components/ui/skeleton"

export default function PublicacionLoading() {
  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skeleton para el encabezado móvil */}
            <div className="block lg:hidden">
              <div className="space-y-3">
                <Skeleton className="h-8 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* Skeleton para el carrusel de imágenes */}
            <div className="space-y-2">
              <Skeleton className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg" />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 flex-shrink-0 rounded" />
                ))}
              </div>
            </div>

            {/* Skeleton para el encabezado desktop */}
            <div className="hidden lg:block">
              <div className="space-y-3">
                <Skeleton className="h-10 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-10 w-40" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>

            {/* Skeleton para los detalles */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>

            {/* Skeleton para acciones móviles */}
            <div className="block lg:hidden">
              <div className="bg-card rounded-lg border border-border p-4">
                <Skeleton className="h-10 w-full mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Columna lateral (1/3) */}
          <div className="space-y-6">
            {/* Skeleton para acciones desktop */}
            <div className="hidden lg:block">
              <div className="bg-card rounded-lg border border-border p-4">
                <Skeleton className="h-6 w-24 mb-1" />
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-10 w-full mb-3" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>

            {/* Skeleton para contacto */}
            <div className="bg-card rounded-lg border border-border p-4">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-24 w-full mb-3" />
              <div className="grid grid-cols-2 gap-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            {/* Skeleton para vendedor */}
            <div className="bg-card rounded-lg border border-border p-4">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

