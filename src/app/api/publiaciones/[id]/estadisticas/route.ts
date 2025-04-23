import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: number }> }): Promise<NextResponse> {
    try {

        const { id } = await params

        const formattedId = Number(id);

        if (isNaN(formattedId)) {
            console.log("ID inválido");
            return NextResponse.json({ error: true, message: "ID inválido" }, { status: 400 })
        }

        const [vistas, favoritas] = await Promise.all([
            prisma.publicacion_vistas.findMany({
                where: {
                    id_publicacion: formattedId
                },
                select: {
                    id: true,
                    created_at: true
                }
            }),
            prisma.favorito.findMany({
                where: {
                    publicacion_id: formattedId
                },
                select: {
                    id: true,
                    created_at: true
                }
            })
        ])
        return NextResponse.json({ error: false, estadisticas: { vistas: vistas, favoritas: favoritas } }, { status: 200 })
    } catch (error) {
        console.error(`Error fetching estadisticas:`, error)
        return NextResponse.json({ error: true, message: "Error al obtener las estadisticas" }, { status: 500 })
    }
}