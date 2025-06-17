"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMensajes } from "@/hooks/use-mensajes"
import { MessageSquare } from "lucide-react"
import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const SendMessage = ({ id_cliente_perfil }: { id_cliente_perfil: number }) => {
  const [mensaje, setMensaje] = useState("")

  const { sendMessage, isSending } = useMensajes()

  const MessageContent = () => (
    <div className="space-y-3">
      <Textarea
        placeholder="Escribe tu mensaje al vendedor..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className="resize-none"
        disabled={isSending}
        rows={4}
      />

      <Button
        onClick={() => sendMessage({ message: mensaje, id_vendedor: id_cliente_perfil })}
        className="w-full bg-blue-900 hover:bg-blue-800 text-white"
        disabled={isSending}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        {isSending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </div>
  )

  return (
    <>
      {/* Desktop version - normal content */}
      <div className="hidden lg:block">
        <MessageContent />
      </div>

      {/* Mobile version - accordion */}
      <div className="lg:hidden bg-card rounded-lg border border-border shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="message" className="border-none">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <h3 className="text-lg font-semibold">Enviar mensaje</h3>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <MessageContent />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  )
}

export default SendMessage
