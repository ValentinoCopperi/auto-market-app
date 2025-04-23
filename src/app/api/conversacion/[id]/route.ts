import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: number }> }) {

    try {
        const { id } = await params

        const formattedId = Number(id);

        if (isNaN(formattedId) || !formattedId) {
            return NextResponse.json({ error: true, message: "ID inválido" }, { status: 400 })
        }

        const mensajes = await prisma.mensaje.findMany({
            where: { id_conversacion: formattedId }
        })

        return NextResponse.json({ error: false, message: "Mensajes obtenidos correctamente", data: mensajes }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: true, message: "Error al obtener los mensajes" }, { status: 500 })
    }
}


