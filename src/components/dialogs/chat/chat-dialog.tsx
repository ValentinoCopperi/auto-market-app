"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { useMensajes } from "@/hooks/use-mensajes"
import { Card, CardContent } from "@/components/ui/card"
import { formatMessageTime } from "@/lib/fechas"
import { Mensaje } from "@/types/mensajes"
import { cn } from "@/lib/utils"
interface ChatDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    publicacionId: number
    vehicleTitle: string
    vendedorId: number
}

export function ChatDialog({
    open,
    onOpenChange,
    publicacionId,
    vehicleTitle,
    vendedorId
}: ChatDialogProps) {


    const [message, setMessage] = useState("")
    const [offerAmount, setOfferAmount] = useState<number | null>(null)
    const [currency, setCurrency] = useState<"ARS" | "USD">("ARS")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)


    const { user } = useAuth()

    const { isSending, sendMessage , mensajesTemporales } = useMensajes()

    // Cargar mensajes (simulado)
    useEffect(() => {
        if (open) {

            // Enfocar el campo de texto
            if (inputRef.current) {
                inputRef.current.focus()
            }
        }
    }, [open])


    // Scroll al último mensaje
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [mensajesTemporales])


    const sendOfferAmount = () => {
        
        if (!offerAmount || offerAmount <= 0 ) {
            toast.error("El monto de la oferta debe ser mayor a 0")
            return
        }

        if(!user){
            toast.error("Debes estar autenticado para enviar un mensaje")
            return
        }

        if(Number(user.id) === vendedorId)  {
            toast.error("No puedes enviar un mensaje a ti mismo")
            return
        }

        const message = `Hola, me interesa el vehiculo ${vehicleTitle} por el precio de ${offerAmount}`;
        sendMessage({ message, id_vendedor: vendedorId });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-xl font-bold">{vehicleTitle}</DialogTitle>
                    <DialogDescription>Chat con el Vendedor</DialogDescription>
                </DialogHeader>


                <div className="flex flex-col h-[500px]">
                    {/* Botón para ver publicación */}

                    <div className="p-3">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <label htmlFor="offer-amount" className="text-sm font-medium">
                                    Monto de la oferta
                                </label>

                            </div>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input
                                        disabled={isSending}
                                        value={offerAmount || ""}
                                        onChange={(e) => setOfferAmount(Number(e.target.value))}
                                        id="offer-amount"
                                        type="number"
                                        className="pl-7"
                                        placeholder="Ingresa el monto"
                                    />

                                </div>
                                <Button disabled={isSending} className="bg-green-600 hover:bg-green-700" onClick={sendOfferAmount}>
                                    Enviar Oferta
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end p-2 border-b">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            <Link href={`/publicaciones/${publicacionId}`}>Ver Publicación</Link>
                        </Button>
                    </div>
                    {/* Área de mensajes */}
                    <div className="flex-1 p-4 overflow-y-auto max-h-[500px]">
                        <div className="space-y-4">
                            {
                                mensajesTemporales && mensajesTemporales.length > 0 ? 
                                mensajesTemporales.map((mensaje) => (
                                    <MensajeContenido key={mensaje.id} mensaje={mensaje} userId={user?.id} />
                                )) : (
                                    <div className="flex justify-center items-center h-full">
                                        <p className="text-muted-foreground">No hay mensajes</p>
                                    </div>
                                )
                            }
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    {/* Área de entrada de mensaje */}
                    <div className="border-t p-4">
                        <div className="flex items-end gap-2">
                            <Input
                                value={message}
                                disabled={isSending}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe tu mensaje..."
                                className="flex-1 min-h-[80px] max-h-[160px] p-3 rounded-md border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <Button
                                onClick={() => sendMessage({ message, id_vendedor: vendedorId })}
                                disabled={isSending}
                                className="bg-primary hover:bg-primary/90 h-10 w-10 p-0"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}


const MensajeContenido = ({ mensaje,userId }: { mensaje: Mensaje,userId?: string | null }) => {
    
    return (
        <div className="flex w-full mb-4 justify-end">
            <Card className="max-w-[80%] shadow-sm font-medium bg-blue-600 hover:bg-blue-700 text-white" >
                <CardContent className="p-3">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm">{mensaje.contenido}</p>
                    </div>
                    <span className="self-end text-xs font-light">{formatMessageTime(new Date(mensaje.fecha))}</span>
                </CardContent>
            </Card>
        </div>
    )
}