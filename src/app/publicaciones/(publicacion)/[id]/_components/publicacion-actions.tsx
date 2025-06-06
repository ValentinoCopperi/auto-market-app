"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DollarSign, Heart, Share2, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { agregarFavorito, eliminarFavorito } from "@/actions/favoritos-actions"
import { EditPublicationDialog } from "@/components/dialogs/editar-publicacion/editar-publicacion-dialog"
import { Publicacion } from "@/types/publicaciones"
import { MensajesProvider } from "@/hooks/use-mensajes"
import OfertaDialog from "./hacer-oferta-btn"
import { changeVendido } from "@/actions/publicaciones-actions"

interface PublicacionActionsProps {
  publicacion: Publicacion
  esFavorito: boolean
  esEditable: boolean
}

export function PublicacionActions({ publicacion, esFavorito, esEditable }: PublicacionActionsProps) {

  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isFavorito, setIsFavorito] = useState(esFavorito)
  const [loading, setLoading] = useState(false)
  const [showOfertaDialog, setShowOfertaDialog] = useState(false)
  const[isVendido, setIsVendido] = useState(publicacion.vendido)


  const addFavorito = async () => {
    setLoading(true)
    const response = await agregarFavorito(publicacion.id)
    if (response.error) {
      toast.error(response.message)
    } else {
      toast.success(response.message)
      setIsFavorito(true)
    }
    setLoading(false)
  }

  const removeFavorito = async () => {
    setLoading(true)
    const response = await eliminarFavorito(publicacion.id)
    if (response.error) {
      toast.error(response.message)
    } else {
      toast.success(response.message)
      setIsFavorito(false)
    }
    setLoading(false)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mira este vehículo en AutoMarket",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error al compartir:", error)
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success("Enlace copiado");
    }
  }


  const handleDelete = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/${publicacion.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.error) {
        toast.error(data.message)
      } else {
        toast.success("Publicación eliminada correctamente")
        router.push("/")
        router.refresh()
      }

    } catch (error) {
      console.error("Error al eliminar publicación:")
      toast.error("No se pudo eliminar la publicación. Intenta nuevamente.")

    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleVender = async () => {
    setLoading(true)
    const response = await changeVendido(publicacion.id,publicacion.cliente.id, !isVendido)
    if (response.error) {
      toast.error(response.message)
    } else {
      toast.success(response.message)
      setIsVendido(!isVendido)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-4">
        <h1 className="text-2xl font-bold mb-1">{publicacion.titulo}</h1>
        <h5 className="text-sm text-muted-foreground">{publicacion.modelo}</h5>
        <div className="mb-4 flex items-center gap-2">
          <p className="text-2xl font-bold text-blue-600">${publicacion.precio.toLocaleString()}</p>
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            {publicacion.tipo_moneda === "ARG" ? "ARS" : "USD"}
          </span>
        </div>

        <div className="space-y-3">
          {!esEditable ? (
            <>
              <Button onClick={() => setShowOfertaDialog(prev => !prev)} className="w-full bg-blue-900 hover:bg-blue-800 text-white">
                <DollarSign className="h-4 w-4 mr-2" />
                Hacer oferta
              </Button>
              {
                showOfertaDialog && (
                  <MensajesProvider>
                    <OfertaDialog precio_default={publicacion.precio} id_cliente_vendedor={publicacion.cliente.id} titulo={publicacion.titulo} open={showOfertaDialog} onClose={() => setShowOfertaDialog(false)}/>
                  </MensajesProvider>
                )
              }
              {/* <HacerOfertaBtn precio_default={publicacion.precio} id_cliente_vendedor={publicacion.cliente.id} titulo={publicacion.titulo} /> */}

              <div className="grid grid-cols-2 gap-3">
                {
                  isFavorito ? (
                    <Button disabled={loading} variant="outline" className={isFavorito ? "bg-primary/10" : ""} onClick={removeFavorito}>
                      <Heart className={`h-4 w-4 mr-2 ${isFavorito ? "fill-primary text-primary" : ""}`} />
                      {loading ? "Eliminando..." : "Eliminar"}
                    </Button>
                  ) : (
                    <Button disabled={loading} variant="outline" className={isFavorito ? "bg-primary/10" : ""} onClick={addFavorito}>
                      <Heart className={`h-4 w-4 mr-2 ${isFavorito ? "fill-primary text-primary" : ""}`} />
                      {loading ? "Guardando..." : "Guardar"}
                    </Button>
                  )
                }
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>


            </>
          ) : (
            <>

              <EditPublicationDialog publicacion={publicacion} />

              <Button disabled={isDeleting} variant="destructive" className="w-full cursor-pointer" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Button>

              <Button disabled={loading} variant="default" className="w-full cursor-pointer" onClick={handleVender}>
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading ? "Cambiando..." : isVendido ? "Sacar de vendidos" : "Agregar a vendidos"}
              </Button>

              <Button variant="outline" className="w-full cursor-pointer" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </>
          )}
        </div>
      </div>


      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La publicación será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

