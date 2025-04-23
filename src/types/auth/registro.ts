import { z } from "zod"

export const registroSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  apellido: z.string().optional(),
  email: z.string().email({ message: "El email no es válido" }),
  telefono: z.string().min(4, { message: "El teléfono debe tener al menos 4 caracteres" }),
  ciudad: z.string().min(1, { message: "La ciudad es requerida" }),
  tipo_cliente: z.enum(["personal", "empresa"]),
  contrasena: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
});

export type RegistroFormSchema = z.infer<typeof registroSchema>;

