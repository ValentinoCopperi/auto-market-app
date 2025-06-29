"use server"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session/session"
import { ActionsResponse } from "@/types/actions-response"
import { Cliente } from "@/types/cliente"
import { cache } from "react"
import { uploadProfileImage, uploadProfileBannerImage } from "./images-actions"

export const getClienteById = cache(async (id: string) => {
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) }, include: {
        suscripcion: {
          select: {
            estado: true,
            tipo_suscripcion: {
              select: {
                nombre: true,
              }
            }
          }
        }
      }
    })
    const serializedCliente = {
      ...cliente,
      suscripcion: {
        ...cliente?.suscripcion[0],
        tipo_suscripcion: cliente?.suscripcion[0]?.tipo_suscripcion?.nombre
      }
    }
    return serializedCliente as unknown as Cliente
  } catch (error) {
    console.error("Error fetching cliente:", error)
    return null
  }
})

export const updateProfileBannerImage = async (id: number, image: File): Promise<ActionsResponse<string>> => {

  try {
    const session = await getSession()
    const sessionId = session?.userId

    if (!session || !sessionId) return {
      error: true,
      message: "No estás autenticado"
    }
    const parsedSessionId = parseInt(sessionId)

    if (parsedSessionId !== id) return {
      error: true,
      message: "No tienes permisos para actualizar esta imagen"
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: parsedSessionId } })

    if (!cliente) return {
      error: true,
      message: "No se encontró el cliente"
    }

    const { error, message, data } = await uploadProfileImage(image, id, cliente.banner_img_url)

    if (error || !data) return {
      error: true,
      message
    }

    await prisma.cliente.update({
      where: { id: parsedSessionId },
      data: {
        banner_img_url: data
      }
    })

    return {
      error: false,
      message: "Imagen subida correctamente",
      data: data
    }
  } catch (error) {
    console.error("Error al actualizar la imagen de perfil:", error)
    return {
      error: true,
      message: "Error al actualizar la imagen de perfil"
    }
  }
}

export const updateProfileImage = async (id: number, image: File): Promise<ActionsResponse<string>> => {

  try {
    const session = await getSession()
    const sessionId = session?.userId

    if (!session || !sessionId) return {
      error: true,
      message: "No estás autenticado"
    }
    const parsedSessionId = parseInt(sessionId)

    if (parsedSessionId !== id) return {
      error: true,
      message: "No tienes permisos para actualizar esta imagen"
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: parsedSessionId } })

    if (!cliente) return {
      error: true,
      message: "No se encontró el cliente"
    }

    const { error, message, data } = await uploadProfileBannerImage(image, id, cliente.profile_img_url)

    if (error || !data) return {
      error: true,
      message
    }

    await prisma.cliente.update({
      where: { id: parsedSessionId },
      data: {
        profile_img_url: data
      }
    })

    return {
      error: false,
      message: "Imagen subida correctamente",
      data: data
    }
  } catch (error) {
    console.error("Error al actualizar la imagen de perfil:", error)
    return {
      error: true,
      message: "Error al actualizar la imagen de perfil"
    }
  }
}

interface EditarPerfilRequest {
  nombre: string
  apellido?: string
  telefono: string
  ciudad: string
  descripcion?: string | null
  new_profile_img?: File | null
  new_banner_img?: File | null
}


export const editarPerfil = async (id: number, data: EditarPerfilRequest): Promise<ActionsResponse<string>> => {

  try {
    const session = await getSession()
    const sessionId = session?.userId

    if (!session || !sessionId) return {
      error: true,
      message: "No estás autenticado"
    }

    const parsedSessionId = parseInt(sessionId)

    if (parsedSessionId !== id) return {
      error: true,
      message: "No tienes permisos para actualizar este perfil"
    }

    const { nombre, apellido, telefono, ciudad, descripcion, new_profile_img, new_banner_img } = data

    if (!nombre || !telefono || !ciudad) return {
      error: true,
      message: "Todos los campos son requeridos"
    }

    const cliente = await prisma.cliente.findUnique({ where: { id: parsedSessionId } })

    if (!cliente) return {
      error: true,
      message: "No se encontró el cliente"
    }

    let new_profile_img_url = cliente.profile_img_url
    let new_banner_img_url = cliente.banner_img_url


    if (new_profile_img) {
      const { error, message, data } = await uploadProfileImage(new_profile_img, id, cliente.profile_img_url)
      if (error || !data) return {
        error: true,
        message
      }
      new_profile_img_url = data
    }

    if (new_banner_img) {
      const { error, message, data } = await uploadProfileBannerImage(new_banner_img, id, cliente.banner_img_url)
      if (error || !data) return {
        error: true,
        message
      }
      new_banner_img_url = data
    }

    const parsedTelefono = parseInt(telefono)

    console.log(parsedTelefono)

    await prisma.cliente.update({
      where: { id: parsedSessionId },
      data: {
        nombre,
        apellido,
        telefono: parsedTelefono,
        ciudad,
        descripcion,
        profile_img_url: new_profile_img_url,
        banner_img_url: new_banner_img_url
      }
    })

    return {
      error: false,
      message: "Perfil actualizado correctamente",
      data: "Perfil actualizado correctamente"
    }

  } catch (error) {
    console.error("Error al actualizar el perfil:", error)
    return {
      error: true,
      message: "Error al actualizar el perfil"
    }
  }
}

export const calificarCliente = async (id_cliente_calificado: number, rating: number, comment: string): Promise<ActionsResponse<string>> => {

  try {
    const session = await getSession()
    const sessionId = session?.userId

    if (!session || !sessionId) return {
      error: true,
      message: "No estás autenticado"
    }

    const parsedSessionId = parseInt(sessionId)

    if (parsedSessionId === id_cliente_calificado) return {
      error: true,
      message: "No puedes calificar a ti mismo"
    }

    if (rating < 1 || rating > 5) return {
      error: true,
      message: "La calificación debe ser entre 1 y 5"
    }

    if (typeof comment !== "string") return {
      error: true,
      message: "El comentario debe ser un texto plano"
    }

    if (comment.length > 200) return {
      error: true,
      message: "El comentario debe ser menor a 200 caracteres"
    }

    const cliente_calificado = await prisma.cliente.findUnique({ where: { id: id_cliente_calificado } });

    if (!cliente_calificado) return {
      error: true,
      message: "No se encontró el cliente a calificar"
    }

    const calificacion = await prisma.valoracion.create({
      data: {
        id_cliente_votante: parsedSessionId,
        id_cliente_valorado: id_cliente_calificado,
        valoracion: rating,
        comentario: comment
      }
    })

    return {
      error: false,
      message: "Calificación creada correctamente",
    }
  } catch (error) {
    console.error("Error al calificar al cliente:", error)
    return {
      error: true,
      message: "Error al calificar al cliente"
    }

  }

}

interface AgenciaPopularesResponse {
  nombre: string;
  profile_img_url: string;
  id: number;
}

export const getAgenciasPopulares = async (): Promise<ActionsResponse<AgenciaPopularesResponse[]>> => {
  try {
    const agencias = await prisma.cliente.findMany({
      where: {
        tipo_cliente: "empresa"
      },
      select: {
        nombre: true,
        profile_img_url: true,
        id: true,
        _count: {
          select: {
            publicacion: true
          }
        }
      },
      orderBy: {
        publicacion: {
          _count: 'desc'
        }
      },
      take: 8
    })

    return {
      error: false,
      message: "Agencias populares obtenidas correctamente",
      data: agencias as unknown as AgenciaPopularesResponse[]
    }

  } catch (error) {
    console.error("Error al obtener las agencias populares:", error)
    return {
      error: true,
      message: "Error al obtener las agencias populares"
    }
  }
}