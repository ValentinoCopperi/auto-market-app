import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getSession, isAuthenticated } from "@/lib/session/session";
import { get_query_filtros } from "@/lib/get_query_filtros";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {

    if (!isAuthenticated()) {
        return NextResponse.json({ error: true, message: "No estás autenticado" }, { status: 401 });
    }


    const formData = await request.formData()
    const titulo = formData.get("titulo") as string
    const modelo = formData.get("modelo") as string
    const ciudad = formData.get("ciudad") as string
    const color = formData.get("color") as string
    const descripcion = formData.get("descripcion") as string
    const tipo_transmision = formData.get("tipo_transmision") as string
    const tipo_combustible = formData.get("tipo_combustible") as string
    const tipo_moneda = formData.get("tipo_moneda") as string
    const categoria = formData.get("categoria") as string
    const marca = formData.get("marca") as string
    const anio = formData.get("anio") as string
    const kilometraje = formData.get("kilometraje") as string
    const precio = formData.get("precio") as string
    const photos = formData.getAll("photo-") as File[]

    const tituloFormatted = titulo.toLocaleLowerCase()
    const modeloFormatted = modelo.toLocaleLowerCase()
    const ciudadFormatted = ciudad.toLocaleLowerCase()
    const colorFormatted = color.toLocaleLowerCase()
    const descripcionFormatted = descripcion.toLocaleLowerCase()
    const tipo_transmisionFormatted = tipo_transmision.toLocaleLowerCase()
    const tipo_combustibleFormatted = tipo_combustible.toLocaleLowerCase()
    const tipo_monedaFormatted = tipo_moneda.toLocaleLowerCase()
    const categoriaFormatted = categoria.toLocaleLowerCase()
    const marcaFormatted = marca.toLocaleLowerCase()
    const anioFormatted = parseInt(anio)
    const kilometrajeFormatted = parseInt(kilometraje)
    const precioFormatted = parseFloat(precio)

    console.log(tituloFormatted, modeloFormatted, anioFormatted, tipo_transmisionFormatted, tipo_combustibleFormatted, precioFormatted, tipo_monedaFormatted, categoriaFormatted, ciudadFormatted, colorFormatted, descripcionFormatted, photos)

    return NextResponse.json({ error: true, message: "Error al crear la publicación" }, { status: 500 });

    try {


        if (!tituloFormatted || !modeloFormatted || !anioFormatted || !tipo_transmisionFormatted || !tipo_combustibleFormatted || !precio || !tipo_monedaFormatted || !categoriaFormatted || !ciudadFormatted || !colorFormatted || !descripcionFormatted || !photos) {
            return NextResponse.json({ error: true, message: "Todos los campos son requeridos" }, { status: 400 });
        }

        if (isNaN(anioFormatted) || isNaN(precioFormatted)) {
            return NextResponse.json({ error: true, message: "Año, kilometraje y precio deben ser numéricos" }, { status: 400 });
        }

        if (precio <= 0 || anio <= 0) {
            return NextResponse.json({ error: true, message: "El precio, kilometraje y año deben ser mayores a 0" }, { status: 400 });
        }


        const session = await getSession()
        const id_cliente = session?.userId

        if (!id_cliente) {
            return NextResponse.json({ error: true, message: "No se encontro el cliente" }, { status: 400 });
        }

        const marca_seleccionada = await prisma.marca.findFirst({
            where: {
                nombre: marcaFormatted,
            }
        })

        if (!marca_seleccionada) {
            return NextResponse.json({ error: true, message: "No se encontro la marca" }, { status: 400 });
        }

        const newPublicacion = await prisma.publicacion.create({
            data: {
                titulo: tituloFormatted,
                modelo: modeloFormatted,
                anio: anioFormatted,
                tipo_transmision: tipo_transmisionFormatted,
                tipo_combustible: tipo_combustibleFormatted,
                kilometraje: kilometrajeFormatted,
                precio: precioFormatted,
                tipo_moneda: tipo_monedaFormatted,
                categoria: categoriaFormatted,
                ciudad: ciudadFormatted,
                color: colorFormatted,
                descripcion: descripcionFormatted,
                id_cliente: parseInt(id_cliente),
                id_marca: marca_seleccionada.id,
            }
        })

        const uploadPromises = photos.map(async (file:File) => {
            const fileExt = file.type.split("/")[1]
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
            const filePath = `publicaciones/${newPublicacion.id}/${fileName}`

            
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

            return publicUrl
        })

        const uploadedPhotos = await Promise.all(uploadPromises)

        const publicacion_imagenes = uploadedPhotos.map((photo) => {
            return {
                url: photo,
                publicacion_id: newPublicacion.id,
            }
        })

        await prisma.publicacion_imagenes.createMany({
            data: publicacion_imagenes,
        })


        await prisma.marca.update({
            where: { id: marca_seleccionada.id },
            data: { cantidad_publicaciones: { increment: 1 } }
        })

        return NextResponse.json({ data: newPublicacion, error: false, message: "Publicación creada correctamente" }, { status: 200 });

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: true, message: "Error al crear la publicación" }, { status: 500 });
    }

}

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
