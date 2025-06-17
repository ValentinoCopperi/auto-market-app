import { getSuscripcionByUsuario } from "@/actions/suscripcion-actions"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, Crown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getPlanName, type Planes } from "@/types/suscriciones"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const SuscripcionInfoUI = ({ suscripcion, id_cliente }: { suscripcion: any; id_cliente: number }) => {
  const SuscripcionContent = () => {
    if (!suscripcion) {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sin Suscripción Activa</h3>
          <p className="text-muted-foreground mb-6">
            Actualmente no tienes una suscripción activa. ¡Considera suscribirte para acceder a más beneficios!
          </p>
          <Link href={`/perfil/${id_cliente}/suscripcion`} className="w-full">
            <Button className="w-full">Ver Suscripciones</Button>
          </Link>
        </div>
      )
    }

    if (suscripcion.estado === "vencida") {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Suscripción Vencida</h3>
          <p className="text-muted-foreground mb-6">
            Tu suscripción ha expirado. Porfavor, actualiza tu plan para continuar.
          </p>
          <p className="text-muted-foreground mb-6">
            Fecha de fin: {format(new Date(suscripcion.fecha_fin), "PPP", { locale: es })}
          </p>
          <Link href={`/perfil/${id_cliente}/suscripcion`} className="w-full">
            <Button className="w-full">Ver Suscripciones</Button>
          </Link>
        </div>
      )
    }

    if (suscripcion.estado === "cancelada") {
      return (
        <div className="flex flex-col items-center justify-center text-center py-8">
          <Crown className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Suscripción Cancelada</h3>
          <p className="text-muted-foreground mb-6">
            Tu suscripción ha sido cancelada. Porfavor, actualiza tu plan para continuar.
          </p>
          <p className="text-muted-foreground mb-6">
            Fecha de fin: {format(new Date(suscripcion.fecha_fin), "PPP", { locale: es })}
          </p>
          <Link href={`/perfil/${id_cliente}/suscripcion`} className="w-full">
            <Button className="w-full">Ver Suscripciones</Button>
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-medium text-lg mb-2">{getPlanName(suscripcion.tipo_suscripcion.nombre as Planes)}</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Inicio: {format(new Date(suscripcion.fecha_inicio), "PPP", { locale: es })}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Fin: {format(new Date(suscripcion.fecha_fin), "PPP", { locale: es })}</span>
            </div>
          </div>
        </div>

        <Link href={`/perfil/${id_cliente}/suscripcion`} className="w-full">
          <Button className="w-full">Administrar Suscripción</Button>
        </Link>

        <div className="text-sm text-muted-foreground mt-2">ID de Suscripción: #{suscripcion.id}</div>
      </div>
    )
  }

  const getAccordionTitle = () => {
    if (!suscripcion) return "Suscripción"
    if (suscripcion.estado === "vencida") return "Suscripción Vencida"
    if (suscripcion.estado === "cancelada") return "Suscripción Cancelada"
    return "Información de Suscripción"
  }

  return (
    <>
      {/* Desktop version - normal card */}
      <div className="hidden lg:block bg-card rounded-lg border border-border p-6">
        {!suscripcion ? (
          <SuscripcionContent />
        ) : suscripcion.estado === "vencida" || suscripcion.estado === "cancelada" ? (
          <SuscripcionContent />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Información de Suscripción</h3>
            </div>
            <SuscripcionContent />
          </>
        )}
      </div>

      {/* Mobile version - accordion */}
      <div className="lg:hidden bg-card rounded-lg border border-border">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="suscripcion" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">{getAccordionTitle()}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <SuscripcionContent />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

// Server Component for data fetching
const SuscripcionInfo = async ({ id_cliente }: { id_cliente: number }) => {
  const response = await getSuscripcionByUsuario(id_cliente)
  const suscripcion = response.data

  return <SuscripcionInfoUI suscripcion={suscripcion} id_cliente={id_cliente} />
}

export default SuscripcionInfo
