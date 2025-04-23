import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAuthenticated } from "@/lib/session/session";
import { get_query_filtros } from "@/lib/get_query_filtros";
import { supabase } from "@/lib/supabase";


export async function GET(request: NextRequest) {

    try {

        const searchParams = request.nextUrl.searchParams
        const { skip, take, where } = get_query_filtros(searchParams)

        const [publicaciones, totalCount] = await Promise.all([
            prisma.publicacion.findMany({
                skip,
                take,
                where,
                include: {
                    marca: {
                        select: {
                            id: true,
                            nombre: true,
                        },
                    },
                    publicacion_imagenes: {
                        select: {
                            id: true,
                            url: true,
                        },
                    },
                },
            }),
            prisma.publicacion.count({ where }),
        ])

        return NextResponse.json({ data: publicaciones, error: false, message: "Publicaciones obtenidas correctamente" }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: true, message: "Error al obtener las publicaciones" }, { status: 500 });
    }


}
