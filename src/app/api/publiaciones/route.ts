import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAuthenticated } from "@/lib/session/session";
import { get_query_filtros } from "@/lib/get_query_filtros";
import { supabase } from "@/lib/supabase";
import { publicarFormSchema } from "@/types/publicar";
import { z } from "zod";

export async function GET(request: NextRequest) {

    try {

        const searchParams = request.nextUrl.searchParams
        const { skip, take, where } = get_query_filtros(searchParams)

        const [publicaciones, totalCount] = await Promise.all([
            prisma.publicacion.findMany({
                skip,
                take,
                where,
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
                    },
                },
            }),
            prisma.publicacion.count({ where }),
        ])

        return NextResponse.json({ data: publicaciones, error: false, message: "Publicaciones obtenidas correctamente" }, { status: 200 });
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: true, message: "Error al obtener las publicaciones" }, { status: 500 });
    }


}

// Interface for upload image data
interface UploadImageData {
    file: File
    publicacionId: number
    tx: any | null
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

export async function POST(request: NextRequest) {
    try {
        // Get session and authenticate user
        const session = await getSession()
        const id_cliente = session?.userId

        if (!session || !id_cliente) {
            return NextResponse.json({ error: true, message: "No estás autenticado" }, { status: 401 })
        }

        // Get form data from request
        const formData = await request.formData()

        // Extract form fields
        const formValues: Record<string, any> = {}

        // Process all non-photo fields
        formData.forEach((value, key) => {
            if (!key.startsWith("photo_")) {
                // Convert numeric values
                if (key === "anio" || key === "kilometraje" || key === "precio") {
                    formValues[key] = Number(value)
                } else {
                    formValues[key] = value
                }
            }
        })

        // Extract photos
        const photos: File[] = []
        for (let i = 0; i < 100; i++) {
            const photo = formData.get(`photo_${i}`)
            if (photo instanceof File) {
                photos.push(photo)
            } else if (photo === null) {
                break
            }
        }

        // Check subscription status
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
            return NextResponse.json({ error: true, message: "No tienes una suscripción activa" }, { status: 403 })
        }

        if (suscripcion.estado === "vencida") {
            return NextResponse.json(
                { error: true, message: "Tu suscripción está vencida. Porfavor, actualiza tu plan" },
                { status: 403 },
            )
        }

        // Check publication limits
        const count_publicaciones = await prisma.publicacion.count({
            where: {
                id_cliente: Number.parseInt(id_cliente),
            },
        })

        if (count_publicaciones >= suscripcion.tipo_suscripcion.max_publicaciones) {
            return NextResponse.json(
                { error: true, message: "Pasaste el limite de publicaciones. Porfavor, actualiza tu plan" },
                { status: 403 },
            )
        }

        // Validate photos
        if (photos.length === 0) {
            return NextResponse.json({ error: true, message: "Debes subir al menos una foto" }, { status: 400 })
        }

        if (photos.length > suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo) {
            return NextResponse.json(
                {
                    error: true,
                    message: `Limite de fotos de tu plan: ${suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo}. Porfavor, elimina algunas fotos y vuelve a intentarlo`,
                },
                { status: 400 },
            )
        }

        // Validate all photos before starting the transaction
        for (const photo of photos) {
            if (photo.size > 5 * 1024 * 1024) {
                return NextResponse.json(
                    { error: true, message: `La imagen "${photo.name}" es demasiado grande. El tamaño máximo es de 5MB` },
                    { status: 400 },
                )
            }
        }

        // Validate form data
        try {
            publicarFormSchema.parse(formValues)
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ")
                return NextResponse.json({ error: true, message: `Datos inválidos: ${errorMessages}` }, { status: 400 })
            }
            return NextResponse.json({ error: true, message: "Datos inválidos" }, { status: 400 })
        }

        const {
            titulo,
            marca,
            modelo,
            anio,
            tipo_transmision,
            tipo_combustible,
            kilometraje,
            precio,
            tipo_moneda,
            categoria,
            ciudad,
            color,
            descripcion,
        } = formValues

        const publicacion_destacada = suscripcion.tipo_suscripcion.publicaciones_destacadas

        let newPublicacionId: number

        try {
            // First transaction: Create the publication
            const result = await prisma.$transaction(
                async (tx) => {
                    const marca_seleccionada = await tx.marca.findFirst({
                        where: {
                            nombre: {
                                equals: marca,
                                mode: "insensitive",
                            },
                        },
                    })

                    if (!marca_seleccionada) {
                        throw new Error("Marca no encontrada")
                    }

                    const newPublicacion = await tx.publicacion.create({
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

                    await tx.marca.update({
                        where: { id: marca_seleccionada?.id },
                        data: { cantidad_publicaciones: { increment: 1 } },
                    })

                    return newPublicacion.id
                },
                {
                    maxWait: 10000,
                    timeout: 10000,
                },
            )

            newPublicacionId = result
        } catch (error) {
            console.error("Error creating publication:", error)
            return NextResponse.json(
                { error: true, message: "Error al crear la publicación. Intenta nuevamente." },
                { status: 500 },
            )
        }

        // Second step: Upload images sequentially instead of in parallel
        const uploadedPhotos: string[] = []
        let firstPhotoUrl: string | null = null

        for (let i = 0; i < photos.length; i++) {
            const photo = photos[i]
            try {
                const response = await uploadImage({
                    file: photo,
                    publicacionId: newPublicacionId,
                    tx: null, // No transaction here since we're outside the transaction
                })

                if (response.error) {
                    console.error(`Error uploading image ${i + 1}/${photos.length}:`, response.message)
                    continue // Continue with next photo instead of failing completely
                }

                if (response.url) {
                    uploadedPhotos.push(response.url)
                }

                // Save the first successful photo URL
                if (i === 0 && response.url) {
                    firstPhotoUrl = response.url
                }
            } catch (error) {
                console.error(`Error processing image ${i + 1}/${photos.length}:`, error)
                // Continue with next photo
            }
        }

        // If we have at least one successful photo, update the cover image
        if (firstPhotoUrl) {
            try {
                await prisma.publicacion.update({
                    where: { id: newPublicacionId },
                    data: { url_portada: firstPhotoUrl },
                })
            } catch (error) {
                console.error("Error updating cover image:", error)
                // Continue anyway since the publication is created
            }
        }

        // If no photos were uploaded successfully but we created the publication
        if (uploadedPhotos.length === 0) {
            return NextResponse.json({
                error: false,
                message:
                    "Vehículo publicado correctamente, pero hubo problemas al subir las imágenes. Puedes añadir imágenes más tarde.",
                data: newPublicacionId,
            })
        }

        return NextResponse.json({
            error: false,
            message:
                uploadedPhotos.length < photos.length
                    ? `Vehículo publicado correctamente con ${uploadedPhotos.length} de ${photos.length} imágenes.`
                    : "Vehículo publicado correctamente",
            data: newPublicacionId,
        })
    } catch (error) {
        console.error("Error in API route:", error)
        return NextResponse.json(
            {
                error: true,
                message: error instanceof Error ? error.message : "Error al publicar el vehículo. Porfavor, intenta nuevamente",
            },
            { status: 500 },
        )
    }
}
