import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Esta es una implementación de ejemplo. Deberás adaptarla para conectar con tu base de datos.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")?.toLowerCase() || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    
    const suggestions = await prisma.publicacion.findMany({
      where: {
        titulo: {
          contains: query,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        titulo: true
      },
      take: 10
    })

    return NextResponse.json({ suggestions })

  } catch (error) {
    console.error("Error al obtener sugerencias")
    return NextResponse.json({ suggestions: [] }, { status: 500 })
  }
}