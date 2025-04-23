import React, { Dispatch, SetStateAction } from 'react'
import { Conversacion } from '@/types/conversaciones'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMensajes } from '@/hooks/use-mensajes'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'


interface ConversacionBtnProps {
    conversacion: Conversacion
    selectedConversation: number | null
    setSelectedConversation: Dispatch<SetStateAction<number | null>>
    ultimoMensaje: string
    fechaUltimoMensaje: Date | null
}

const getCliente = (conversacion: Conversacion, session_user_id: string | undefined) => {
    return conversacion.id_cliente_1 === Number(session_user_id)
        ? conversacion.cliente_conversacion_id_cliente_2Tocliente
        : conversacion.cliente_conversacion_id_cliente_1Tocliente
}

const ConversacionBtn = ({ conversacion, selectedConversation, setSelectedConversation, ultimoMensaje, fechaUltimoMensaje }: ConversacionBtnProps) => {

    const { user } = useAuth()

    const { setIsMenuOpen } = useMensajes()
    
    const cliente = getCliente(conversacion, user?.id);

    const parsedFecha = fechaUltimoMensaje ? new Date(fechaUltimoMensaje).toLocaleString() : ""

    return (
        <div
            key={conversacion.id}
            className={cn(
                "flex p-4 border-b  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900",
                selectedConversation === conversacion.id && "bg-gray-100 dark:bg-gray-900",
            )}
            onClick={() => {
                setSelectedConversation(conversacion.id)
                setIsMenuOpen(false)
            }}
        >
            <div className="relative mr-3">
                <Link href={`/perfil/${cliente.id}`}>
                    {getAvatar(cliente)}
                </Link>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <Link href={`/perfil/${cliente.id}`}>
                        <h3 className="text-md font-semibold hover:underline cursor-pointer truncate flex items-center">
                            {cliente.nombre} {cliente?.apellido ? cliente?.apellido : ""}
                        </h3>
                    </Link>
                    <span className="text-xs text-gray-500">{parsedFecha}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{ultimoMensaje}</p>
                <div className="flex items-center mt-1">
                    <span className="inline-flex items-center text-xs text-gray-400">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 17L3 12M3 12L8 7M3 12H21"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        {/* {conversation.carModel} */}
                    </span>
                </div>
            </div>
        </div>
    )
}

const getAvatar = (cliente: any) => {

    return cliente.profile_img_url ? (
        <Avatar className="bg-primary/30 text-primary text-lg font-semibold">
            <AvatarImage src={cliente.profile_img_url} alt={cliente.nombre} />
        </Avatar>
    ) : (
        <Avatar className="bg-primary/30 text-primary text-lg font-semibold">
            <AvatarFallback className="rounded-full">
                {cliente.nombre.charAt(0)}
            </AvatarFallback>
        </Avatar>
    )
}

export default ConversacionBtn