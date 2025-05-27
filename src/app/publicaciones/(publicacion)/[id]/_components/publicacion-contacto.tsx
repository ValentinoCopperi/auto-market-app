"use client"

import type React from "react"

import { useState } from "react"
import { Send, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMensajes } from "@/hooks/use-mensajes"

interface PublicacionContactoProps {
  vendedorId: number
  esEditable?: boolean
  telefono: string
}

export function PublicacionContacto({ vendedorId, esEditable = false, telefono }: PublicacionContactoProps) {
  
  const [mensaje, setMensaje] = useState("")
  const[verTelefono, setVerTelefono] = useState(false)
  // Si es el propietario, no mostrar el formulario de contacto
  if (esEditable) {
    return null
  }

  const { sendMessage, isSending } = useMensajes();  

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold mb-3">Contactar al vendedor</h3>

        <Textarea
          placeholder="Escribe tu mensaje al vendedor..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="resize-none"
          disabled={isSending}
          rows={4}
        />

        <div className="grid grid-cols-2 gap-3 py-2">
          <Button onClick={() => sendMessage({ message: mensaje, id_vendedor: vendedorId })} type="submit" className="bg-blue-900 hover:bg-blue-800 text-white" disabled={isSending}>
            <Send className="h-4 w-4 mr-2" />
            {isSending ? "Enviando..." : "Enviar mensaje"}
          </Button>

          <Button onClick={() => setVerTelefono(!verTelefono)} variant="outline" type="button">
            <Phone className="h-4 w-4 mr-2" />
            {verTelefono ? telefono : "Ver teléfono"}
          </Button>
        </div>
    </div>
  )
}

