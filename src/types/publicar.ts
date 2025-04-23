import { z } from "zod"

export const publicarFormSchema = z.object({
    titulo: z.string().min(1, "El título es requerido"),
    marca: z.string().min(1, "La marca es requerida"),
    modelo: z.string().min(1, "El modelo es requerido"),
    anio: z.coerce.number().min(1900, "El año debe ser mayor a 1900").max(2030, "El año debe ser menor a 2030"),
    tipo_transmision: z.string().min(1, "La transmisión es requerida"),
    tipo_combustible: z.string().min(1, "El combustible es requerido"),
    kilometraje: z.coerce.number().min(0, "El kilometraje debe ser mayor o igual a 0"),
    precio: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
    tipo_moneda: z.string().min(1, "La moneda es requerida"),
    categoria: z.string().min(1, "La categoría es requerida"),
    ciudad: z.string().min(1, "La ciudad es requerida"),
    color: z.string().min(1, "El color es requerido"),
    descripcion: z.string().min(1, "La descripción es requerida"),
    photos: z.array(z.instanceof(File)).min(1, "Debes subir al menos una foto"),
  })
  
export type PublicarFormValues = z.infer<typeof publicarFormSchema>
