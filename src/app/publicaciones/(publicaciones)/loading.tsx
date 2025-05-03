
import { Skeleton } from "@/components/ui/skeleton"
import { Home, ChevronRight, Filter, ChevronDown } from "lucide-react"
import { PublicacionesSkeleton } from "@/components/publicaciones/publicaciones-skeleton"
import { SidebarSkeleton } from "./_components/sidebar-skeleton"
export default function PublicacionesPageSkeleton() {
  return (
    <div className="px-4 py-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Home className="h-4 w-4 mr-1" />
        <span>Inicio</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Title */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-1">
            <SidebarSkeleton />
        </div>
        <div className="col-span-3">
            <PublicacionesSkeleton />
        </div>
      </div>


    </div>
  )
}


