"use client"

import type React from "react"
import { useState, useRef, memo, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Control, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { Form } from "@/components/ui/form"
import { CATEOGORIAS, COLORES, TRANSMISION, COMBUSTIBLE, TIPO_MONEDA, MARCAS, CIUDADES } from "@/types/filtros"
import { type PublicarFormSchemaValues, type PublicarFormValues, publicarFormSchema } from "@/types/publicar"
import { FormSections } from "./inputs/form-inputs"
import ImagenesInput from "./inputs/imagenes-inputs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { max_fotos, Planes } from "@/types/suscriciones"

export const PublishDialog = memo(() => {
  const { user } = useAuth()
  const { isOpen, dialogType, closeDialog } = useDialogStore()
  const open = isOpen && dialogType === "publicar"
  const [photos, setPhotos] = useState<File[]>([])
  const [photoError, setPhotoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()



  // Create form with validation (sin photos)
  const form = useForm<PublicarFormSchemaValues>({
    resolver: zodResolver(publicarFormSchema),
    defaultValues: {
      titulo: "",
      marca: "Toyota",
      modelo: "",
      anio: 2023,
      tipo_transmision: "Manual",
      tipo_combustible: "Gasolina",
      kilometraje: 0,
      precio: 0,
      tipo_moneda: "USD",
      categoria: "Automovil",
      ciudad: "",
      color: "Rojo",
      descripcion: "",
      // Ya no incluimos photos aquí
    },
    mode: "onChange", // Validar al cambiar para mostrar errores más rápido
  })

  // Get form state for error display
  const { formState } = form
  const { errors } = formState

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
      setPhotos([])
      setPhotoError(null)
      setError(null)
      setSuccess(null)
    }
  }, [open, form])
  console.log(user?.suscripcion)
  // Validar fotos cuando cambian
  useEffect(() => {
    if (photos.length === 0) {
      setPhotoError("Debes subir al menos una foto")
      return
    }
    if (user?.suscripcion) {
      if (photos.length > max_fotos[user.suscripcion]) {
        setPhotoError(`El limite de tu plan es de ${max_fotos[user.suscripcion]} fotos`)
      } else {
        setPhotoError(null)
      }
    } else {
      setPhotoError(null)
    }
  }, [photos])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (photos.length + e.target.files.length > max_fotos[user?.suscripcion as Planes]) {
        setPhotoError(`El limite de tu plan es de ${max_fotos[user?.suscripcion as Planes]} fotos`)
        return
      }
      const newFiles = Array.from(e.target.files)
      // Limit to 100 photos total
      const updatedPhotos = [...photos, ...newFiles].slice(0, max_fotos[user?.suscripcion as Planes])
      setPhotos(updatedPhotos)
    }
  }

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (formData: PublicarFormSchemaValues) => {
    try {
      setLoading(true)

      if (photos.length === 0) {
        setPhotoError("Debes subir al menos una foto")
        setLoading(false)
        return
      }


      //Numero random para la publicacion entre 1 y 300000
      // Create a new FormData instance
      const formDataToSend = new FormData()

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value))
      })

      formDataToSend.append("cantidad_fotos", photos.length.toString())

      // Send the request
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones`, {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Error al publicar el vehículo")
      }

      const result = await response.json()

      if (result.error) {
        throw new Error(result.message || "Error al publicar el vehículo")
      }

      const id_publicacion = result.data


     
      const uploadedImages = []
      for (const photo of photos) {
        const formData = new FormData()
        formData.append("file", photo)
        formData.append("publicacionId", id_publicacion.toString())
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/imagenes`, {
          method: "POST",
          body: formData,
        })
        if (!response.ok) {
          throw new Error("Error al subir imagenes. Intenta nuevamente.")
        }
        const result = await response.json()
        uploadedImages.push(result.url)
      }

      // Show success message
      toast.success(result.message || "Vehículo publicado correctamente")

      // Redirect to the publication page
      if (id_publicacion) {
        closeDialog()
        router.push(`/publicaciones/${id_publicacion}`)
        router.refresh()
      }
    } catch (error) {
      console.error("Error al publicar:", error)
      toast.error(error instanceof Error ? error.message : "Error al publicar el vehículo. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  // Debug form state
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("Form errors:", errors)
    }
  }, [errors])

  return (
    <Dialog open={open} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Publicar Vehículo</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Completa los detalles de tu vehículo</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormSections
              loading={loading}
              control={form.control}
              fieldConfig={{
                basicInfo: {
                  titulo: { label: "Título del anuncio", placeholder: "ej. Toyota Corolla 2020" },
                  marca: { label: "Marca", options: MARCAS },
                  modelo: { label: "Modelo", placeholder: "ej. Corolla" },
                },
                details: {
                  anio: { label: "Año", type: "number", min: 1900, max: 2030 },
                  tipo_transmision: { label: "Tipo Transmisión", options: TRANSMISION },
                },
                specs: {
                  kilometraje: { label: "Kilometraje", type: "number", min: 0, placeholder: "0" },
                  precio: { label: "Precio", type: "number", min: 0, placeholder: "0" },
                  tipo_moneda: { label: "Moneda", options: TIPO_MONEDA, width: "w-24" },
                },
                location: {
                  categoria: { label: "Categoria", options: CATEOGORIAS },
                  ciudad: { label: "Ciudad", placeholder: "Ciudad", options: CIUDADES },
                },
                appearance: {
                  color: { label: "Color", options: COLORES },
                  tipo_combustible: { label: "Tipo Combustible", options: COMBUSTIBLE },
                },
                description: {
                  descripcion: {
                    label: "Descripción",
                    type: "textarea",
                    placeholder: "Describe tu vehículo...",
                    rows: 5,
                  },
                },
              }}
            />

            {/* Componente de imágenes (ahora fuera del formulario) */}
            <div className="space-y-2">
              <ImagenesInput
                loading={loading}
                photos={photos}
                setPhotos={setPhotos}
                handleFileChange={handleFileChange}
                handleAddPhotoClick={handleAddPhotoClick}
                fileInputRef={fileInputRef}
                error={photoError}
              />
              {photos.length > 0 && <p className="text-sm text-muted-foreground">Fotos subidas: {photos.length}</p>}
            </div>

            {/* Display all form errors in a summary - always visible when there are errors */}
            {Object.keys(errors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm font-medium text-red-800 mb-1">Por favor corrige los siguientes errores:</p>
                <ul className="text-sm text-red-700 list-disc pl-5">
                  {Object.entries(errors).map(([key, error]) => (
                    <li key={key}>{`${key}: ${error?.message}`}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
              <Button disabled={loading} type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button disabled={loading || photos.length === 0 || photoError !== null} type="submit" className="bg-blue-900 hover:bg-blue-800 text-white">
                {loading ? "Publicando..." : "Publicar Vehículo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

export default PublishDialog
