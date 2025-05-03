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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMensajes } from "@/hooks/use-mensajes"
import { DollarSign } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface OfertaDialogProps {
    precio_default: number
    id_cliente_vendedor: number
    titulo: string
    open: boolean
    onClose: () => void
}

export default function OfertaDialog({ precio_default, id_cliente_vendedor, titulo, open, onClose }: OfertaDialogProps) {
    const [precio, setPrecio] = useState<string>(precio_default.toString())
    const [error, setError] = useState<string | null>(null)
    const { sendMessage } = useMensajes()
    const [isLoading, setIsLoading] = useState(false)
    const handlePrecioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Permitir valor vacío o valores numéricos
        const value = e.target.value

        // Si está vacío o es un número válido (incluso "0"), actualizar el estado
        if (value === "" || (!isNaN(Number(value)) && Number(value) >= 0)) {
            setPrecio(value)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        // Aquí puedes validar y enviar la oferta final
        const precioFinal = precio === "" ? 0 : Number(precio)
        if (precioFinal < 0) {
            setError("El precio no puede ser negativo")
            setIsLoading(false)
            return
        }
        if (isNaN(precioFinal)) {
            setError("El precio no es un número válido")
            setIsLoading(false)
            return
        }
        const message = `Hola, me interesa ${titulo} . Mi oferta es de ${precioFinal}`
        await sendMessage({
            message,
            id_vendedor: id_cliente_vendedor
        })
        setError(null)
        setPrecio("")
        setIsLoading(false)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}  >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hacer oferta</DialogTitle>
                    <DialogDescription>
                        Hacer una oferta para el vehículo.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="precio" className="text-right">
                            Precio
                        </Label>
                        <Input
                            id="precio"
                            value={precio}
                            type="text"
                            onChange={handlePrecioChange}
                            className="col-span-3"
                            disabled={isLoading}
                            inputMode="numeric"
                            placeholder="Ingresa un precio"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={precio === "" || Number(precio) <= 0 || isLoading}
                    >
                        {isLoading ? "Enviando..." : "Hacer oferta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}