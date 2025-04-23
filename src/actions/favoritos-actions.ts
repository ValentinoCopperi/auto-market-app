"use server"


import { unstable_cache } from "next/cache"
import { getSession } from "@/lib/session/session"
import { Publicacion } from "@/types/publicaciones"
import prisma from "@/lib/prisma"
import { ActionsResponse } from "@/types/actions-response"

interface FavoritosResult {
  id: number
  publicacion: Publicacion
}

// Función para obtener favoritos del usuario actual con paginación y búsqueda
export const getFavoritosByUsuario = async (q?: string): Promise<FavoritosResult[]> => {
  try {
    // Obtener la sesión del usuario actual
    const session = await getSession()

    if (!session) {
      return [];
    }

    const userId = session.userId

    // Ejecutar consultas en paralelo para mejorar rendimiento
    const favoritos = await prisma.favorito.findMany({
      where: {
        cliente_id: parseInt(userId),
        publicacion: {
          titulo: {
            contains: q,
            mode: 'insensitive',
          },
        },
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
            publicacion_imagenes: {
              select: {
                id: true,
                url: true,
              },
              take: 1,
            },
          },
        },
      },
    });

    return favoritos as unknown as FavoritosResult[]
  } catch (error) {
    console.error("Error al obtener favoritos:", error)
    return []
  }
}


export const agregarFavorito = async (publicacionId: number): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return { error: true, message: "No esta autenticado" }
    }

    const id_usuario = parseInt(session.userId);

    if (isNaN(publicacionId) || isNaN(id_usuario)) {
      return { error: true, message: "El ID de la publicación o el usuario es inválido" }
    }

    const favorito = await prisma.favorito.findFirst({
      where: {
        cliente_id: id_usuario,
        publicacion_id: publicacionId,
      },
    });

    if (favorito) {
      return { error: true, message: "La publicación ya está en favoritos" }
    }

    await prisma.favorito.create({
      data: {
        cliente_id: id_usuario,
        publicacion_id: publicacionId,
      },
    });

    return { error: false, message: "Publicación agregada a favoritos" }
    
  } catch (error) {
    console.error("Error al agregar favorito:", error)
    return { error: true, message: "Error al agregar favorito" }
  }
}

export const eliminarFavorito = async (publicacionId: number): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession();

    if (!session?.userId) {
      return { error: true, message: "No esta autenticado" }
    }

    const id_usuario = parseInt(session.userId);

    if (isNaN(publicacionId) || isNaN(id_usuario)) {
      return { error: true, message: "El ID de la publicación o el usuario es inválido" }
    }

    const result = await prisma.favorito.deleteMany({
      where: {
        cliente_id: id_usuario,
        publicacion_id: publicacionId
      }
    })

    if (result.count === 0) {
      return { error: true, message: "La publicación no está en favoritos" }
    }

    return { error: false, message: "Publicación eliminada de favoritos" }

  } catch (error) {
    console.error("Error al eliminar favorito:", error)
    return { error: true, message: "Error al eliminar favorito" }
  }
}

// export const esPublicacionFavorita = async (publicacionId: number, userId: string | undefined) => {
//   try {

//     if (!userId) {
//       return false;
//     }

//     const favorito = await prisma.favorito.findFirst({
//       where: {
//         cliente_id: parseInt(userId),
//         publicacion_id: publicacionId,
//       },
//     });

//     return favorito !== null;
//   } catch (error) {
//     console.error("Error al verificar si la publicación es favorita");
//     return false;
//   }
// }