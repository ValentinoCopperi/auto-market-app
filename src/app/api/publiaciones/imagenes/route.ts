import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { isAuthenticated } from "@/lib/session/session"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {

  if (!isAuthenticated()) {
    return NextResponse.json({ error: true, message: "No estás autenticado" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: true, message: "No se ha enviado ningún archivo" }, { status: 400 })
    }

    // Crear un nombre único para el archivo
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `publicaciones/${fileName}`


    // Subir archivo a Supabase storage
    const { data, error } = await supabase.storage
      .from("auto-market") // Reemplaza con el nombre de tu bucket
      .upload(filePath, file)

    if (error) {
        console.error("Error al subir imagen 213:", error)
      return NextResponse.json({ error: true, message: error.message }, { status: 500 })
    }

    // Obtener URL pública del archivo subido
    const {
      data: { publicUrl },
    } = supabase.storage.from("auto-market").getPublicUrl(data.path)

    console.log(data.path)
    console.log(publicUrl)

    return NextResponse.json({
      error: false,
      data: {
        path: data.path,
        url: publicUrl,
      },
    })
  } catch (error) {
    console.error("Error al subir imagen:", error)
    return NextResponse.json({ error: true, message: "Error al subir la imagen" }, { status: 500 })
  }
}
