"use client"
import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Photo {
  id: number
  src: string
  alt: string
  caption?: string
}

const galleryPhotos: Photo[] = [
  {
    id: 1,
    src: "/esp-off-performance/toyota.jpg",
    alt: "t",
    caption: "Toyota Corolla XEI 2.0 16v CVT ",
  },
  {
    id: 2,
    src: "/esp-off-performance/bmw.jpg",
    alt: "BMW Esp Off Performance",
    caption: "BMW Ⓜ️135i F40 By Esp Off Performance",
  },
  {
    id: 3,
    src: "/esp-off-performance/camioneta.jpg",
    alt: "V8 4.0 TFSI S-tronic Quattro Stage 1",
    caption: "V8 4.0 TFSI S-tronic Quattro Stage 1",
  },
  {
    id: 4,
    src: "/esp-off-performance/bmw-rojo.jpg",
    alt: "BMW 240i G42 Stage 3",
    caption: "BMW Ⓜ️240i G42 Stage 3 👹",
  },
  {
    id: 5,
    src: "/esp-off-performance/vento.jpg",
    alt: "Volkswagen Vento GLI MK7.5 DSG 2024",
    caption: "Volkswagen Vento GLI MK7.5 DSG 2024",
  },
  {
    id: 6,
    src: "/esp-off-performance/golf.jpg",
    alt: "Volkswagen Golf GTI MK7 Stage 3 IS38 con 480🐴",
    caption: "Volkswagen Golf GTI MK7 Stage 3 IS38 con 480🐴",
  },
]

const PhotoGallery = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const navigatePhoto = (direction: number) => {
    if (!selectedPhoto) return

    const currentIndex = galleryPhotos.findIndex((photo) => photo.id === selectedPhoto.id)
    const newIndex = (currentIndex + direction + galleryPhotos.length) % galleryPhotos.length
    setSelectedPhoto(galleryPhotos[newIndex])
  }

  return (
    <section className="py-12 ">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold  mb-4">Nuestro Proceso de Inspección</h2>
          <p className="text-lg  max-w-3xl mx-auto">
            Documentamos cada paso de nuestro proceso de inspección para que puedas ver exactamente cómo evaluamos los
            vehículos. Nuestro enfoque meticuloso te asegura que no habrá sorpresas desagradables después de tu compra.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              className="relative group rounded-xl overflow-hidden shadow-md h-80"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-20">
                <p className="font-medium">{photo.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      
      </div>
    </section>
  )
}

export default PhotoGallery
