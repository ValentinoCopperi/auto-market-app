import { getSuscripcionByUsuario } from '@/actions/suscripcion-actions'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Clock, Crown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getPlanName, Planes } from '@/types/suscriciones'

const SuscripcionInfoUI = ({ suscripcion }: { suscripcion: any }) => {
  if (!suscripcion) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sin Suscripción Activa</h3>
          <p className="text-muted-foreground mb-6">
            Actualmente no tienes una suscripción activa. ¡Considera suscribirte para acceder a más beneficios!
          </p>
          <Link href="/suscripcion" className="w-full">
            <Button className="w-full">
              Ver Suscripciones
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if(suscripcion.estado === "vencida"){
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Suscripción Vencida</h3>
          <p className="text-muted-foreground mb-6">
            Tu suscripción ha expirado. Porfavor, actualiza tu plan para continuar.
          </p>
          <p className="text-muted-foreground mb-6">
            Fecha de fin: {format(new Date(suscripcion.fecha_fin), 'PPP', { locale: es })}
          </p>
          <Link href="/suscripcion" className="w-full">
            <Button className="w-full">
              Ver Suscripciones
            </Button>
          </Link>
        </div>
      </div>
    ) 
  }

  if(suscripcion.estado === "cancelada"){
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Suscripción Cancelada</h3>
          <p className="text-muted-foreground mb-6">
            Tu suscripción ha sido cancelada. Porfavor, actualiza tu plan para continuar.
          </p>
          <p className="text-muted-foreground mb-6">
            Fecha de fin: {format(new Date(suscripcion.fecha_fin), 'PPP', { locale: es })}
          </p>
          <Link href="/suscripcion" className="w-full">
            <Button className="w-full">
              Ver Suscripciones
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Información de Suscripción</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-lg mb-2">{getPlanName(suscripcion.tipo_suscripcion.nombre as Planes)}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Inicio: {format(new Date(suscripcion.fecha_inicio), 'PPP', { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Fin: {format(new Date(suscripcion.fecha_fin), 'PPP', { locale: es })}</span>
            </div>
          </div>
        </div>

        <Link href="/suscripcion" className="w-full">
          <Button className="w-full">
            Administrar Suscripción
          </Button>
        </Link>

        <div className="text-sm text-muted-foreground mt-2">
          ID de Suscripción: #{suscripcion.id}
        </div>
      </div>
    </div>
  )
}

// Server Component for data fetching
const SuscripcionInfo = async ({ id_cliente }: { id_cliente: number }) => {
  const response = await getSuscripcionByUsuario(id_cliente)
  const suscripcion = response.data;

  return <SuscripcionInfoUI suscripcion={suscripcion} />
}

export default SuscripcionInfo