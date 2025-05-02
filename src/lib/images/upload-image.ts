import { supabase } from "../supabase"
interface UploadImageData {
    file: File
    publicacionId: number
    tx: any | null
}

// Function to upload an image to Supabase
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