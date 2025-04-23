import { Mensaje } from "./mensajes"

export interface Conversacion {
    id: number
    id_cliente_1: number
    id_cliente_2: number
    cliente_conversacion_id_cliente_2Tocliente
    : {
        id: number
        nombre: string
        apellido?: string
        profile_img_url?: string
    }
    cliente_conversacion_id_cliente_1Tocliente: {
        id: number
        nombre: string
        apellido?: string
        profile_img_url?: string
    }
}

export interface ConversacionConUltimoMensaje extends Conversacion {
    ultimoMensaje: Mensaje
}