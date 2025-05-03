"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  searchParams: Record<string, any>
}

export function Pagination({ currentPage, totalPages, searchParams }: PaginationProps) {
  const router = useRouter()

  // Función para navegar a una página específica
  const goToPage = (page: number) => {
    // Crear una copia de los parámetros actuales
    const params = new URLSearchParams()

    // Añadir todos los parámetros actuales excepto 'page'
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value !== undefined) {
        params.set(key, value.toString())
      }
    })

    // Añadir el nuevo número de página
    params.set("page", page.toString())

    // Navegar a la nueva URL
    router.push(`/publicaciones?${params.toString()}`)
  }

  // Determinar qué páginas mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1)

      // Calcular el rango de páginas a mostrar alrededor de la página actual
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar para mostrar siempre 3 páginas en el medio
      if (start === 2) end = Math.min(totalPages - 1, start + 2)
      if (end === totalPages - 1) start = Math.max(2, end - 2)

      // Añadir elipsis si es necesario
      if (start > 2) pages.push(-1) // -1 representa elipsis

      // Añadir páginas del medio
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Añadir elipsis si es necesario
      if (end < totalPages - 1) pages.push(-2) // -2 representa elipsis

      // Siempre mostrar la última página
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>

      {pageNumbers.map((page, index) =>
        page < 0 ? (
          <span key={`ellipsis-${index}`} className="px-2">
            ...
          </span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(page)}
            className={currentPage === page ? "pointer-events-none" : ""}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Página siguiente</span>
      </Button>
    </div>
  )
}

