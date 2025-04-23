import { Cliente } from "@/types/cliente"
import { Eye, MessageSquare, Heart, ShoppingCart, Star } from "lucide-react"


export function PerfilStats({calificacion, numResenas, favoritos}: {calificacion: number, numResenas: number, favoritos: number}) {
 


  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>

      {/* Calificación */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-5 w-5 ${
                star <= Math.round(calificacion) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
              }`}
            />
          ))}
        </div>
        <span className="font-medium">{calificacion.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">({numResenas} reseñas)</span>
      </div>
    </div>
  )
}

