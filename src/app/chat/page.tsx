"use client"

import { useAuth } from "@/hooks/use-auth"
import SideBarConversaciones from "./_components/sidebar/sidebar-conversaciones"
import MainChatArea from "./_components/message-area/main-chat-area"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import { useMensajes } from "@/hooks/use-mensajes"

export default function ChatPage() {


  const { user } = useAuth()
  const { isMenuOpen, setIsMenuOpen } = useMensajes()


  return (
    <div className="flex  lg:mt-1 flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-full md:w-[95%] lg:w-[90%] xl:w-[85%] mx-auto overflow-hidden">
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={cn(
          "md:hidden fixed top-20 right-4 z-50 bg-primary text-primary-foreground rounded-full text-sm p-2 shadow-md",
          isMenuOpen ? "hidden" : "flex",
        )}
        aria-label="Open conversations"
      >
        Ver conversaciones
      </button>

      <div className="flex flex-1 overflow-hidden border rounded-lg">
        {/* Sidebar - Conversations */}
        <div
          className={cn(
            "md:w-80 lg:w-96 border-r bg-background",
            "fixed md:relative inset-0 z-40 md:z-auto",
            "transition-transform duration-300 ease-in-out",
            isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h1 className="font-semibold">Conversaciones</h1>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="md:hidden p-2 rounded-full hover:bg-muted"
                aria-label="Close conversations"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
            <SideBarConversaciones />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col w-full">
          <MainChatArea userId={user?.id || null} />
        </div>
      </div>
    </div>
  )
}
