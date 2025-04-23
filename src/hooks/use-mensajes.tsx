"use client"

import { ConversacionConUltimoMensaje } from "@/types/conversaciones"
import { useAuth } from "./use-auth"
import { Mensaje } from "@/types/mensajes"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { createContext } from "react"
import { toast } from "sonner"
import { usePathname } from "next/navigation"

interface MensajesContextType {
    isLoading: boolean
    selectedConversation: number | null
    conversaciones: ConversacionConUltimoMensaje[]
    mensajes: Mensaje[]
    setSelectedConversation: Dispatch<SetStateAction<number | null>>
    search: string
    setSearch: Dispatch<SetStateAction<string>>
    isSending: boolean
    sendMessage: ({ message, id_vendedor}: { message?: string, id_vendedor?: number | undefined}) => Promise<void>
    id_cliente_vendedor: number | null
    isLoadingMensajes: boolean  
    isMenuOpen: boolean
    setIsMenuOpen: Dispatch<SetStateAction<boolean>>
    mensajesTemporales: Mensaje[]
}

const MensajesContext = createContext<MensajesContextType | undefined>(undefined)


const getClienteVendedor = (id_cliente_1:number, id_cliente_2:number,userId?:string | undefined) => {

    if(id_cliente_1 === Number(userId)){
        return id_cliente_2
    }

    return id_cliente_1

}

export const MensajesProvider = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, user } = useAuth()

    //Para carga incial o los mensajes
    const [isLoading, setIsLoading] = useState(false)
    //Para enviar mensajes
    const [isSending, setIsSending] = useState(false)
    //Para mensajes de la conversacion seleccionada
    const [isLoadingMensajes, setIsLoadingMensajes] = useState(false)
    //Id de la conversacion seleccionada (default conversacion[0])
    const [selectedConversation, setSelectedConversation] = useState<number | null>(null)
    //Conversaciones del usuario con el id decoodeado de la sesion
    const [conversaciones, setConversaciones] = useState<ConversacionConUltimoMensaje[]>([])
    //Mensajes de la conversacion seleccionada
    const [mensajes, setMensajes] = useState<Mensaje[]>([])
    //Buscador de conversaciones
    const [search, setSearch] = useState<string>("")
    //Menu de conversaciones en mobile
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    //Para el id del cliente receptor en la seccion chat
    const [id_cliente_vendedor, setId_cliente_vendedor] = useState<number | null>(null)
    //Mensajes temporales para el chat dialog
    const [mensajesTemporales, setMensajesTemporales] = useState<Mensaje[]>([])
    
    const pathname = usePathname()


    //Fetch de conversaciones dado el usuario con el id decoodeado de la sesion
    useEffect(() => {
        const fetchConversations = async () => {
            setIsLoading(true)
            const response = await fetch("http://localhost:3000/api/conversacion")
            const { error, data } = await response.json()
            if (error || !data) {
                setConversaciones([])
                setId_cliente_vendedor(null)
                setIsLoading(false)
                return
            }
            const conversacionesOrdenadas = data.conversaciones.sort((a: ConversacionConUltimoMensaje, b: ConversacionConUltimoMensaje) => {
                if(a.ultimoMensaje && b.ultimoMensaje){
                    return new Date(b.ultimoMensaje.fecha).getTime() - new Date(a.ultimoMensaje.fecha).getTime()
                }
                return 0
            })
            setIsLoading(false)
            setConversaciones(conversacionesOrdenadas)
            setId_cliente_vendedor(getClienteVendedor(conversacionesOrdenadas[0].cliente_conversacion_id_cliente_1Tocliente.id, conversacionesOrdenadas[0].cliente_conversacion_id_cliente_2Tocliente.id, user?.id))
            setSelectedConversation(conversacionesOrdenadas[0].id)
        }
        if(isAuthenticated && user && pathname.includes("chat")){
            fetchConversations()
        }
    }, [isAuthenticated, user])

   useEffect(() => {
    if(!pathname.includes("chat")){
        setSelectedConversation(null)
        setMensajes([])
        setId_cliente_vendedor(null)
        setConversaciones([])
        setSearch("")
    }
   },[pathname])

    //Seteamos el id del cliente vendedor dado el id de la conversacion seleccionada
    useEffect(() => {
        if (conversaciones.length > 0) {
            setId_cliente_vendedor(
                () => {
                    const conversacion = conversaciones.find(conversacion => conversacion.id === selectedConversation)

                    if(!conversacion){
                        return null
                    }
                    
                    return getClienteVendedor(conversacion.cliente_conversacion_id_cliente_1Tocliente.id, conversacion.cliente_conversacion_id_cliente_2Tocliente.id, user?.id)
                }
                
            )
        }
    }, [selectedConversation])


    //Fetch de mensajes dado el id de la conversacion seleccionada
    useEffect(() => {
        if (selectedConversation && pathname.includes("chat")) {
            setIsLoadingMensajes(true)
            const fetchMensajes = async () => {
                const response = await fetch(`http://localhost:3000/api/conversacion/${selectedConversation}`)
                const { error, data } = await response.json()
                if (error || !data) {
                    setMensajes([])
                    setIsLoadingMensajes(false)
                    return
                }
    
                setMensajes(data)
                setIsLoadingMensajes(false)
            }
            fetchMensajes()
        }
    }, [selectedConversation, pathname])

    const sendMessage = async ({ message, id_vendedor}: { message?: string, id_vendedor?: number | undefined}) => {
        setIsSending(true)

        if (!isAuthenticated) {
            toast.error("Debes estar autenticado para enviar un mensaje")
            setIsSending(false)
            return
        }

        if (!message) {
            toast.error("Error al enviar el mensaje")
            setIsSending(false)
            return
        }

        if(!id_vendedor && !id_cliente_vendedor){
            toast.error("Error al enviar el mensaje")
            setIsSending(false)
            return
        }

        if (message) {

            //Si el cliente_receptor existe, se envia al cliente_receptor (Se utiliza en el chat de la publicacion)
            // ,si no, se envia al id_cliente_receptor (Se utiliza en la seccion chat)
            const id_receptor_a_enviar = id_vendedor ? id_vendedor : id_cliente_vendedor

            const response = await fetch("http://localhost:3000/api/mensajes", {
                method: "POST",
                body: JSON.stringify({ message, id_cliente_receptor : id_receptor_a_enviar })
            })

            const data = await response.json()

            if (data.error) {
                toast.error(data.message)
                setIsSending(false)
                return
            }
            toast.success("Mensaje enviado correctamente")
            //Agregamos a la el array de mensajes el nuevo mensaje devuelto por la API
            setMensajes([...mensajes, data.data])
            setMensajesTemporales([...mensajesTemporales, data.data])
        }

        setIsSending(false)


    }


    return (
        <MensajesContext.Provider value={{ isLoading, mensajesTemporales, selectedConversation, conversaciones, mensajes, setSelectedConversation, search, setSearch, isSending, sendMessage, id_cliente_vendedor, isLoadingMensajes, isMenuOpen, setIsMenuOpen  }}>{children}</MensajesContext.Provider>
    )
}

export const useMensajes = () => {
    const context = useContext(MensajesContext)
    if (!context) throw new Error("useMensajes must be used within a MensajesProvider")
    return context
}
