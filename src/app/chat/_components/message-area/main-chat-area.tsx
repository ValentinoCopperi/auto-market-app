import React from 'react'
import ChatContainer from './chat-container'
import { useMensajes } from '@/hooks/use-mensajes'
import { Loader2, MessageSquare } from 'lucide-react'
import InputSendMessage from './input-send-message'


const MainChatArea = ({ userId }: { userId: string | null }) => {

    const { selectedConversation, mensajes, isLoading, isLoadingMensajes } = useMensajes()
   

    if (isLoading || isLoadingMensajes) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <Loader2 size={32} className="text-gray-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full">
            {selectedConversation ? (
                <>
                    <div className="flex items-center p-4 border-b">
                        <h2 className="font-medium">{"Chat"}</h2>
                    </div>
                    <ChatContainer mensajes={mensajes} userId={userId} />
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                        <MessageSquare size={32} className="text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-center">Selecciona una conversación para comenzar</p>
                </div>
            )}
            {
                selectedConversation && (
                    <InputSendMessage />
                )
            }
        </div>
    )
}

export default MainChatArea