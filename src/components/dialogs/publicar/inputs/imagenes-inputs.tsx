"use client"

import type React from "react"
import { useState } from "react"
import { X, Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { compressImage } from "@/lib/images/imagenes-comprension"
import { toast } from "sonner"

interface ImagenesInputProps {
  photos: File[]
  setPhotos: (photos: File[]) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddPhotoClick: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  loading: boolean
  error?: string | null // Add error prop to display validation errors
}

const ImagenesInput = ({
  photos,
  loading,
  setPhotos,
  handleFileChange,
  handleAddPhotoClick,
  fileInputRef,
  error,
}: ImagenesInputProps) => {
  const [compressingImages, setCompressingImages] = useState<boolean>(false)
  const [compressionProgress, setCompressionProgress] = useState<number>(0)
  const [compressionError, setCompressionError] = useState<string | null>(null)

  // Reemplazamos el handleFileChange original con uno que comprima las imágenes
  const handleFileChangeWithCompression = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompressionError(null)
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)

      // Verificar tamaño antes de comprimir
      for (const file of newFiles) {
        if (file.size > 1024 * 1024 * 15) {
          setCompressionError(
            "Algunas imágenes son demasiado grandes (>15MB). Por favor, selecciona imágenes más pequeñas.",
          )
          return
        }
      }

      setCompressingImages(true)
      setCompressionProgress(0)

      try {
        const compressedFiles: File[] = []

        // Comprimir cada imagen una por una y actualizar el progreso
        for (let i = 0; i < newFiles.length; i++) {
          try {
            const compressedFile = await compressImage(newFiles[i], {
              maxSizeMB: 1, // Comprimir a máximo 1MB
              maxWidthOrHeight: 1920, // Limitar dimensiones máximas
              initialQuality: 0.8, // Calidad inicial
            })

            compressedFiles.push(compressedFile)
            setCompressionProgress(Math.round(((i + 1) / newFiles.length) * 100))
          } catch (err) {
            // Manejar error individual de compresión
            const errorMessage = err instanceof Error ? err.message : `Error al comprimir la imagen ${i + 1}`
            toast.error(errorMessage)
            // Continuamos con las siguientes imágenes
          }
        }

        if (compressedFiles.length > 0) {
          // Limit to 100 photos total
          const updatedPhotos = [...photos, ...compressedFiles].slice(0, 100)

          // Llamar a la función setPhotos del padre que actualiza el estado y el formulario
          setPhotos(updatedPhotos)

          if (compressedFiles.length < newFiles.length) {
            toast.warning(`Se comprimieron ${compressedFiles.length} de ${newFiles.length} imágenes.`)
          } else {
            toast.success(`Se comprimieron ${compressedFiles.length} imágenes correctamente.`)
          }
        } else {
          setCompressionError("No se pudo comprimir ninguna imagen. Por favor, intenta con otras imágenes.")
        }
      } catch (error) {
        console.error("Error al comprimir imágenes:", error)
        setCompressionError(
          error instanceof Error ? error.message : "Error al comprimir las imágenes. Por favor, inténtalo de nuevo.",
        )
      } finally {
        setCompressingImages(false)
        setCompressionProgress(0)
        // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
        if (e.target) e.target.value = ""
      }
    }
  }

  return (
    <>
      <label className="text-sm font-medium flex items-center">
        Fotos <span className="text-red-500 ml-1">*</span>
      </label>
      <div
        className={`border border-dashed ${error ? "border-red-500" : "border-border"} rounded-md p-4 ${error ? "bg-red-50" : ""}`}
      >
        <input
          disabled={loading || compressingImages}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChangeWithCompression}
          accept="image/*"
          multiple
          className="hidden"
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square bg-muted rounded-md relative overflow-hidden">
              <img
                src={URL.createObjectURL(photo) || "/placeholder.svg"}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Tamaño de la imagen en megabytes */}
              <p className="absolute bottom-0 left-0 text-xs bg-black/50 text-white p-1 rounded-tr">
                {(photo.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
                disabled={loading || compressingImages}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPhotoClick}
            disabled={loading || compressingImages}
            className="aspect-square flex flex-col items-center justify-center border border-dashed border-border rounded-md hover:bg-muted/50 transition-colors disabled:opacity-50"
          >
            {compressingImages ? (
              <>
                <Loader2 className="h-8 w-8 text-muted-foreground mb-2 animate-spin" />
                <span className="text-xs text-muted-foreground">Comprimiendo... {compressionProgress}%</span>
              </>
            ) : (
              <>
                <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Agregar Foto</span>
              </>
            )}
          </button>
        </div>

        {compressingImages && (
          <div className="w-full bg-muted rounded-full h-2.5 mb-3">
            <div
              className="bg-blue-900 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${compressionProgress}%` }}
            ></div>
          </div>
        )}

        {/* Display compression error */}
        {compressionError && <p className="text-red-500 text-sm mb-2">{compressionError}</p>}

        {/* Display form validation error */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <p className="text-xs text-muted-foreground">* El limite de imagenes depende del plan que tengas contratado</p>
        <p className="text-xs text-muted-foreground">
          * Podrias cambiar la portada de tu publicación en el apartado de editar publicación, una vez publicada
        </p>
        <p className="text-xs text-muted-foreground">
          * Las imágenes se comprimen automáticamente para optimizar la carga
        </p>
      </div>
    </>
  )
}

export default ImagenesInput
