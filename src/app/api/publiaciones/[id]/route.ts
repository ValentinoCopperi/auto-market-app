import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session/session"
import { supabase } from "@/lib/supabase";
import { deleleteAllImages } from "@/actions/images-actions";
import { PublicacionImagen } from "@/types/publicaciones";


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
        publicacion_imagenes: {
          select: {
            id: true,
            url: true,
          },
          orderBy: {
            //Las q se crearon primero seran las primeras
            created_at: "asc",
          },
        },
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

    let cantidadPublicaciones = marca.cantidad_publicaciones ? marca.cantidad_publicaciones - 1 : 0
    if (cantidadPublicaciones < 0) {
      cantidadPublicaciones = 0
    }
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
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: number }> }) {
  try {
    const { id } = await params

    // Get session and authenticate user
    const session = await getSession()
    const userId = session?.userId

    if (!session || !userId) {
      return NextResponse.json({ error: true, message: "No estás autenticado" }, { status: 401 })
    }


    const formattedId = Number(id);

    if (isNaN(formattedId)) {
      return NextResponse.json({ error: true, message: "ID inválido" }, { status: 400 })
    }
    // Check if the publication exists and belongs to the user
    const publicacion = await prisma.publicacion.findUnique({
      where: { id: formattedId },
      include: {
        publicacion_imagenes: true,
      },
    })

    if (!publicacion) {
      return NextResponse.json({ error: true, message: "Publicación no encontrada" }, { status: 404 })
    }

    if (publicacion.id_cliente !== Number(userId)) {
      return NextResponse.json(
        { error: true, message: "No tienes permiso para editar esta publicación" },
        { status: 403 },
      )
    }
    const maximo_imagenes = await prisma.suscripcion.findFirst({
      where: {
        id_cliente: Number(userId),
      },
      select: {
        estado: true,
        tipo_suscripcion: {
          select: {
            max_publicaciones_por_vehiculo: true,
          },
        },
      },
    })
    if (maximo_imagenes === null) {
      return NextResponse.json({ error: true, message: "No tienes una suscripción activa" }, { status: 403 })
    }
    if (maximo_imagenes.estado === "vencida") {
      return NextResponse.json(
        { error: true, message: "Tu suscripción está vencida. Porfavor, actualiza tu plan" },
        { status: 403 },
      )
    }

    const formData = await request.formData();
    // Extract basic fields
    const titulo = formData.get('titulo') as string;
    const modelo = formData.get('modelo') as string;
    const anio = Number(formData.get('anio'));
    const tipo_transmision = formData.get('tipo_transmision') as string;
    const tipo_combustible = formData.get('tipo_combustible') as string;
    const kilometraje = Number(formData.get('kilometraje'));
    const precio = Number(formData.get('precio'));
    const tipo_moneda = formData.get('tipo_moneda') as string;
    const categoria = formData.get('categoria') as string;
    const ciudad = formData.get('ciudad') as string;
    const color = formData.get('color') as string;
    const descripcion = formData.get('descripcion') as string;
    const url_portada = formData.get('url_portada') as string;
    const publicacion_imagenes = formData.get('publicacion_imagenes') as string;
    const newImages = formData.getAll('new_images') as File[];
    console.log(formData)

    if (!titulo || !categoria || !ciudad || !descripcion || !modelo || !tipo_transmision || !tipo_combustible || !color) {
      return NextResponse.json({ error: true, message: "Todos los campos son requeridos" }, { status: 400 })
    }

    if (isNaN(precio) || isNaN(anio) || isNaN(kilometraje)) {
      return NextResponse.json({ error: true, message: "El precio, año y kilometraje deben ser números" }, { status: 400 })
    }

    const publicacion_imagenes_array = JSON.parse(publicacion_imagenes) as PublicacionImagen[];

    if (publicacion_imagenes_array) {
      if (publicacion_imagenes_array.length + newImages.length === 0) {
        return NextResponse.json({ error: true, message: "Debes subir al menos una foto" }, { status: 400 })
      }
      if (publicacion_imagenes_array.length + newImages.length > maximo_imagenes.tipo_suscripcion.max_publicaciones_por_vehiculo) {
        return NextResponse.json({ error: true, message: `Límite de fotos de tu plan: ${maximo_imagenes.tipo_suscripcion.max_publicaciones_por_vehiculo}. Elimina algunas fotos o sube menos.`, }, { status: 400 })
      }
    }





    // Process imagenes_a_eliminar if present
    const imagenes_actuales = await prisma.publicacion_imagenes.findMany({
      where: {
        publicacion_id: formattedId,
      },
    })

    for (const imagen of imagenes_actuales) {
      if (!publicacion_imagenes_array.some(imagen => imagen.id === imagen.id)) {
        deleteImage(formattedId, imagen.url)
      }
    }


    // Start transaction to update publication
    try {
      await prisma.$transaction(async (tx) => {
        // Update publication data
        await tx.publicacion.update({
          where: { id: formattedId },
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
            url_portada: url_portada || publicacion.url_portada,
          },
        })
      })

      // Upload new images (outside transaction since it involves external storage)
      const uploadedPhotos: string[] = []

      for (const photo of newImages) {
        try {
          const response = await uploadImage({
            file: photo,
            fileName: photo.name,
            publicacionId: formattedId,
            contentType: photo.type,
          })

          if (!response.error && response.url) {
            uploadedPhotos.push(response.url)
          }
        } catch (error) {
          console.error("Error processing image:", error)
          // Continue with next photo
        }
      }

      // If we need to update the cover image because it was deleted and there were no remaining images
      if (
        uploadedPhotos.length > 0
      ) {
        await prisma.publicacion_imagenes.createMany({
          data: uploadedPhotos.map((url) => ({
            url: url,
            publicacion_id: formattedId,
          })),
        })
      }

      return NextResponse.json({
        error: false,
        message: "Publicación actualizada correctamente",
        data: {
          id: formattedId,
        },
      })
    } catch (error) {
      console.error("Error updating publication:", error)
      return NextResponse.json(
        { error: true, message: "Error al actualizar la publicación. Intenta nuevamente." },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      {
        error: true,
        message: error instanceof Error ? error.message : "Error al actualizar la publicación. Intenta nuevamente.",
      },
      { status: 500 },
    )
  }
}
interface UploadImageData {
  file: File
  fileName: string
  publicacionId: number
  contentType: string
}
// Function to upload an image to Supabase
async function uploadImage({ file, fileName, publicacionId, contentType }: UploadImageData) {
  try {
    // Create a unique filename
    const fileExt = fileName.split(".").pop() || "jpg"
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `publicaciones/${publicacionId}/${uniqueFileName}`

    // Upload to Supabase with retry logic
    let uploadAttempt = 0
    let uploadResult

    while (uploadAttempt < 3) {
      try {
        uploadResult = await supabase.storage.from("auto-market").upload(filePath, file, {
          contentType,
          cacheControl: "3600",
        })

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
    await prisma.publicacion_imagenes.create({
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


const deleteImage = async (publicacionId: number, url: string) => {
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
