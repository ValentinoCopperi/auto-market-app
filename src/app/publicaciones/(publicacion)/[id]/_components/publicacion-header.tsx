import { Badge } from "@/components/ui/badge"
import { Pencil, Calendar, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PublicacionCompleto } from "@/types/publicaciones"

interface PublicacionHeaderProps {
  publicacion: PublicacionCompleto
}

export function PublicacionHeader({ publicacion }: PublicacionHeaderProps) {
  const fechaPublicacion = new Date(publicacion.created_at).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{publicacion.titulo}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{publicacion.anio}</span>
            </div>

            {publicacion.ciudad && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{publicacion.ciudad}</span>
              </div>
            )}

            <span>Publicado: {fechaPublicacion}</span>
          </div>
        </div>

        
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <h2 className="block md:hidden text-2xl md:text-3xl font-bold text-blue-600">${publicacion.precio.toLocaleString()}</h2>
          {publicacion.destacado && <Badge className="bg-blue-500 hover:bg-blue-600">Destacado</Badge>}
          {publicacion.vendido && <Badge className="bg-red-500 hover:bg-green-600">Vendido</Badge>}
        </div>

        {publicacion.marca && (
          <Link
            href={`/publicaciones?marca=${publicacion.marca.nombre.toLowerCase()}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            <Button variant="outline" size="sm" className="flex items-center gap-2 cursor-pointer">
              <span>Ver mas {publicacion.marca.nombre.charAt(0).toUpperCase() + publicacion.marca.nombre.slice(1)}</span>
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

