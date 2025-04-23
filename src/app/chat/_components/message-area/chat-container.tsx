"use client"

import { useEffect, useRef } from "react"
import MensajeContenido from "./mensaje-contenido"
import { Mensaje } from "@/types/mensajes"

interface ChatContainerProps {
  mensajes: Mensaje[]
  userId: string | null
}

const ChatContainer = ({ mensajes, userId }: ChatContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  // Sort messages by date
  const sortedMensajes = [...mensajes].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

  // Scroll to bottom when messages change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [mensajes])

  return (
    <div
      ref={containerRef}
      className="flex-1 flex flex-col w-full overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
    >
      {sortedMensajes.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">No hay mensajes aún</p>
        </div>
      )}
      {sortedMensajes.map((mensaje) => (
        <MensajeContenido key={mensaje.id} mensaje={mensaje} userId={userId} />
      ))}
    </div>
  )
}

export default ChatContainer
