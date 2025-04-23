"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"
import { motion } from "framer-motion"

interface HeaderBannerProps {
  image: string
  instagram_url: string
}

const HeaderBanner = ({ image, instagram_url }: HeaderBannerProps) => {
  

 

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 text-white">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 dark:to-black/40"></div>

      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h3
              className="text-lg font-light mb-2 text-blue-100 dark:text-blue-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Impulsamos Juntos
            </motion.h3>

            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Junto a expertos del mundo automotor,{" "}
              <span className="text-white dark:text-blue-200 bg-black/20 dark:bg-white/10 px-2 py-1 rounded-md shadow-inner">
                aceleramos
              </span>{" "}
              <br className="hidden md:block" />
              el cambio.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Button
                className="mt-4 bg-white text-blue-700 hover:bg-blue-50 dark:bg-blue-950 dark:text-blue-200 dark:hover:bg-blue-900 
                shadow-lg hover:shadow-xl transition-all duration-300 group"
                size="lg"
                onClick={() => window.open(instagram_url, "_blank")}
              >
                <Instagram className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Síguenos en Instagram
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative h-64 md:h-96"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl transform -translate-y-4 translate-x-4 dark:from-blue-400/10 dark:to-purple-400/10"></div>
            <div className="relative h-full rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <Image
                src={image || "/placeholder.svg"}
                alt="MotorPoint - Coche en carretera al atardecer"
                fill
                className="object-cover rounded-lg transition-transform duration-700 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-400/10 dark:bg-blue-300/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      ></motion.div>

      <motion.div
        className="absolute -top-20 -left-20 w-60 h-60 bg-blue-300/10 dark:bg-blue-200/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      ></motion.div>
    </section>
  )
}

export default HeaderBanner
