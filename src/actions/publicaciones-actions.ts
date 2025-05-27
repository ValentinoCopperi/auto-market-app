"use server"

import { Publicacion } from "@/types/publicaciones";
import { get_query_filtros } from "@/lib/get_query_filtros";
import prisma from "@/lib/prisma";
import { unstable_cacheTag as cacheTag, unstable_cache, unstable_cacheLife, unstable_cacheTag } from "next/cache"
import { getSession } from "@/lib/session/session";
import { deleteImage, uploadImage } from "./images-actions";
import { ActionsResponse } from "@/types/actions-response";

interface PublicacionesResult {
  data: Publicacion[]
  totalCount: number | null
}


//// Función cacheada para obtener publicaciones (server action)
export const getPublicaciones = async (searchParams?: Record<string, any>, marcaId?: number | null): Promise<PublicacionesResult> => {

  try {
    const { skip, take, where } = get_query_filtros(searchParams, marcaId)


    // Ejecutar consultas en paralelo para mejorar rendimiento
    const [publicaciones, totalCount] = await Promise.all([
      prisma.publicacion.findMany({
        skip,
        take,
        where,
        orderBy: {
          destacado: "desc",
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
      }),

      prisma.publicacion.count({ where }),
    ])

    // Convert Decimal objects to regular numbers
    const serializedPublicaciones = publicaciones.map((pub) => ({
      ...pub,
      precio: pub.precio ? Number.parseFloat(pub.precio.toString()) : null,
      // Convert any other Decimal fields if they exist
      // For example:
      // kilometraje: pub.kilometraje ? parseFloat(pub.kilometraje.toString()) : null,
    }))
    return {
      data: serializedPublicaciones as unknown as Publicacion[],
      totalCount,
    }
  } catch (error) {
    return {
      data: [],
      totalCount: 0,
    }
  }
};

export const getIdPublicaciones = async () => {
  const publicaciones = await prisma.publicacion.findMany({
    select: {
      id: true,
      created_at: true,
    },
  })
  return publicaciones;
}

// export const getPublicacionById = unstable_cache(async (id: number) => {
//   const publicacion = await prisma.publicacion.findUnique({
//     where: { id },
//     include: {
//       marca: {
//         select: {
//           id: true,
//           nombre: true,
//         },
//       },
//       publicacion_imagenes: true,
//       cliente: {
//         select: {
//           id: true,
//           nombre: true,
//           apellido: true,
//           profile_img_url: true,
//           ciudad: true,
//         },
//       },
//     },
//   })
//   return publicacion as unknown as PublicacionCompleto
// }, ["publicacion-id"], { revalidate: 5 })

export const getPubliacionesDestacadas = unstable_cache(async () => {
  "use cache"
  unstable_cacheTag("publicaciones-destacadas")
  unstable_cacheLife({ revalidate: 10 })
  const publicaciones = await prisma.publicacion.findMany({
    take: 9,
    where: {
      destacado: true,
      vendido: false,
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
  })
  const serializedPublicaciones = publicaciones.map((pub) => ({
    ...pub,
    precio: pub.precio ? Number.parseFloat(pub.precio.toString()) : null,
    // Convert any other Decimal fields if they exist
    // For example:
    // kilometraje: pub.kilometraje ? parseFloat(pub.kilometraje.toString()) : null,
  }))
  return serializedPublicaciones as unknown as Publicacion[]
}, ["publicaciones-destacadas"], { revalidate: 100 })


export const getPublicacionesByUsuario = unstable_cache(async (id_usuario: number, q?: string) => {
  "use cache"
  unstable_cacheTag("publicaciones-usuario")
  unstable_cacheLife({ revalidate: 10 })


  try {
    const publicaciones = await prisma.publicacion.findMany({
      where: {
        AND: [
          { id_cliente: id_usuario },
          { vendido: false },
          { titulo: { contains: q, mode: "insensitive" } }
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
    })

    // Convert Decimal objects to regular numbers
    const serializedPublicaciones = publicaciones.map((pub) => ({
      ...pub,
      precio: pub.precio ? Number.parseFloat(pub.precio.toString()) : null,
      // Convert any other Decimal fields if they exist
      // For example:
      // kilometraje: pub.kilometraje ? parseFloat(pub.kilometraje.toString()) : null,
    }))

    return serializedPublicaciones as unknown as Publicacion[]
  } catch (error) {
    console.error("Error fetching publicaciones:")
    return []
  }
}, ["publicaciones-usuario"], { revalidate: 10 })


export const getPublicacionesByUsuarioVendidos = unstable_cache(async (id_usuario: number) => {
  "use cache"
  unstable_cacheTag("publicaciones-usuario")
  unstable_cacheLife({ revalidate: 10 })


  try {
    const publicaciones = await prisma.publicacion.findMany({
      where: {
        AND: [
          { id_cliente: id_usuario },
          { vendido: true },
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
      }
    })

    // Convert Decimal objects to regular numbers
    const serializedPublicaciones = publicaciones.map((pub) => ({
      ...pub,
      precio: pub.precio ? Number.parseFloat(pub.precio.toString()) : null,
      // Convert any other Decimal fields if they exist
      // For example:
      // kilometraje: pub.kilometraje ? parseFloat(pub.kilometraje.toString()) : null,
    }))

    return serializedPublicaciones as unknown as Publicacion[]
  } catch (error) {
    console.error("Error fetching publicaciones:")
    return []
  }
}, ["publicaciones-usuario-vendidos"], { revalidate: 10 })

export const changeVendido = async (id_publicacion: number, id_cliente: number, vendido: boolean): Promise<ActionsResponse<null>> => {
  try {
    const session = await getSession()
    const id_usuario = session?.userId

    if (!session || !id_usuario) {
      return { error: true, message: "No estás autenticado" }
    }

    if (id_cliente !== parseInt(id_usuario)) {
      return { error: true, message: "No puedes cambiar el estado de vendido de una publicación que no es tuya" }
    }

    await prisma.publicacion.update({
      where: { id: id_publicacion },
      data: { vendido },
    })

    return { error: false, message: "Publicación actualizada correctamente" }
  } catch (error) {
    console.error("Error changing vendido:")
    return { error: true, message: "Error al cambiar el estado de vendido" }
  }
}



export async function editarPublicacion(editedPubliacion: Publicacion, newImages: File[]): Promise<ActionsResponse<null>> {
  try {


    const session = await getSession()
    const id_cliente = session?.userId

    if (!session || !id_cliente) {
      return { error: true, message: "No estás autenticado" }
    }


    if (!editedPubliacion.anio || !editedPubliacion.titulo || !editedPubliacion.marca || !editedPubliacion.modelo || !editedPubliacion.tipo_transmision || !editedPubliacion.tipo_combustible || !editedPubliacion.precio || !editedPubliacion.tipo_moneda || !editedPubliacion.categoria || !editedPubliacion.ciudad || !editedPubliacion.color || !editedPubliacion.descripcion) {
      return { error: true, message: "Todos los campos son requeridos" }
    }

    if (editedPubliacion.precio <= 0 || editedPubliacion.anio <= 1900 || editedPubliacion.anio >= 2030) {
      return { error: true, message: "El precio y año deben ser validos" }
    }

    const publicacion = await prisma.publicacion.findUnique({
      where: { id: editedPubliacion.id },
      include: {
        publicacion_imagenes: true,
      }
    })

    if (!publicacion) {
      return { error: true, message: "No se encontró la publicación" }
    }

    if (publicacion.id_cliente !== parseInt(id_cliente)) {
      return { error: true, message: "No puedes editar una publicación que no es tuya" }
    }

    const total_imagenes = publicacion.publicacion_imagenes.length + newImages.length

    const suscripcion = await prisma.suscripcion.findFirst({
      where: {
        id_cliente: parseInt(id_cliente),
      },
      select: {
        tipo_suscripcion: {
          select: {
            max_publicaciones_por_vehiculo: true
          }
        },
      }
    })

    if (!suscripcion) {
      return { error: true, message: "No tienes una suscripción activa" }
    }


    if (total_imagenes > suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo) {
      return { error: true, message: `Limite de fotos de tu plan: ${suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo}. Porfavor, elimina algunas fotos y vuelve a intentarlo` }
    }

    const new_edited_publicacion = await prisma.publicacion.update({
      where: { id: editedPubliacion.id },
      data: {
        titulo: editedPubliacion.titulo,
        modelo: editedPubliacion.modelo,
        anio: editedPubliacion.anio,
        tipo_transmision: editedPubliacion.tipo_transmision,
        tipo_combustible: editedPubliacion.tipo_combustible,
        kilometraje: editedPubliacion.kilometraje,
        precio: editedPubliacion.precio,
        tipo_moneda: editedPubliacion.tipo_moneda,
        categoria: editedPubliacion.categoria,
        ciudad: editedPubliacion.ciudad,
        color: editedPubliacion.color,
        descripcion: editedPubliacion.descripcion,
        url_portada: editedPubliacion.url_portada,
      }
    })

    if (newImages.length > 0) {
      const uploadedPhotos = await Promise.all(newImages.map(async (photo) => {
        const response = await uploadImage({ file: photo, publicacionId: editedPubliacion.id })
        if (response.error) {
          throw new Error("Hubo un error al subir la imagen. Trata de subir desde la publicacion");
        }
        return response.url;
      }))
    }

    for (const image of publicacion.publicacion_imagenes) {
      if (!editedPubliacion.publicacion_imagenes.find(img => img.url === image.url)) {
        const response = await deleteImage(publicacion.id, image.url)
        await prisma.publicacion_imagenes.delete({
          where: { id: image.id }
        })
        if (response.error) {
          return { error: true, message: "Error al eliminar la imagen" }
        }
      }
    }



    return { error: false, message: "Publicación editada correctamente" }
  } catch (error) {
    console.error("Error editing publication:")
    return { error: true, message: "Error al editar la publicación" }
  }
}

export async function agregarVista(id_publicacion: number, id_usuario: number) {

  try {
    await prisma.publicacion_vistas.create({
      data: {
        id_publicacion,
        id_cliente: id_usuario
      }
    })
  } catch (error) {
    console.error("Error adding view:")
  }



}
