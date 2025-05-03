import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, MapPin } from "lucide-react"

export function PerfilHeaderSkeleton() {
  return (
    <div className="relative">
      {/* Banner skeleton */}
      <div className="relative w-full h-[200px] bg-gradient-to-r from-gray-800 to-gray-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Contenedor de información de perfil */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-16 bg-card rounded-lg border border-border p-6 pt-20">
          {/* Avatar skeleton */}
          <div className="absolute -top-16 left-6 w-[120px] h-[120px]">
            <div className="relative w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Skeleton className="h-full w-full" />
              </div>
            </div>
          </div>

          {/* Información del perfil */}
          <div className="flex flex-col md:flex-row justify-between">
            <div className="md:ml-[140px]">
              <div className="flex items-start justify-between">
                <div>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </div>

                <Skeleton className="h-9 w-32 md:hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end mt-4 md:mt-0">
              <Skeleton className="h-9 w-32 hidden md:flex mb-4" />

              {/* Calificación skeleton */}
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-1" />
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-24 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

