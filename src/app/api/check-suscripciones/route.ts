import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Esta ruta se ejecutará automáticamente cada día a las 00:00 UTC
export async function GET() {
    try {
        // Obtener la fecha actual
        const currentDate = new Date()

        // Buscar todas las suscripciones activas que hayan vencido
        const expiredSubscriptions = await prisma.suscripcion.findMany({
            where: {
                estado: "activa",
                fecha_fin: {
                    lt: currentDate,
                },
            },
        })

        //Actualizar todas las suscripciones vencidas
        if (expiredSubscriptions.length > 0) {
            await prisma.suscripcion.updateMany({
                where: {
                    id: {
                        in: expiredSubscriptions.map((sub) => sub.id),
                    },
                },
                data: {
                    estado: "vencida",
                },
            })
        }

        return NextResponse.json({
            success: true,
            message: `Verificación completada. ${expiredSubscriptions.length} suscripciones actualizadas.`,
        })
    } catch (error) {
        console.error("Error al verificar suscripciones")
        return NextResponse.json({ success: false, error: "Error al verificar suscripciones" }, { status: 500 })
    }
}
