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
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1920&auto=format&fit=crop",
]

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
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ease curve
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  // Indicador de progreso animado
  const progressVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 6,
        ease: "linear",
        repeat: isAutoPlaying ? 0 : 0,
      },
    },
    reset: {
      width: "0%",
      transition: {
        duration: 0,
      },
    },
  }

  return (
    <section
      className="relative overflow-hidden bg-gradient-to-r from-blue-800 to-blue-950 text-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Fondo con patrón mejorado */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      {/* Elementos decorativos animados */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-20 right-10 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -30, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute bottom-10 left-1/3 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Contenido de texto */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h3
                  className="text-lg font-light mb-2 text-blue-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {slideTitles[currentIndex].subheading}
                </motion.h3>

                <motion.h1
                  className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  {slideTitles[currentIndex].heading.split(" ").map((word, i) =>
                    i % 5 === 3 ? (
                      <span key={i} className="text-white bg-black/20 px-2 py-1 rounded-md shadow-inner mx-1">
                        {word}
                      </span>
                    ) : (
                      <span key={i}>{word} </span>
                    ),
                  )}
                </motion.h1>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-wrap gap-4 items-center"
            >
              <Button
                className="mt-4 bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 group"
                size="lg"
                onClick={() => window.open(instagram_url, "_blank")}
              >
                <Instagram className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Síguenos en Instagram
              </Button>

              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                  onClick={prevSlide}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
                  onClick={nextSlide}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Slider de imágenes */}
          <div className="relative h-64 md:h-96 overflow-hidden rounded-xl">
            {/* Sombra decorativa */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transform -translate-y-4 translate-x-4"></div>

            {/* Contenedor del slider */}
            <div className="relative h-full rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </motion.div>
              </AnimatePresence>

              {/* Indicadores de slide */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                {carImages.map((_, index) => (
                  <div
                    key={index}
                    className={`relative h-1 rounded-full overflow-hidden ${
                      index === currentIndex ? "w-8 bg-white/30" : "w-4 bg-white/20"
                    } cursor-pointer transition-all duration-300`}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1)
                      setCurrentIndex(index)
                    }}
                  >
                    {index === currentIndex && isAutoPlaying && (
                      <motion.div
                        className="absolute inset-0 bg-white"
                        variants={progressVariants}
                        initial="initial"
                        animate="animate"
                        key={`progress-${currentIndex}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Efecto de onda en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 left-0 w-full h-full transform rotate-180"
          fill="currentColor"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="text-background"
          ></path>
        </svg>
      </div>
    </section>
  )
}

export default HeaderBanner
