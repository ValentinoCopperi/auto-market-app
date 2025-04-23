import { z } from "zod"

export const editarPerfilSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es requerido" }),
  apellido: z.string().optional(),
  telefono: z.string({message: "El teléfono debe ser un número"}).min(4, { message: "El teléfono debe tener al menos 4 caracteres" }),
  ciudad: z.string().min(1, { message: "La ciudad es requerida" }),
  descripcion: z.string().optional(),
})

export type EditarPerfilFormSchema = z.infer<typeof editarPerfilSchema>