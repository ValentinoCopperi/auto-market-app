"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PublicacionImagen } from "@/types/publicaciones"


interface ImageCarouselProps {
  imagenes: PublicacionImagen[]
  titulo: string
}

export function ImageCarousel({ imagenes, titulo }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Si no hay imágenes, mostrar un placeholder
  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="relative w-full h-[400px] bg-muted rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No hay imágenes disponibles
        </div>
      </div>
    )
  }

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? imagenes.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === imagenes.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex)
  }

  return (
    <div className="relative w-full">
      {/* Imagen principal */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden bg-muted">
        <Image
          src={imagenes[currentIndex].url || "/placeholder.svg"}
          alt={`${titulo} - Imagen ${currentIndex + 1}`}
          fill
          className="object-contain"
          priority={currentIndex === 0}
        />

        {/* Botones de navegación */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
          onClick={goToPrevious}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Anterior</span>
        </Button>

        <Button
          variant="secondary"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-80 hover:opacity-100"
          onClick={goToNext}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Siguiente</span>
        </Button>

        {/* Contador de imágenes */}
        <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {imagenes.length}
        </div>
      </div>

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <div className="flex overflow-x-auto gap-2 mt-2 pb-2">
          {imagenes.map((imagen, index) => (
            <button
              key={imagen.id}
              onClick={() => goToSlide(index)}
              className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden transition-all ${
                currentIndex === index ? "ring-2 ring-primary" : "ring-1 ring-border opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={imagen.url || "/placeholder.svg"}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

