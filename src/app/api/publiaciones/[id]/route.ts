import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session/session"
import { supabase } from "@/lib/supabase";
import { deleleteAllImages } from "@/actions/images-actions";


export async function GET(request: NextRequest, { params }: { params: Promise<{ id: number }> }): Promise<NextResponse> {
  try {

    const { id } = await params

    const formattedId = Number(id);

    if (isNaN(formattedId)) {
      console.log("ID inválido");
      return NextResponse.json({ error: true, message: "ID inválido" }, { status: 400 })
    }

    const publicacion = await prisma.publicacion.findUnique({
      where: { id: formattedId },
      include: {
        marca: {
          select: {
            id: true,
            nombre: true,
          },
        },
        publicacion_imagenes: true,
        cliente: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            profile_img_url: true,
            ciudad: true,
            telefono: true,
          },
        },
      },
    });
    if (!publicacion) {
      console.log("Publicación no encontrada");
      return NextResponse.json({ error: true, message: "Publicación no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ error: false, publicacion }, { status: 200 })
  } catch (error) {
    console.error(`Error fetching publicacion:`, error)
    return NextResponse.json({ error: true, message: "Error al obtener la publicación" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: number }> }) {
  try {

    const { id } = await params

    const formattedId = Number(id);

    if (isNaN(id)) {
      return NextResponse.json({ error: true, message: "ID inválido" }, { status: 400 })
    }

    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: true, message: "No estás autenticado" }, { status: 401 })
    }


    const publicacion = await prisma.publicacion.findUnique({ where: { id: formattedId } })

    if (!publicacion) {
      return NextResponse.json({ error: true, message: "Publicación no encontrada" }, { status: 404 })
    }

    if (publicacion.id_cliente.toString() !== session.userId.toString()) {
      return NextResponse.json({ error: true, message: "No tienes permisos para eliminar esta publicación" }, { status: 403 })
    }

    const marca = await prisma.marca.findUnique({ where: { id: publicacion.id_marca } })

    if (!marca) {
      return NextResponse.json({ error: true, message: "Marca no encontrada" }, { status: 404 })
    }

    const cantidadPublicaciones = marca.cantidad_publicaciones ? marca.cantidad_publicaciones - 1 : 0

    await prisma.marca.update({ where: { id: publicacion.id_marca }, data: { cantidad_publicaciones: cantidadPublicaciones } })

    const response = await deleleteAllImages(formattedId)

    if (response.error) {
      return NextResponse.json({ error: true, message: response.message }, { status: 500 })
    }

    await prisma.publicacion.delete({ where: { id: formattedId } })

    return NextResponse.json({ error: false, message: "Publicación eliminada correctamente" }, { status: 200 })
  } catch (error) {
    console.error(`Error fetching publicacion:`, error)
    return NextResponse.json({ error: true, message: "Error al eliminar la publicación" }, { status: 500 })
  }
}

