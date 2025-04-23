"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMensajes } from "@/hooks/use-mensajes"
import { MessageSquare } from "lucide-react"
import { useState } from "react"

const SendMessage = ({id_cliente_perfil}: {id_cliente_perfil: number}) => {
    const[mensaje,setMensaje] = useState("")
    
    const { sendMessage, isSending } = useMensajes();  

    return (
        <div className="space-y-3">
            <Textarea
                placeholder="Escribe tu mensaje al vendedor..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="resize-none"
                disabled={isSending}
                rows={4}
            />

            <Button onClick={() => sendMessage({message: mensaje, id_vendedor: id_cliente_perfil})} className="w-full bg-blue-900 hover:bg-blue-800 text-white" disabled={isSending}>
                <MessageSquare className="h-4 w-4 mr-2" />
                {isSending ? "Enviando..." : "Enviar mensaje"}
            </Button>

        </div>
    )
}

export default SendMessage