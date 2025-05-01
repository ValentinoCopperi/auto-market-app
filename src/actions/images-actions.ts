"use server"

import { supabase } from "@/lib/supabase"
import { ActionsResponse } from "@/types/actions-response"
import { Prisma, PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"
import prisma from "@/lib/prisma"

interface UploadImageData {
    file: File
    publicacionId: number
    tx?: Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'> | null
}



export async function uploadImage({ file, publicacionId, tx }: UploadImageData) {
    try {
        if (!file) {
            return { error: true, message: "No se ha enviado ningún archivo" }
        }

        // Validate file size again as a safety measure
        if (file.size > 5 * 1024 * 1024) {
            return { error: true, message: "La imagen es demasiado grande. El tamaño máximo es de 5MB" }
        }

        // Create a unique filename
        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `publicaciones/${publicacionId}/${fileName}`

        // Upload to Supabase with retry logic
        let uploadAttempt = 0
        let uploadResult

        while (uploadAttempt < 3) {
            try {
                uploadResult = await supabase.storage.from("auto-market").upload(filePath, file)

                if (!uploadResult.error) break

                // If there's an error, wait before retrying
                await new Promise((resolve) => setTimeout(resolve, 1000))
                uploadAttempt++
            } catch (e) {
                console.error(`Upload attempt ${uploadAttempt + 1} failed:`, e)
                uploadAttempt++
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
        }

        if (!uploadResult || uploadResult.error) {
            console.error("Error al subir imagen después de intentos:", uploadResult?.error)
            return { error: true, message: uploadResult?.error?.message || "Error al subir imagen" }
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = supabase.storage.from("auto-market").getPublicUrl(uploadResult.data.path)

        // Save image reference in database
        const orm = tx || prisma
        await orm.publicacion_imagenes.create({
            data: {
                url: publicUrl,
                publicacion_id: publicacionId,
            },
        })

        return { error: false, message: "Imagen subida correctamente", url: publicUrl }
    } catch (error) {
        console.error("Error al subir imagen:", error)
        return { error: true, message: "Error al subir imagen" }
    }
}



export const deleleteAllImages = async (formattedId: number): Promise<ActionsResponse<null>> => {

    const { data: files, error: listError } = await supabase
        .storage
        .from("auto-market")
        .list(`publicaciones/${formattedId}`);

    if (listError) {
        return { error: true, message: "Error al listar archivos" }
    }

    // 2. Eliminar todos los archivos encontrados de una vez
    if (files && files.length > 0) {
        const filePaths = files.map(file => `publicaciones/${formattedId}/${file.name}`);

        const { data, error: deleteError } = await supabase
            .storage
            .from("auto-market")
            .remove(filePaths);

        if (deleteError) {
            return { error: true, message: "Error al eliminar archivos" }
        } else {
            return { error: false, message: `Eliminados ${filePaths.length} archivos correctamente` }
        }
    }

    return { error: false, message: "No se encontraron archivos para eliminar" }

}


export async function uploadProfileBannerImage(file: File, id: number, old_banner_url: string | null): Promise<ActionsResponse<string>> {
    try {

        const formData = new FormData()
        formData.append("file", file)

        if (!file) return { error: true, message: "No se ha enviado ningún archivo" }

        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `clients/${id}/${fileName}`

        const { data, error } = await supabase.storage
            .from("auto-market")
            .upload(filePath, file)

        if (error) return { error: true, message: error.message }

        const { data: { publicUrl } } = supabase.storage
            .from("auto-market")
            .getPublicUrl(data.path)

        if (old_banner_url) {
            // Extraer la ruta de almacenamiento desde la URL pública
            const pathMatch = old_banner_url.match(/\/storage\/v1\/object\/public\/auto-market\/(.+)/)

            if (pathMatch && pathMatch[1]) {
                const oldPath = decodeURIComponent(pathMatch[1])

                const { error: deleteError } = await supabase
                    .storage
                    .from("auto-market")
                    .remove([oldPath])

                if (deleteError) {
                    console.warn("No se pudo eliminar la imagen anterior:", deleteError)
                }
            }
        }

        return { error: false, message: "Imagen subida correctamente", data: publicUrl }


    } catch (error) {
        console.error("Error al subir imagen de perfil:", error)
        return { error: true, message: "Error al subir imagen de perfil" }
    }
}

export async function uploadProfileImage(file: File, id: number, old_profile_url: string | null): Promise<ActionsResponse<string>> {


    try {

        const formData = new FormData()
        formData.append("file", file)

        if (!file) return { error: true, message: "No se ha enviado ningún archivo" }

        const fileExt = file.name.split(".").pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
        const filePath = `clients/${id}/${fileName}`

        const { data, error } = await supabase.storage
            .from("auto-market")
            .upload(filePath, file)

        if (error) return { error: true, message: error.message }

        const { data: { publicUrl } } = supabase.storage
            .from("auto-market")
            .getPublicUrl(data.path)

        if (old_profile_url) {
            // Extraer la ruta de almacenamiento desde la URL pública
            const pathMatch = old_profile_url.match(/\/storage\/v1\/object\/public\/auto-market\/(.+)/)

            if (pathMatch && pathMatch[1]) {
                const oldPath = decodeURIComponent(pathMatch[1])

                const { error: deleteError } = await supabase
                    .storage
                    .from("auto-market")
                    .remove([oldPath])

                if (deleteError) {
                    console.warn("No se pudo eliminar la imagen anterior:", deleteError)
                }
            }
        }

        return { error: false, message: "Imagen subida correctamente", data: publicUrl }


    } catch (error) {
        console.error("Error al subir imagen de perfil:", error)
        return { error: true, message: "Error al subir imagen de perfil" }
    }

}

export const deleteImage = async (publicacionId: number, url: string): Promise<ActionsResponse<null>> => {
    try {
        // Extraer el path relativo de la URL completa
        const getPathFromUrl = (fullUrl: string) => {
            const parts = fullUrl.split("/auto-market/");
            return parts.length > 1 ? parts[1] : fullUrl;
        };

        const filePath = getPathFromUrl(url);
        console.log("filePath", filePath)
        const { error: deleteError } = await supabase
            .storage
            .from("auto-market")
            .remove([filePath]);

        if (deleteError) {
            console.error("Error al eliminar la imagen:", deleteError);
            return { error: true, message: `Error al eliminar la imagen: ${deleteError.message}` };
        }

        return { error: false, message: "Imagen eliminada correctamente" };
    } catch (error) {
        console.error("Error inesperado:", error);
        return { error: true, message: `Error inesperado: ${error instanceof Error ? error.message : String(error)}` };
    }
};
