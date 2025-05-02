import prisma from "@/lib/prisma";
import { getSession, isAuthenticated } from "@/lib/session/session";
import { get_query_filtros } from "@/lib/get_query_filtros";
import { supabase } from "@/lib/supabase";
import { publicarFormSchema } from "@/types/publicar";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

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
            // Convert numeric values
            if (key === "anio" || key === "kilometraje" || key === "precio") {
                formValues[key] = Number(value)
            } else {
                formValues[key] = value
            }
        })

        const cantidad_fotos = formData.get("cantidad_fotos") as string

        // // Extract photos
        // const photos_urls: string[] = []
        // for (let i = 0; i < 100; i++) {
        //     const photo = formData.get(`photo_${i}`) as string
        //     if (photo !== null) {
        //         photos_urls.push(photo)
        //     } else if (photo === null) {
        //         break
        //     }
        // }

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

        if (Number.parseInt(cantidad_fotos) > suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo) {
            return NextResponse.json(
                { error: true, message: "Pasaste el limite de fotos. Porfavor, actualiza tu plan" },
                { status: 403 },
            )
        }

        if (Number.parseInt(cantidad_fotos) === 0) {
            return NextResponse.json(
                { error: true, message: "Debes subir al menos una foto" },
                { status: 400 },
            )
        }


        // // Validate photos
        // if (photos_urls.length === 0) {
        //     return NextResponse.json({ error: true, message: "Debes subir al menos una foto" }, { status: 400 })
        // }

        // if (photos_urls.length > suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo) {
        //     return NextResponse.json(
        //         {
        //             error: true,
        //             message: `Limite de fotos de tu plan: ${suscripcion.tipo_suscripcion.max_publicaciones_por_vehiculo}. Porfavor, elimina algunas fotos y vuelve a intentarlo`,
        //         },
        //         { status: 400 },
        //     )
        // }

        // const id_publicacion = formData.get("id_publicacion") as string

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


        return NextResponse.json({
            error: false, message: "Publicación creada correctamente", data: newPublicacionId,}, { status: 200 })

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


// Interface for upload image data
interface UploadImageData {
    file: File
    publicacionId: number
    tx: any | null
}
async function uploadImage({ file, publicacionId, tx }: UploadImageData) {
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