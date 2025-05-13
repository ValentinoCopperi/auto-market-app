import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session/session";
import { Conversacion, ConversacionConUltimoMensaje } from "@/types/conversaciones";
import { Mensaje } from "@/types/mensajes";




//Devolvemos el array de conversaciones con el ultimo mensaje de cada una
interface ConversacionResponse {
    data: {
        conversaciones: ConversacionConUltimoMensaje[]
    } | null
    error: boolean
    message: string
}

export async function GET() {
    
    try {
        
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({data: null, error: true, message: "No estás autenticado" }, { status: 401 });
        }

        const userId = parseInt(session.userId);
        if (isNaN(userId)) {
            return NextResponse.json({data: null, error: true, message: "ID de usuario inválido" }, { status: 401 });
        }

        const conversaciones = await prisma.conversacion.findMany({
            where: {
                OR: [
                    { id_cliente_1: userId },
                    { id_cliente_2: userId }
                ]
            },
            include: {
                cliente_conversacion_id_cliente_1Tocliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        profile_img_url: true
                    }
                },
                cliente_conversacion_id_cliente_2Tocliente: {
                    select: {
                        id: true,
                        nombre: true,
                        apellido: true,
                        profile_img_url: true
                    }
                }
            }
        })  

        if(!conversaciones){
            return NextResponse.json({data: null, error: true, message: "No hay conversaciones" }, { status: 404 });
        }


        const conversacionesConUltimoMensaje = await Promise.all(conversaciones.map(async (conversacion) => ({
            ...conversacion,
            ultimoMensaje: await prisma.mensaje.findFirst({
                where: {
                    id_conversacion: conversacion.id
                },
                orderBy: {
                    fecha: "desc"
                }
            })
        })))


        return NextResponse.json({data: {
            conversaciones: conversacionesConUltimoMensaje as unknown as ConversacionResponse[],
        }, error: false, message: "Conversaciones obtenidas correctamente" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({data: null, error: true, message: "Error al obtener las conversaciones" }, { status: 500 });
    }
        
}