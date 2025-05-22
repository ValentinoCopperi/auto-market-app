"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Instagram, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderBannerProps {
  instagram_url: string
}

// Imágenes de autos de Unsplash
const carImages = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
]

// Configuración por slug
const slugConfig = {
  motorpoint: {
    primaryColor: "from-red-800 to-red-950",
    accentColor: "text-red-200",
    buttonColor: "bg-red-600 hover:bg-red-700 text-white",
  },
  "dynaco-consulting": {
    primaryColor: "from-blue-800 to-blue-950",
    accentColor: "text-blue-200",
    buttonColor: "bg-blue-600 hover:bg-blue-700 text-white",
  },
  default: {
    primaryColor: "from-slate-800 to-slate-950",
    accentColor: "text-slate-200",
    buttonColor: "bg-slate-600 hover:bg-slate-700 text-white",
  },
}

// Títulos para cada imagen
const slideTitles = [
  {
    heading: "Junto a expertos del mundo automotor, aceleramos el cambio.",
    subheading: "Impulsamos Juntos",
  },
  {
    heading: "Descubre los mejores vehículos para cada estilo de vida.",
    subheading: "Experiencia Premium",
  },
  {
    heading: "Conectamos pasión y tecnología en cada kilómetro.",
    subheading: "Innovación Constante",
  },
]

const HeaderBanner = ({ instagram_url }: HeaderBannerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [direction, setDirection] = useState(0)
  const [slug, setSlug] = useState("default")

  // Detectar el slug actual desde la URL
  useEffect(() => {
    const path = window.location.pathname
    const currentSlug = path.split("/").pop() || "default"
    setSlug(currentSlug)
  }, [])

  // Obtener configuración basada en el slug
  const config = slugConfig[slug as keyof typeof slugConfig] || slugConfig.default

  // Función para cambiar al siguiente slide
  const nextSlide = useCallback(() => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carImages.length)
  }, [])

  // Función para cambiar al slide anterior
  const prevSlide = useCallback(() => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carImages.length) % carImages.length)
  }, [])

  // Auto-reproducción del slider
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextSlide()
      }, 6000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, nextSlide])

  // Pausar auto-reproducción al hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Variantes de animación para el slider
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeIn",
      },
    }),
  }

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-r ${config.primaryColor} text-white`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container relative mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Contenido de texto */}
          <div className="z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className={`text-lg font-light mb-2 ${config.accentColor}`}>
                  {slideTitles[currentIndex].subheading}
                </h3>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  {slideTitles[currentIndex].heading}
                </h1>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 items-center">
              <Button
                className={`mt-4 shadow-lg transition-all duration-300 ${config.buttonColor}`}
                size="lg"
                onClick={() => window.open(instagram_url, "_blank")}
              >
                <Instagram className="h-5 w-5 mr-2" />
                Síguenos en Instagram
              </Button>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/20 bg-white/10 hover:bg-white/20 text-white"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Slider de imágenes */}
          <div className="relative h-64 md:h-96 overflow-hidden rounded-xl shadow-xl hidden md:block">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <Image
                  src={carImages[currentIndex] || "/placeholder.svg"}
                  alt={`Automóvil de lujo ${currentIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </motion.div>
            </AnimatePresence>

            {/* Indicadores de slide */}
            <div className="absolute bottom-4 left-0 right-0  justify-center gap-2 z-10 hidden md:flex">
              {carImages.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "w-8 bg-white" : "w-4 bg-white/40"
                  }`}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  aria-label={`Ver slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeaderBanner
