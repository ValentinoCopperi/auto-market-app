"use client"

import type React from "react"

import { useState, useRef, memo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { Form, FormField, FormMessage } from "@/components/ui/form"
import { CATEOGORIAS, COLORES, TRANSMISION, COMBUSTIBLE, TIPO_MONEDA, MARCAS, CIUDADES } from "@/types/filtros"
import { type PublicarFormValues, publicarFormSchema } from "@/types/publicar"
import { FormSections } from "./inputs/form-inputs"
import ImagenesInput from "./inputs/imagenes-inputs"
import { publicarVehiculo } from "@/actions/publicaciones-actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export const PublishDialog = memo(() => {
  const { isOpen, dialogType, closeDialog } = useDialogStore()
  const open = isOpen && dialogType === "publicar"
  const [photos, setPhotos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const form = useForm<PublicarFormValues>({
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
      photos: [],
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Validar tamaño de archivos
      const validFiles = newFiles.filter((file) => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`La imagen "${file.name}" excede el límite de 5MB`)
          return false
        }
        return true
      })

      // Limit to 10 photos total (o el límite que tengas)
      const updatedPhotos = [...photos, ...validFiles].slice(0, 10)
      setPhotos(updatedPhotos)

      // Update the form value
      form.setValue("photos", updatedPhotos)
    }
  }

  const handleAddPhotoClick = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (data: PublicarFormValues) => {
    setError(null)
    setLoading(true)

    // Validar que haya al menos una foto
    if (photos.length === 0) {
      setError("Debes subir al menos una foto")
      setLoading(false)
      return
    }

    // Validar tamaño de fotos nuevamente
    for (const photo of photos) {
      if (photo.size > 5 * 1024 * 1024) {
        setError("El tamaño de alguna foto excede el límite de 5MB")
        setLoading(false)
        return
      }
    }

    try {
      // Mostrar toast de inicio de proceso
      const toastId = toast.loading("Publicando vehículo...", {
        duration: 10000, // Duración larga para dar tiempo al proceso
      })

      // Ensure photos are included in the form data
      const formData = {
        ...data,
        photos: photos,
      }

      const response = await publicarVehiculo(formData)

      // Actualizar el toast según el resultado
      if (response.error) {
        toast.error(response.message, { id: toastId })
        setError(response.message)
      } else {
        toast.success(response.message, { id: toastId })
        setPhotos([])
        form.reset()
        closeDialog()

        // Mostrar un toast adicional sobre el procesamiento de imágenes
        if (photos.length > 1) {
          toast.info(
            "Las imágenes adicionales se están procesando en segundo plano y aparecerán pronto en tu publicación.",
            { duration: 8000 },
          )
        }

        router.push(`/publicaciones/${response.data}`)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
      setError(error instanceof Error ? error.message : "Error al publicar el vehículo")
      toast.error("Ocurrió un error al publicar el vehículo")
    } finally {
      setLoading(false)
    }
  }

  // Update photos in form when photos state changes
  const updateFormPhotos = (newPhotos: File[]) => {
    setPhotos(newPhotos)
    form.setValue("photos", newPhotos)
  }

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

            <FormField
              control={form.control}
              name="photos"
              render={({ field }) => (
                <div className="space-y-2">
                  <ImagenesInput
                    loading={loading}
                    photos={photos}
                    setPhotos={updateFormPhotos}
                    handleFileChange={handleFileChange}
                    handleAddPhotoClick={handleAddPhotoClick}
                    fileInputRef={fileInputRef}
                  />
                  <FormMessage />
                  {photos.length > 0 && <p className="text-sm text-muted-foreground">Fotos subidas: {photos.length}</p>}
                  {field.value.length === 0 && form.formState.isSubmitted && (
                    <p className="text-sm text-red-500">Debes subir al menos una foto</p>
                  )}
                </div>
              )}
            />

            {photos.length > 3 && (
              <Alert  className="bg-blue-50 border-blue-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Información importante</AlertTitle>
                <AlertDescription>
                  Has seleccionado {photos.length} imágenes. La primera imagen se procesará inmediatamente y será la
                  portada de tu publicación. Las imágenes adicionales se procesarán en segundo plano y aparecerán en tu
                  publicación en breve.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col md:flex-row justify-end gap-3 pt-2">
              {error && <p className="text-red-500">{error}</p>}
              <Button disabled={loading} type="button" variant="outline" onClick={closeDialog}>
                Cancelar
              </Button>
              <Button disabled={loading} type="submit" className="bg-blue-900 hover:bg-blue-800 text-white">
                {loading ? "Publicando..." : "Publicar Vehículo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})

