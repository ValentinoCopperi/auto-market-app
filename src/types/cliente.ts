import { EstadoSuscripcion, Planes } from "./suscriciones"

export interface Cliente {
  id: number
  nombre: string
  apellido?: string
  email: string
  telefono: string
  ciudad: string
  tipo_cliente: 'empresa' | 'particular'
  bio: string
  profile_img_url: string
  banner_img_url: string
  admin: boolean
  descripcion: string
  suscripcion : {
    estado: EstadoSuscripcion
    tipo_suscripcion: Planes
  } | null
}

