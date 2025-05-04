"use server"

import prisma from "@/lib/prisma"
import { ActionsResponse } from "@/types/actions-response"
import { Planes, ResponseSuscripcionUsuario } from "@/types/suscriciones"




export const getSuscripcionByUsuario = async (id: number) : Promise<ActionsResponse<ResponseSuscripcionUsuario>> => {
    try {

        if(!id) throw new Error("Id de usuario no válido")
        const suscripcion = await prisma.suscripcion.findFirst({
            where: {
                id_cliente: id
            },
            select: {
                id: true,
                fecha_inicio: true,
                fecha_fin: true,
                estado: true,
                tipo_suscripcion : {
                    select: {
                        nombre: true,
                    }
                }
            }
        })
        if(!suscripcion) return {
            error:true,
            message: "No tiene suscripcion",
        }
        return {
            error:false,
            message: "Suscripción obtenida correctamente",
            data: suscripcion
        }
    } catch (error) {
        console.error("Error al obtener la suscripción del usuario", error)
        return {
            error: true,
            message: "Error al obtener la suscripción del usuario",
        }
    }
}

interface Pago {
    id: number;
    id_cliente: number;
    estado: string;
    id_suscripcion: number | null;
    monto: number;
    metodo_pago: string;
    transaccion_id: string | null;
    id_pago_mp: number | null;
    fecha_pago: Date | null;
}

export const getPagosByUsuario = async (id: number) : Promise<ActionsResponse<Pago[]>> => {
    try {
        const pagos = await prisma.pago.findMany({
            where: {
                id_cliente: id
            },
            orderBy: {
                fecha_pago: "desc"
            }
        })
        return {
            error:false,
            message : "Pagos obtenidos correctamente",
            data : pagos
        }
    } catch (error) {
        console.error("Error al obtener los pagos", error)
        return {
            error: true,
            message: "Error al obtener los pagos",
            data: []
        }   
    }
}

export const puedeVerEstadisticas = async (id: number) : Promise<ActionsResponse<boolean>> => {
    try {
        const suscripcion = await prisma.suscripcion.findFirst({
            where: {
                id_cliente: id
            },
            select: {
                estado: true,
                tipo_suscripcion: {
                    select: {
                        nombre: true
                    }
                }
            }
        })
        if(!suscripcion) return {
            error:true,
            message: "No tiene suscripcion",
            data: false
        }

        if(suscripcion.estado === "vencida") return {
            error:true,
            message: "Tu suscripción ha expirado. Por favor actualiza tu plan",
            data: false
        }

        if(suscripcion.tipo_suscripcion.nombre === "plan_ocasion") return {
            error:true,
            message: "No tienes acceso a ver estadisticas. Por favor actualiza tu plan",
            data: false
        }

        return {
            error:false,
            message: "Suscripción obtenida correctamente",
            data: true
        }
    } catch (error) {
        console.error("Error al verificar si puede ver estadisticas", error)
        return {
            error: true,
            message: "Error al verificar si puede ver estadisticas",
            data: false
        }
    }
}

export const suscribir_a_plan = async (id: number, plan: Planes) : Promise<ActionsResponse<string>> => {
    try {
        const tipo_suscripcion = await prisma.tipo_suscripcion.findFirst({
            where: {
                nombre: plan
            }
        })
        if(!tipo_suscripcion) return {
            error: true,
            message: "Plan no encontrado",
        }

        const suscripcion_existente = await prisma.suscripcion.findFirst({
            where: {
                id_cliente: id
            }
        })
        if(suscripcion_existente){
            await prisma.suscripcion.delete({
                where: {
                    id: suscripcion_existente.id
                },
            })
        }
        const suscripcion = await prisma.suscripcion.create({
            data: {
                id_cliente: id,
                id_tipo_suscripcion: tipo_suscripcion.id,
                fecha_inicio: new Date(),
                fecha_fin: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
                estado: "activa"
            }
        })
        return {
            error: false,
            message: "Suscripción creada correctamente",
        }
    } catch (error) {
        console.error("Error al suscribir a un plan", error)
        return {
            error: true,
            message: "Error al suscribir a un plan",
            data: ""
        }
    }
}
