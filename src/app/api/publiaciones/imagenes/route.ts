import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    // Get form data with the file
    const formData = await request.formData()
    const file = formData.get("file") as File
    const publicacionId = formData.get("publicacionId") as string
    const index = formData.get("index") as string

    if (!file) {
      return NextResponse.json({ error: true, message: "No se ha enviado ningún archivo" }, { status: 400 })
    }

    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: true, message: "La imagen es demasiado grande. El tamaño máximo es de 5MB" },
        { status: 400 },
      )
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
      return NextResponse.json(
        { error: true, message: uploadResult?.error?.message || "Error al subir imagen" },
        { status: 500 },
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("auto-market").getPublicUrl(uploadResult.data.path)
    if (index === "0") {
      await prisma.publicacion.update({
        where: { id: Number(publicacionId) },
        data: { url_portada: publicUrl },
      })
    }
    await prisma.publicacion_imagenes.create({
      data: {
        publicacion_id: Number(publicacionId),
        url: publicUrl,
        index : Number(index)
      },
    })

    return NextResponse.json({
      error: false,
      message: "Imagen subida correctamente",
      url: publicUrl,
    })
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ error: true, message: "Error al subir imagen" }, { status: 500 })
  }
}
