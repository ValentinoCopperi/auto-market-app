"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronRight, Car, Star, Shield, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import SearchBar from "./search-bar"

// Imágenes de autos de alta calidad de Unsplash
const heroImages = [
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=2070",
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=2025",
]

// Características destacadas
const features = [
  {
    icon: <Car className="h-6 w-6" />,
    title: "Amplia selección",
    description: "Miles de vehículos verificados de todos los modelos y marcas disponibles.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Vendedores verificados",
    description: "Todos nuestros vendedores pasan por un riguroso proceso de verificación.",
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: "Experiencia premium",
    description: "Interfaz intuitiva y herramientas avanzadas para encontrar tu vehículo ideal.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Tendencias del mercado",
    description: "Accede a datos actualizados sobre precios y tendencias del mercado automotriz.",
  },
]

// Marcas populares
const popularBrands = [
  { name: "Toyota", count: 1243 },
  { name: "Volkswagen", count: 987 },
  { name: "Ford", count: 876 },
  { name: "Chevrolet", count: 765 },
  { name: "Honda", count: 654 },
  { name: "Nissan", count: 543 },
]

const LandingPage = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [searchFocused, setSearchFocused] = useState(false)
  const [query, setQuery] = useState("")
  const { user } = useAuth()
  const { openPublishDialog, openLoginDialog } = useDialogStore()
  const router = useRouter()
  const { theme } = useTheme()

  // Cambiar imagen de fondo automáticamente
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const handleOpenModal = () => {
    if (user) {
      openPublishDialog()
    } else {
      openLoginDialog()
    }
  }

  // Variantes de animación mejoradas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  }

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section con imagen de fondo */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imágenes de fondo con transición */}
        <div className="absolute inset-0 z-0 bg-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={heroImages[currentImageIndex] || "/placeholder.svg"}
                alt="Automóvil de lujo"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay más consistente y oscuro para mejor contraste */}
              <div className="absolute inset-0 bg-black/70 dark:bg-black/80 transition-opacity duration-500"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Contenido del hero */}
        <div className="container relative z-10 px-4 md:px-6 pb-16">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={childVariants} className="mb-2 mt-8">
              <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-primary/10  border border-primary/20 backdrop-blur-sm text-white dark:text-white">
                La plataforma líder en compra y venta de vehículos
              </span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight"
              variants={childVariants}
              style={{ textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Encuentra el{" "}
              <span
                className="text-white relative"
                style={{ textShadow: "0 0 8px rgba(255, 255, 255, 0.7), 0 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                vehículo perfecto
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 300 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C47.6667 3 154.8 -3.8 297 9"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              para tu estilo de vida
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl hidden md:block text-white/80 max-w-2xl mx-auto mb-8"
              variants={childVariants}
              style={{ textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)" }}
            >
              Explora nuestra amplia selección de vehículos verificados de vendedores confiables y encuentra el auto que
              se adapta perfectamente a tus necesidades.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row justify-center gap-4 mb-12" variants={childVariants}>
              <Link href="/publicaciones" className="cursor-pointer">
                <Button
                  size="lg"
                  className="hidden md:flex bg-blue-600 hover:bg-blue-600/90 text-white px-8 py-6 text-base font-medium"
                >
                  Explorar vehículos
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                    className="ml-2"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.div>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={handleOpenModal}
                className="border-white/20 text-black dark:text-white  px-8 py-6 text-base font-medium backdrop-blur-sm"
              >
                Vender mi auto
              </Button>
            </motion.div>

            {/* Buscador mejorado */}
            <SearchBar />

            {/* Indicadores de imagen */}
            <motion.div className="flex justify-center gap-2 mt-8" variants={childVariants}>
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    index === currentImageIndex ? "bg-primary w-8" : "bg-white/30 hover:bg-white/50",
                  )}
                  aria-label={`Ver imagen ${index + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Decoración de curva en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-14 md:h-24 z-10">
          <svg
            viewBox="0 0 1440 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 96L60 85.3C120 75 240 53 360 48C480 43 600 53 720 58.7C840 64 960 64 1080 56C1200 48 1320 32 1380 24L1440 16V96H1380C1320 96 1200 96 1080 96C960 96 840 96 720 96C600 96 480 96 360 96C240 96 120 96 60 96H0Z"
              fill="currentColor"
              className="text-background"
            />
          </svg>
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-20 container px-4 md:px-6">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-4" variants={childVariants}>
            ¿Por qué elegir CarMarket?
          </motion.h2>
          <motion.p className="text-lg text-muted-foreground max-w-2xl mx-auto" variants={childVariants}>
            Ofrecemos la mejor experiencia para comprar y vender vehículos con herramientas innovadoras y un proceso
            simplificado.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="bg-card hover:bg-card/80 border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={featureVariants}
            >
              <div className="bg-primary/10 text-primary p-3 rounded-lg inline-block mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 container px-4 md:px-6">
        <motion.div
          className="bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-primary/10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            ¿Listo para encontrar tu próximo vehículo?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Miles de opciones te esperan. Comienza tu búsqueda ahora y encuentra el vehículo que se adapta perfectamente
            a tu estilo de vida.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/publicaciones">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Explorar vehículos
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={handleOpenModal}>
              Publicar mi vehículo
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default LandingPage
