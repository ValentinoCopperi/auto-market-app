import { z } from "zod";

export const contactFormSchema = z.object({
    nombre: z.string().min(2, { message: 'El nombre es requerido y debe tener al menos 2 caracteres.' }).max(50, { message: 'El nombre es demasiado largo.' }),
    apellido: z.string().min(2, { message: 'El apellido es requerido y debe tener al menos 2 caracteres.' }).max(50, { message: 'El apellido es demasiado largo.' }),
    email: z.string().email({ message: 'Debe ser un email válido.' }),
    asunto: z.string().min(3, { message: 'El asunto es requerido y debe tener al menos 3 caracteres.' }).max(100, { message: 'El asunto es demasiado largo.' }),
    mensaje: z.string().min(10, { message: 'El mensaje es requerido y debe tener al menos 10 caracteres.' }).max(1000, { message: 'El mensaje es demasiado largo.' }),
  });