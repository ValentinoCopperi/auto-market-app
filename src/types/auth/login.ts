import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email({ message: "El email no es válido" }),
  contrasena: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }),
})

export type LoginFormSchema = z.infer<typeof loginSchema>
