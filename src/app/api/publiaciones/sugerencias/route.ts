import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Esta es una implementación de ejemplo. Deberás adaptarla para conectar con tu base de datos.
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")?.toLowerCase() || ""
  const id = searchParams.get("id") || ""

  if (!query || query.length < 2 || !id) {
    return NextResponse.json({ suggestions: [] })
  }

  try {

    const suggestions = await prisma.publicacion.findMany({
      where: {
        OR: [
          {
            titulo: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            descripcion: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            marca: {
              nombre: {
                contains: query,
                mode: 'insensitive'
              }
            }
          }
        ], AND: [
          {
            vendido: false
          },
          {
            id: {
              not: Number(id)
            }
          }
        ]
      },
      include: {
        marca: {
          select: {
            id: true,
            nombre: true,
          },
        },
        cliente: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: {
        destacado: "desc"
      },
      take: 10
    })
    const serializedPublicaciones = suggestions.map((pub) => ({
      ...pub,
      precio: pub.precio ? Number.parseFloat(pub.precio.toString()) : null,
      // Convert any other Decimal fields if they exist
      // For example:
      // kilometraje: pub.kilometraje ? parseFloat(pub.kilometraje.toString()) : null,
    }))

    return NextResponse.json({ suggestions: serializedPublicaciones })

  } catch (error) {
    console.error("Error al obtener sugerencias")
    return NextResponse.json({ suggestions: [] }, { status: 500 })
  }
}
