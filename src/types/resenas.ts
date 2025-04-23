
export interface Resena {
  id: number
  comentario: string
  valoracion: number
  created_at?: Date
  id_cliente_votante: number
  id_cliente_valorado: number
  cliente_valoracion_id_cliente_votanteTocliente: {
    id: number
    nombre: string
    apellido: string
    profile_img_url: string
  }
}
