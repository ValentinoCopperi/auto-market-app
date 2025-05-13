
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


//Obtener favoritos de un usuario
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {


    try {

        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const q : string | null= searchParams.get("q");


        const parsedId = parseInt(id);

        if (isNaN(parsedId)) {
            return NextResponse.json({ error: true, favoritos: [], message: "El ID del usuario es inválido" }, { status: 400 });
        }

        const favoritos = await prisma.favorito.findMany({
            where: {
                cliente_id: parsedId,
                ...(q ? {
                    publicacion: {
                        titulo: {
                            contains: q,
                            mode: 'insensitive',
                        },
                    },
                } : {}),
            },
            select: {
                id: true,
                publicacion: {
                    select: {
                        id: true,
                        modelo: true,
                        titulo: true,
                        precio: true,
                        anio: true,
                        kilometraje: true,
                        tipo_transmision: true,
                        tipo_combustible: true,
                        ciudad: true,
                        categoria: true,
                        destacado: true,
                        tipo_moneda: true,
                        created_at: true,
                        url_portada: true,
                        marca : {
                            select : {
                                nombre : true,
                            }
                        },
                        cliente : {
                            select : {
                                id : true,
                                nombre : true,
                            }
                        }
                    },
                },
                
            },
            
        });
        
        return NextResponse.json({ error: false, favoritos: favoritos.map((favorito) => ({
            ...favorito.publicacion,
        })), message: "Favoritos obtenidos correctamente" }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: true, favoritos: [], message: "Error interno al obtener favoritos" }, { status: 500 });
    }
}