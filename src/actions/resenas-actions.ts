"use server"

import { Resena } from "@/types/resenas"
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
    }catch(error){
        console.error(error)
        return [];
    }
}
