import { getResenasByUsuario } from '@/actions/resenas-actions'
import { notFound } from 'next/navigation'
import React from 'react'
import { PerfilReviews } from './perfil-reviews'

const PerfilResenasPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  if (!id) {
    notFound()
  }

  const resenas = await getResenasByUsuario(Number(id))
  const calificacion = !resenas || resenas.length === 0 ? 0 : resenas.reduce((acc, resena) => acc + resena.valoracion, 0) / resenas.length;
  return (
    <PerfilReviews
      calificacion={calificacion}
      numResenas={resenas.length}
      resenas={resenas}
    />
  )
}

export default PerfilResenasPage