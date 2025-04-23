import { MessageSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useMensajes } from '@/hooks/use-mensajes'
import { Loader2, Search } from 'lucide-react'
import React from 'react'
import ConversacionBtn from './conversacion-btn'

const SideBarConversaciones = () => {

    const { isLoading, search , setSearch, selectedConversation, setSelectedConversation, conversaciones } = useMensajes()


    return (
        <>
            {/* Search Bar */}
            <div className="p-4 border-b ">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
                        <Search size={18} />
                    </div>
                    <Input
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        value={search}
                        className="w-full py-2 pl-10 pr-4 text-sm  rounded-md focus:outline-none focus:ring-2 "
                        placeholder="Buscar mensajes..."
                    />
                </div>
            </div>

            {/* Conversation List */}
            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4">
                        <Loader2 size={32} className="animate-spin" />
                    </div>
                </div>
            ) : (
                <div className="overflow-y-auto h-[calc(100vh-73px)]">
                    {conversaciones.length > 0 && conversaciones ?
                        conversaciones
                            .filter((conversacion) => {
                                if (search.length > 2) {
                                    //Filtramos por nombre del cliente que tiene la conversacion y es distinto al usuario autenticado
                                    return conversacion.cliente_conversacion_id_cliente_2Tocliente.nombre.toLowerCase().includes(search.toLowerCase()) || conversacion.cliente_conversacion_id_cliente_1Tocliente.nombre.toLowerCase().includes(search.toLowerCase())
                                } else {
                                    return true
                                }
                            })
                            .map((conversacion) => (    
                                <ConversacionBtn
                                    key={conversacion.id}
                                    conversacion={conversacion}
                                    ultimoMensaje={conversacion?.ultimoMensaje?.contenido || "Escribe un mensaje..."}
                                    fechaUltimoMensaje={conversacion?.ultimoMensaje?.fecha || null}
                                    selectedConversation={selectedConversation}
                                    setSelectedConversation={setSelectedConversation}
                                />
                            )) : (
                            // Si no hay conversaciones mostramos un mensaje
                            <div className="flex-1 flex flex-col items-center justify-center p-4">
                                <div className="w-16 h-16  rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare size={32} className="text-gray-400" />
                                </div>
                                <p className=" text-center">No hay conversaciones</p>
                            </div>
                        )}
                </div>
            )}
        </>
    )
}

export default SideBarConversaciones