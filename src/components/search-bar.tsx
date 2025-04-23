"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  className?: string
  baseUrl?: string
}

export function SearchBar({ placeholder = "Buscar...", className, baseUrl }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()


  // Obtener el término de búsqueda actual de los parámetros de URL
  const currentQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(currentQuery)

  // Manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    startTransition(() => {
      // Construir la nueva URL con el término de búsqueda
      const params = new URLSearchParams(searchParams.toString())

      if (query) {
        params.set("q", query)
      } else {
        params.delete("q")
      }

      // Resetear a la primera página cuando se busca
      params.delete("page")

      // Navegar a la URL con los parámetros actualizados
      const url = baseUrl ? `${baseUrl}?${params.toString()}` : `?${params.toString()}`

      router.push(url)
    })
  }

  // Limpiar la búsqueda
  const handleClear = () => {
    setQuery("")

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("q")
      params.delete("page")

      const url = baseUrl ? `${baseUrl}?${params.toString()}` : `?${params.toString()}`

      router.push(url)
    })
  }

  return (
    <form onSubmit={handleSearch} className={cn("relative flex items-center", className)}>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
          disabled={isPending}
        />

        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={handleClear}
            disabled={isPending}
          >
            <X className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Limpiar búsqueda</span>
          </Button>
        )}
      </div>

      <Button type="submit" className="ml-2 bg-blue-900 hover:bg-blue-800 text-white" disabled={isPending}>
        <Search className="h-4 w-4 mr-2" />
        Buscar
      </Button>
    </form>
  )
}

