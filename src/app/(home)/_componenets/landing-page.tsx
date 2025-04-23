"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import { motion } from "framer-motion"

const LandingPage = () => {
  // Variantes para el contenedor principal
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 50
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96], // Curva de easing personalizada
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  // Variantes para los elementos hijos
  const childVariants = {
    hidden: { 
      opacity: 0,
      y: 20 
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  // Variante para la imagen
  const imageVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.1 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }} // Solo anima al entrar en vista una vez
    >
      <motion.section 
        className="px-4 py-12 text-center"
        variants={childVariants}
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          variants={childVariants}
        >
          Encuentra tu Vehículo Perfecto
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8"
          variants={childVariants}
        >
          Explora miles de autos de vendedores verificados y encuentra el vehículo ideal para ti
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          variants={childVariants}
        >
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-6"
          >
            Empezar a Buscar
            <motion.span 
              className="ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              →
            </motion.span>
          </Button>
          <Button 
            variant="outline" 
            className="border-border text-foreground px-6 py-6"
          >
            Vender mi Auto
          </Button>
        </motion.div>
      </motion.section>

      <motion.div 
        className="relative w-full h-[300px] md:h-[400px] mb-8 px-4 md:px-12"
        variants={imageVariants}
      >
        <div className="mx-auto relative h-full overflow-hidden rounded-xl">
          <Image
            src="https://images.unsplash.com/photo-1567359632181-f06fa0dd1e73"
            alt="Cars showcase"
            fill
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      <motion.div 
        className="px-4 mb-16"
        variants={childVariants}
      >
        <div className="mx-auto bg-card rounded-lg shadow-sm border border-border p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="Buscar por marca, modelo o año..." 
                className="pl-10 py-6 w-full" 
              />
              <motion.div
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Search />
              </motion.div>
            </div>
            <div className="flex gap-2">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline" 
                className="border-border text-foreground"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;