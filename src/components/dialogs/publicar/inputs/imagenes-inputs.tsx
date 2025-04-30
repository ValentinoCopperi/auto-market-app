"use client"

import type React from "react"

import { X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImagenesInputProps {
  photos: File[]
  setPhotos: (photos: File[]) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleAddPhotoClick: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  loading: boolean
}

const ImagenesInput = ({
  photos,
  loading,
  setPhotos,
  handleFileChange,
  handleAddPhotoClick,
  fileInputRef,
}: ImagenesInputProps) => {
  return (
    <>
      <label className="text-sm font-medium flex items-center">
        Fotos <span className="text-red-500 ml-1">*</span>
      </label>
      <div className="border border-dashed border-border rounded-md p-4">
        <input
          disabled={loading}
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          className="hidden"
          required={photos.length === 0}
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
          {photos.map((photo, index) => (
            <div key={index} className="aspect-square bg-muted rounded-md relative overflow-hidden">
              <img
                src={URL.createObjectURL(photo) || "/placeholder.svg"}
                alt={`Foto ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => setPhotos(photos.filter((_, i) => i !== index))}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {photos.length < 10 && (
            <button
              type="button"
              onClick={handleAddPhotoClick}
              className="aspect-square flex flex-col items-center justify-center border border-dashed border-border rounded-md hover:bg-muted/50 transition-colors"
            >
              <Camera className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-xs text-muted-foreground">Agregar Foto</span>
            </button>
          )}
        </div>


        <p className="text-xs text-muted-foreground">* El limite de imagenes depende del plan que tengas contratado</p>
        <p className="text-xs text-muted-foreground">* Podrias cambiar la portada de tu publicación en el apartado de editar publicación, una vez publicada</p>
      </div>
    </>
  )
}

export default ImagenesInput
