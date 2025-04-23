import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Mensaje } from "@/types/mensajes"
import { formatMessageTime } from "@/lib/fechas"
interface MensajeContenidoProps {
  mensaje: Mensaje
  userId: string | null
}

const MensajeContenido = ({ mensaje, userId }: MensajeContenidoProps) => {
  // Check if the current user is the sender
  const isCurrentUser = userId ? Number(userId) === mensaje.id_cliente : false


  return (
    <div className={cn("flex w-full mb-4", isCurrentUser ? "justify-end" : "justify-start")}>
      <Card className={cn("max-w-[80%] shadow-sm font-medium", isCurrentUser ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-secondary")}>
        <CardContent className="p-3">
          <div className="flex flex-col gap-1">
            <p className="text-sm">{mensaje.contenido}</p>
            <span className={cn("self-end text-xs font-light", isCurrentUser ? "text-white" : "text-muted-foreground")}>{formatMessageTime(new Date(mensaje.fecha))}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MensajeContenido
