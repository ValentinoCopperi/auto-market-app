import { z } from "zod";

// Define the schema for validation
export const editarPublicacionSchema = z.object({
    titulo: z.string().min(1, "El título es requerido"),
    modelo: z.string().min(1, "El modelo es requerido"),
    anio: z.number().int().min(1900, "El año debe ser mayor a 1900").max(2030, "El año debe ser menor a 2030"),
    tipo_transmision: z.string().min(1, "El tipo de transmisión es requerido"),
    tipo_combustible: z.string().min(1, "El tipo de combustible es requerido"),
    kilometraje: z.number().int().min(0, "El kilometraje debe ser mayor o igual a 0"),
    precio: z.number().min(0.01, "El precio debe ser mayor a 0"),
    tipo_moneda: z.string().min(1, "El tipo de moneda es requerido"),
    categoria: z.string().min(1, "La categoría es requerida"),
    ciudad: z.string().min(1, "La ciudad es requerida"),
    color: z.string().min(1, "El color es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    url_portada: z.string().optional(),
    imagenes_a_eliminar: z.array(z.number()).optional(),
  })
  