"use server"

import { Publicacion, PublicacionCompleto } from "@/types/publicaciones";
import { get_query_filtros } from "@/lib/get_query_filtros";
import prisma from "@/lib/prisma";
import { unstable_cacheTag as cacheTag, unstable_cache, unstable_cacheLife, unstable_cacheTag } from "next/cache"
import { getSession } from "@/lib/session/session";
import { revalidatePath } from "next/cache";
import { PublicarFormValues } from "@/types/publicar";
import { deleleteAllImages, deleteImage, uploadImage } from "./images-actions";
import { ActionsResponse } from "@/types/actions-response";
import { supabase } from "@/lib/supabase";

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


    return {
      data: publicaciones as unknown as Publicacion[],
      totalCount,
    }
  } catch (error) {
    console.error("Error fetching publicaciones:", error)
    return {
      data: [],
      totalCount: 0,
    }
  }
};

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
      publicacion_imagenes: {
        select: {
          id: true,
          url: true,
        },
        take: 1,
      },
    },
  })

  return publicaciones as unknown as Publicacion[]
}, ["publicaciones-destacadas"], { revalidate: 100 })


export const getPublicacionesByUsuario = unstable_cache(async (id_usuario: number, q?: string) => {
  "use cache"
  unstable_cacheTag("publicaciones-usuario")
  unstable_cacheLife({ revalidate: 10 })


  try {
    const publicaciones = await prisma.publicacion.findMany({
      where: { id_cliente: id_usuario, titulo: { contains: q, mode: "insensitive" } },
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
        publicacion_imagenes: {
          select: {
            id: true,
            url: true,
          },
          take: 1,
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
    console.error("Error fetching publicaciones:", error)
    return []
  }
}, ["publicaciones-usuario"], { revalidate: 10 })
export async function publicarVehiculo(data: PublicarFormValues): Promise<ActionsResponse<number>> {
  try {
    const session = await getSession()
    const id_cliente = session?.userId

    if (!session || !id_cliente) {
      return { error: true, message: "No estás autenticado" }
    }

    // Validaciones iniciales (suscripción, límites, etc.)
    const suscripcion = await prisma.suscripcion.findFirst({
      where: {
        id_cliente: Number.parseInt(id_cliente),
      },
      select: {
        estado: true,
        tipo_suscripcion: {
          select: {
            publicaciones_destacadas: true,
            max_publicaciones: true,
            max_publicaciones_por_vehiculo: true,
          },
        },
      },
    })

    if (!suscripcion) {
      return { error: true, message: "No tienes una suscripción activa" }
    }

    if (suscripcion.estado === "vencida") {
      return { error: true, message: "Tu suscripción está vencida. Porfavor, actualiza tu plan" }
    }

    const count_publicaciones = await prisma.publicacion.count({
      where: {
        id_cliente: Number.parseInt(id_cliente),
      },
    })

    if (count_publicaciones >= suscripcion.tipo_suscripcion.max_publicaciones) {
      return { error: true, message: "Pasaste el limite de publicaciones. Porfavor, actualiza tu plan" }
    }

    const {
      anio,
      photos,
      titulo,
      marca,
      modelo,
      tipo_transmision,
      tipo_combustible,
      kilometraje,
      precio,
      tipo_moneda,
      categoria,
      ciudad,
      color,
      descripcion,
    } = data

    // Validaciones de datos
    if (photos.length === 0) {
      return { error: true, message: "Debes subir al menos una foto" }
    }

    if (photos.length > suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo) {
      return {
        error: true,
        message: `Limite de fotos de tu plan: ${suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo}. Porfavor, elimina algunas fotos y vuelve a intentarlo`,
      }
    }

    if (precio <= 0) {
      return { error: true, message: "El precio debe ser mayor a 0" }
    }

    if (anio <= 1900 || anio >= 2030) {
      return { error: true, message: "El año debe ser mayor a 1900 y menor a 2030" }
    }

    if (
      !titulo ||
      !marca ||
      !modelo ||
      !tipo_transmision ||
      !tipo_combustible ||
      !precio ||
      !tipo_moneda ||
      !categoria ||
      !ciudad ||
      !color ||
      !descripcion ||
      !photos ||
      !anio
    ) {
      return { error: true, message: "Todos los campos son requeridos" }
    }

    if (typeof precio !== "number" || typeof anio !== "number" || typeof kilometraje !== "number") {
      return { error: true, message: "Error en los datos ingresados" }
    }

    if (precio <= 0 || anio <= 0) {
      return { error: true, message: "El precio y año deben ser mayores a 0" }
    }

    // Buscar la marca antes de la transacción
    const marca_seleccionada = await prisma.marca.findFirst({
      where: {
        nombre: {
          equals: marca,
          mode: "insensitive",
        },
      },
    })

    if (!marca_seleccionada) {
      return { error: true, message: "Marca no encontrada" }
    }

    // 1. Primero crear la publicación sin imágenes
    const publicacion_destacada = suscripcion.tipo_suscripcion.publicaciones_destacadas

    const newPublicacion = await prisma.publicacion.create({
      data: {
        titulo: titulo,
        modelo: modelo,
        anio: anio,
        tipo_transmision: tipo_transmision,
        tipo_combustible: tipo_combustible,
        kilometraje: kilometraje,
        precio: precio,
        tipo_moneda: tipo_moneda,
        categoria: categoria,
        ciudad: ciudad,
        color: color,
        descripcion: descripcion,
        id_cliente: Number.parseInt(id_cliente),
        id_marca: marca_seleccionada.id,
        destacado: publicacion_destacada,
      },
    })

    const publicacion_id = newPublicacion.id

    // 2. Subir las imágenes en lotes pequeños para evitar timeouts
    try {
      // Subir la primera imagen y establecerla como portada
      if (photos.length > 0) {
        const firstPhoto = photos[0]
        const portadaResult = await uploadSingleImage(firstPhoto, publicacion_id)

        if (portadaResult.error) {
          throw new Error(portadaResult.message)
        }

        // Actualizar la URL de la portada
        await prisma.publicacion.update({
          where: { id: publicacion_id },
          data: { url_portada: portadaResult.url },
        })

        // Subir el resto de las imágenes en segundo plano
        if (photos.length > 1) {
          // No esperamos a que termine este proceso
          uploadRemainingImagesInBackground(photos.slice(1), publicacion_id)
        }
      }

      // 3. Actualizar contador de publicaciones de la marca
      await prisma.marca.update({
        where: { id: marca_seleccionada.id },
        data: { cantidad_publicaciones: { increment: 1 } },
      })

      return {
        error: false,
        message: "Vehículo publicado correctamente. Las imágenes adicionales se están procesando.",
        data: publicacion_id,
      }
    } catch (error) {
      console.error("Error al subir imágenes:", error)

      // Aún devolvemos éxito porque la publicación se creó
      return {
        error: false,
        message:
          "Vehículo publicado correctamente, pero hubo problemas al subir algunas imágenes. Puedes añadirlas más tarde desde la edición.",
        data: publicacion_id,
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error publishing vehicle:", error.message)
      return { error: true, message: error.message }
    } else {
      console.error("Error publishing vehicle:", error)
      return { error: true, message: error as string }
    }
  }
}

// Función para subir las imágenes restantes en segundo plano
async function uploadRemainingImagesInBackground(files: File[], publicacionId: number) {
  try {
    // Subir imágenes en lotes de 2 para evitar sobrecargar el servidor
    const batchSize = 2

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize)

      // Subir este lote en paralelo
      await Promise.all(batch.map((file) => uploadSingleImage(file, publicacionId)))

      // Pequeña pausa entre lotes para no sobrecargar el servidor
      if (i + batchSize < files.length) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    console.log(`Todas las imágenes (${files.length}) han sido subidas para la publicación ${publicacionId}`)
  } catch (error) {
    console.error(`Error al subir imágenes en segundo plano para publicación ${publicacionId}:`, error)
  }
}
async function uploadSingleImage(file: File, publicacionId: number) {
  try {
    if (!file) {
      return { error: true, message: "No se ha enviado ningún archivo" }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { error: true, message: "La imagen es demasiado grande. El tamaño máximo es de 5MB" }
    }

    // Crear un nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `publicaciones/${publicacionId}/${fileName}`

    // Subir la imagen a Supabase
    const { data, error } = await supabase.storage.from("auto-market").upload(filePath, file)

    if (error) {
      console.error("Error al subir imagen:", error)
      return { error: true, message: error.message }
    }

    // Obtener URL pública del archivo subido
    const {
      data: { publicUrl },
    } = supabase.storage.from("auto-market").getPublicUrl(data.path)

    // Crear el registro en la base de datos
    await prisma.publicacion_imagenes.create({
      data: {
        url: publicUrl,
        publicacion_id: publicacionId,
      },
    })

    return { error: false, message: "Imagen subida correctamente", url: publicUrl }
  } catch (error) {
    console.error("Error al subir imagen:", error)
    if (error instanceof Error) {
      return { error: true, message: `Error al subir imagen: ${error.message}` }
    }
    return { error: true, message: "Error al subir imagen" }
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
    console.error("Error editing publication:", error)
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
  }



}
