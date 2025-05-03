import { filtros } from "@/types/filtros"



// Función para construir la consulta con filtros
export const get_query_filtros = (searchParams?: Record<string, any>, marcaId?: number | null) => {
  // Extraer y validar parámetros de paginación
  const page = searchParams?.page ? Number.parseInt(searchParams.page as string) : 1
  const pageSize = searchParams?.pageSize ? Number.parseInt(searchParams.pageSize as string) : 9

  // Calcular skip para paginación
  const skip = (page - 1) * pageSize

  // Construir objeto de filtros para Prisma
  const where: any = {vendido: false}

  if (!searchParams || Object.keys(searchParams).length === 0) {
    // Si no hay parámetros, devolver consulta sin filtros
    return { where, skip, take: pageSize }
  }

  // Filtrar solo los parámetros válidos (excluyendo parámetros de paginación)
  const validParams = Object.entries(searchParams)
    .filter(([key]) => filtros.includes(key) && !["page", "pageSize"].includes(key))
    .filter(([_, value]) => value !== undefined && value !== null && value !== "")

  if (validParams.length === 0) {
    return { where, skip, take: pageSize }
  }

  // Procesar cada filtro
  for (const [key, value] of validParams) {
    // Manejo especial para marca
    if (key === "marca") {
      if (marcaId) {
        where.id_marca = marcaId
      }
    } else {
      // Procesar otros filtros
      switch (key) {
        case "precio_min":
          where.precio = { ...where.precio, gte: Number(value) }
          break
        case "precio_max":
          where.precio = { ...where.precio, lte: Number(value) }
          break
        case "moneda":
          where.tipo_moneda = value
          break
        case "anio":
          where.anio = parseInt(value)
          break
        case "tipo_transmision":
          where.tipo_transmision = { contains: value, mode: "insensitive" }
          break
        case "tipo_combustible":
          where.tipo_combustible = { contains: value, mode: "insensitive" }
          break
        case "categoria":
          where.categoria = { contains: value, mode: "insensitive" }
          break
        case "ciudad":
          where.ciudad = { contains: value, mode: "insensitive" }
          break
        case "color":
          where.color = { contains: value, mode: "insensitive" }
          break
        case "q":
          where.OR = [
            { titulo: { contains: value, mode: "insensitive" } },
            { modelo: { contains: value, mode: "insensitive" } },
            { marca: { nombre: { contains: value, mode: "insensitive" } } },
            { descripcion: { contains: value, mode: "insensitive" } },
          ]
          break
        default:
          where[key] = value
          break
      }
    }
  }

  return { where, skip, take: pageSize }


}


// // Función para invalidar el caché cuando sea necesario
// export async function invalidatePublicacionesCache() {
//   // Esta función se puede llamar después de crear, actualizar o eliminar una publicación
//   // para invalidar el caché y asegurar que los datos estén actualizados
//   try {
//     await fetch("/api/revalidate?tag=publicaciones", { method: "POST" })
//     console.log("Caché de publicaciones invalidado")
//   } catch (error) {
//     console.error("Error al invalidar caché:", error)
//   }
// }

