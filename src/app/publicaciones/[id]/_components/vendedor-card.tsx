import Link from "next/link"
import Image from "next/image"
import { Star, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cliente } from "@/types/cliente"



interface VendedorCardProps {
  vendedor: Cliente
}

export function VendedorCard({ vendedor }: VendedorCardProps) {
  const nombreCompleto = `${vendedor.nombre} ${vendedor.apellido || ""}`.trim()
  const calificacion =  1
  const numResenas = 3


  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold mb-4">Información del vendedor</h3>

      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
          {vendedor.profile_img_url ? (
            <Image src={vendedor.profile_img_url || "/placeholder.svg"} alt={nombreCompleto} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-lg font-bold">
              {nombreCompleto.charAt(0)}
            </div>
          )}
        </div>

        {/* Información básica */}
        <div>
          <h4 className="font-medium">{nombreCompleto}</h4>

          {/* Calificación */}
          {numResenas > 0 ? (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span>{calificacion.toFixed(1)}</span>
              <span className="text-muted-foreground ml-1">({numResenas})</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Sin calificaciones</span>
          )}
        </div>
      </div>

      {/* Detalles adicionales */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{vendedor.ciudad}</span>
        </div>
      </div>

      {/* Botón para ver perfil */}
      <Link href={`/perfil/${vendedor.id}`}>
        <Button variant="outline" className="w-full">
          Ver perfil completo
        </Button>
      </Link>
    </div>
  )
}

