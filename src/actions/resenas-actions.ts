"use server"

import { Resena, ResenaStats } from "@/types/resenas"
import prisma from "@/lib/prisma"



export async function getResenasByUsuario(id_usuario: number): Promise<Resena[]> {


    try {
        const resenas = await prisma.valoracion.findMany({
            where: {
                id_cliente_valorado: id_usuario
            },
            select: {
                id: true,
                comentario: true,
                valoracion: true,
                created_at: true,
                cliente_valoracion_id_cliente_votanteTocliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        profile_img_url: true,
                    }
                }
            }
        })
        return resenas as unknown as Resena[];
    } catch (error) {
        console.error(error)
        return [];
    }
}

export async function getResenasByUsuarioStats(id_usuario: number): Promise<ResenaStats> {
    try {
        const resenas = await prisma.valoracion.findMany({
            where: {
                id_cliente_valorado: id_usuario
            },
            select: {
                id: true,
                comentario: true,
                valoracion: true,
            }
        })

        const totalResenas = resenas.length
        const promedioValoracion = resenas.reduce((sum, resena) => sum + resena.valoracion, 0) / totalResenas

        return {
            total_resenas: totalResenas,
            promedio_valoracion: promedioValoracion
        }
    } catch (error) {
        console.error(error)
        return {
            total_resenas: 0,
            promedio_valoracion: 0
        }
    }
}

