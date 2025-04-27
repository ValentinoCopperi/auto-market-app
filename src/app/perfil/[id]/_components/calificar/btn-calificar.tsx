"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { calificarCliente } from "@/actions/clientes-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function BtnCalificar({ nombre, id_cliente }: { nombre: string, id_cliente: number }) {
    const router = useRouter()
    const onSubmit = async (rating: number, comment: string) => {
        setIsLoading(true)
        const response = await calificarCliente(id_cliente, rating, comment)
        if(response.error){
            toast.error(response.message)
        }else{
            toast.success(response.message)
            router.refresh()
        }
        setIsLoading(false)
    }
    const userName = nombre
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [comment, setComment] = useState("")
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = () => {
        if (rating === 0) return

        if (onSubmit) {
            onSubmit(rating, comment)
        }

        // Reset form and close dialog
        setRating(0)
        setComment("")
        setOpen(false)
    }

    const getRatingLabel = (rating: number) => {
        switch (rating) {
            case 1:
                return "Malo"
            case 2:
                return "Regular"
            case 3:
                return "Bueno"
            case 4:
                return "Muy bueno"
            case 5:
                return "Excelente"
            default:
                return "Selecciona una calificación"
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isLoading}>
                    <Star className="h-4 w-4 mr-2" />
                    {isLoading ? "Calificando..." : "Calificar"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Calificar a {userName}</DialogTitle>
                    <DialogDescription>
                        Comparte tu experiencia con este usuario. Tu calificación ayuda a otros miembros de la comunidad.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-6">
                    {/* Rating stars */}
                    <div className="space-y-3">
                        <div className="flex justify-center">
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        disabled={isLoading}
                                        key={star}
                                        type="button"
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >
                                        <Star
                                            className={cn(
                                                "h-8 w-8 transition-colors",
                                                (hoverRating ? hoverRating >= star : rating >= star)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-muted-foreground",
                                            )}
                                        />
                                        <span className="sr-only">{star} estrellas</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="text-center font-medium">{getRatingLabel(hoverRating || rating)}</p>
                    </div>

                    {/* Comment textarea */}
                    <div className="space-y-2">
                        <label htmlFor="comment" className="text-sm font-medium">
                            Comentario (opcional)
                        </label>
                        <Textarea
                            id="comment"
                            disabled={isLoading}
                            placeholder="Comparte tu experiencia con este usuario..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={4}
                        />
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSubmit} disabled={rating === 0 || isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? "Enviando..." : "Enviar calificación"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
