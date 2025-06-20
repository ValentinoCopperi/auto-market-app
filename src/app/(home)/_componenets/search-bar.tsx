"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, ArrowDown, ArrowUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Suggestion {
  id: string
  titulo: string
}

// Función para obtener sugerencias de la base de datos
async function getSuggestions(query: string): Promise<Suggestion[]> {
  if (!query || query.length < 2) return []

  try {
    // Aquí deberías hacer una llamada a tu API o usar una Server Action
    // para obtener las sugerencias desde la base de datos
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/sugerencias/buscador?query=${encodeURIComponent(query)}`,
    )
    const data = await response.json()
    return data.suggestions || []
  } catch (error) {
    console.error("Error al obtener sugerencias:")
    return []
  }
}

const busquedas_populares = [
  { title: "Autos menos de US$13.000", link: "/publicaciones?categoria=automovil&precio_max=13000&moneda=USD" },
  { title: "Amarok 2024", link: "/publicaciones?q=amarok&anio=2024" },
  { title: "Ford Ranger 2024", link: "/publicaciones?q=amarok&anio=2024" },
  { title: "Volkswagen Gol", link: "/publicaciones?marca=volkswagen&q=gol" },
  { title: "Fiat Cronos", link: "/publicaciones?marca=fiat&q=cronos" },
  { title: "Renault Sandero", link: "/publicaciones?marca=renault&q=sandero" },
]

// Array de colores para los badges
const badgeColors = [
  "bg-blue-100 text-blue-800 hover:bg-blue-200",
  "bg-green-100 text-green-800 hover:bg-green-200",
  "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "bg-amber-100 text-amber-800 hover:bg-amber-200",
  "bg-rose-100 text-rose-800 hover:bg-rose-200",
  "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
]

export default function SearchWithSuggestions() {
  const [query, setQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const router = useRouter()
  const [verBusquedasPopulares, setVerBusquedasPopulares] = useState(false)

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const popularSearchesVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 15 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      transition: { duration: 0.2 },
    },
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setSelectedSuggestionIndex(-1)

    if (value.length >= 2) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSearchSubmit = () => {
    if (query.trim().length > 0) {
      router.push(`/publicaciones?q=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setQuery(suggestion.titulo)
    setShowSuggestions(false)
    // Redirigir a la publicación específica usando el ID
    router.push(`/publicaciones/${suggestion.id}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (showSuggestions && suggestions.length > 0 && selectedSuggestionIndex >= 0) {
        e.preventDefault()
        const selectedSuggestion = suggestions[selectedSuggestionIndex]
        setQuery(selectedSuggestion.titulo)
        setShowSuggestions(false)
        router.push(`/publicaciones/${selectedSuggestion.id}`)
      } else if (query.trim().length > 0) {
        e.preventDefault()
        handleSearchSubmit()
      }
    } else if (!showSuggestions || suggestions.length === 0) {
      return
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const togglePopularSearches = () => {
    setVerBusquedasPopulares((prev) => !prev)
  }

  // Efecto para obtener sugerencias cuando cambia la consulta
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        setLoadingSuggestions(true)
        try {
          const results = await getSuggestions(query)
          setSuggestions(results)
        } catch (error) {
          console.error("Error al obtener sugerencias:", error)
          setSuggestions([])
        } finally {
          setLoadingSuggestions(false)
        }
      } else {
        setSuggestions([])
      }
    }

    const timeoutId = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <motion.div
      className="max-w-3xl mx-auto relative z-10"
      variants={childVariants}
      animate={searchFocused ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-background/80 dark:bg-background/70 backdrop-blur-md rounded-xl shadow-2xl border border-border/50 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Buscar por marca, modelo o año..."
              className="pl-10 py-6 w-full bg-transparent text-foreground"
              value={query}
              onChange={handleSearch}
              onFocus={() => {
                setSearchFocused(true)
                if (query.length >= 2) setShowSuggestions(true)
              }}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={handleKeyDown}
            />
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"
              animate={searchFocused ? { scale: 1.2, color: "#3b82f6" } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search />
            </motion.div>

            {/* Dropdown de sugerencias */}
            <AnimatePresence>
              {showSuggestions && query.length >= 2 && (
                <motion.div
                  ref={suggestionsRef}
                  className="absolute left-0 right-0 mt-1 bg-background border border-border/50 rounded-lg shadow-lg overflow-hidden z-20"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="max-h-60 overflow-y-auto py-1">
                    {loadingSuggestions ? (
                      <div className="px-4 py-3 text-center text-muted-foreground">
                        <div className="flex items-center justify-center">
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                          Buscando...
                        </div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.id}
                          className={`px-4 py-2 cursor-pointer hover:bg-muted/50 ${selectedSuggestionIndex === index ? "bg-muted" : ""
                            }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                          transition={{ duration: 0.1 }}
                        >
                          <div className="flex items-center">
                            <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                            <HighlightMatch text={suggestion.titulo} query={query} />
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center text-muted-foreground">No se encontraron resultados</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleSearchSubmit}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Link href={"/publicaciones"} className="cursor-pointer">
              <Button variant="outline" size="lg" className="border-border text-foreground">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-3">
          <Button
            variant="link"
            onClick={togglePopularSearches}
            className={`transition-colors flex items-center gap-1 p-0 ${verBusquedasPopulares ? "text-primary font-medium" : "text-muted-foreground"
              }`}
          >
            <span>Ver Búsquedas Populares</span>
            <motion.span
              initial={false}
              animate={{ rotate: verBusquedasPopulares ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              {verBusquedasPopulares ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            </motion.span>
          </Button>
        </div>

        <AnimatePresence>
          {verBusquedasPopulares && (
            <motion.div
              className="mt-3 overflow-hidden"
              variants={popularSearchesVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex flex-wrap gap-2 py-2">
                {busquedas_populares.map((busqueda, index) => (
                  <motion.div key={index} variants={badgeVariants} className="inline-block">
                    <Link href={busqueda.link}>
                      <Badge
                        className={`cursor-pointer px-3 py-1.5 text-sm font-medium transition-all hover:shadow-md ${badgeColors[index % badgeColors.length]}`}
                        variant="outline"
                      >
                        {busqueda.title}
                      </Badge>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// Componente para resaltar la parte de la consulta en las sugerencias
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || query.length < 2) return <span>{text}</span>

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <span key={i} className="font-medium text-primary">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  )
}
