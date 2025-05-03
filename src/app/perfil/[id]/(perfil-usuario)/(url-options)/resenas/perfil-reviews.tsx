"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Resena } from "@/types/resenas"
import Link from "next/link"

interface PerfilReviewsProps{
  resenas:Resena[]
  calificacion:number
  numResenas:number
}

export function PerfilReviews({ resenas, calificacion, numResenas}: PerfilReviewsProps) {
 

  if (resenas.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 text-center">
        <h3 className="text-xl font-medium mb-2">No hay reseñas todavía</h3>
        <p className="text-muted-foreground mb-4">Este usuario aún no ha recibido reseñas</p>
      </div>
    )
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Reseñas recibidas</h2>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-5 w-5 ${
                  star <= Math.round(5) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{calificacion.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({numResenas.toFixed(0)} reseñas)</span>
        </div>
      </div>

      <div className="space-y-6">
        {resenas.map((resena) => (
          <div key={resena.id} className="bg-card rounded-lg border border-border p-4">
            <div className="flex justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                  {resena.cliente_valoracion_id_cliente_votanteTocliente.profile_img_url ? (
                    <Image
                      src={resena.cliente_valoracion_id_cliente_votanteTocliente.profile_img_url || "/placeholder.svg"}
                      alt={resena.cliente_valoracion_id_cliente_votanteTocliente.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                      {resena.cliente_valoracion_id_cliente_votanteTocliente.nombre.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <Link href={`/perfil/${resena.cliente_valoracion_id_cliente_votanteTocliente.id}`}>
                    <h4 className="font-medium">{resena.cliente_valoracion_id_cliente_votanteTocliente.nombre}</h4>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>{resena.created_at?.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= resena.valoracion ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
            </div>

            <p className="text-sm mb-3">{resena.comentario}</p>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ThumbsUp className="h-4 w-4 mr-1" />
                Útil
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                <ThumbsDown className="h-4 w-4 mr-1" />
                No útil
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-32" />
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-card rounded-lg border border-border p-4">
          <div className="flex justify-between mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />

          <div className="flex justify-end gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

