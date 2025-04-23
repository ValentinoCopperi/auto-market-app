"use server"

import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session/session"
import { ActionsResponse } from "@/types/actions-response"
import { RegistroFormSchema } from "@/types/auth/registro"
import { Cliente } from "@/types/cliente"
import { Action } from "@prisma/client/runtime/library"
import { cache } from "react"
import { uploadProfileImage, uploadProfileBannerImage } from "./images-actions"
import { EditarPerfilFormSchema } from "@/types/auth/editar-perfil"

export const getClienteById = cache(async (id: string) => {
  try {
    const cliente = await prisma.cliente.findUnique({ where: { id: parseInt(id) } })
    return cliente as unknown as Cliente
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


export const editarPerfil = async (id: number, data: EditarPerfilRequest) : Promise<ActionsResponse<string>> => {
  
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

    if(!nombre || !telefono || !ciudad) return {
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


    if(new_profile_img) {
      const { error, message, data } = await uploadProfileImage(new_profile_img, id, cliente.profile_img_url)
      if (error || !data) return {
        error: true,
        message
      }
      new_profile_img_url = data
    }

    if(new_banner_img) {
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