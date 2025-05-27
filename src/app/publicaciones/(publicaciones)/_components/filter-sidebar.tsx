"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { Marca } from "@/types/publicaciones"
import { CIUDADES, COMBUSTIBLE } from "@/types/filtros"

interface FilterSidebarProps {
  currentFilters: Record<string, any>
  marcas: Marca[]
}

const currencyConfig = {
  USD: {
    max: 200000,
    step: 1000,
    symbol: "USD $",
  },
  ARG: {
    max: 100000000,
    step: 10000,
    symbol: "$",
  },
}

export function FilterSidebar({ currentFilters, marcas }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)

  const defaultCiudad = currentFilters.ciudad?.charAt(0).toUpperCase() + currentFilters.ciudad?.slice(1) || "all"
  //Santiago+del+estero -> Santiago del Estero
  const parsedDefaultCiudad = defaultCiudad.replace(/\+/g, " ")

  const [moneda, setMoneda] = useState<"USD" | "ARG">(currentFilters.moneda || "USD")
  const [currentConfig, setCurrentConfig] = useState(currencyConfig[moneda])

  const getPriceRange = (): [number, number] => {
    if (currentFilters.precio_min && currentFilters.precio_max) {
      return [Number(currentFilters.precio_min), Number(currentFilters.precio_max)]
    } else if (currentFilters.precio_min) {
      return [Number(currentFilters.precio_min), currentConfig.max]
    } else if (currentFilters.precio_max) {
      return [0, Number(currentFilters.precio_max)]
    }
    return [0, currentConfig.max]
  }

  const [priceRange, setPriceRange] = useState<[number, number]>(getPriceRange())

  const handleMonedaChange = (value: "USD" | "ARG") => {
    setMoneda(value)
    setCurrentConfig(currencyConfig[value])
    setPriceRange([0, currentConfig.max])
  }

  useEffect(() => {
    setPriceRange(getPriceRange())
  }, [currentFilters])

  // Función para aplicar filtros
  const applyFilters = (newFilters: Record<string, any> = {}) => {
    // Crear una nueva instancia de URLSearchParams basada en los parámetros actuales
    const params = new URLSearchParams(searchParams.toString())

    // Si estamos aplicando filtros de precio
    if (Object.keys(newFilters).length === 0) {
      // Aplicar el rango de precios actual
      if (priceRange[0] > 0) {
        params.set("precio_min", priceRange[0].toString())
      } else {
        params.delete("precio_min")
      }

      if (priceRange[1] < currentConfig.max) {
        params.set("precio_max", priceRange[1].toString())
      } else {
        params.delete("precio_max")
      }

      params.set("moneda", moneda)
    } else {
      // Actualizar o eliminar parámetros según los nuevos filtros
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "" || value === "all") {
          params.delete(key)
        } else {
          params.set(key, value.toString().toLocaleLowerCase())
        }
      })
    }

    // Navegar a la nueva URL con los parámetros actualizados
    router.push(`/publicaciones?${params.toString()}`)
    setIsOpen(false) // Cerrar el drawer en móvil después de aplicar filtros
  }

  const FilterContent = () => (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>

      <Accordion type="multiple" defaultValue={["marca", "categoria", "ciudad", "anio", "precio", "color"]}>
        <AccordionItem value="marca">
          <AccordionTrigger>Marca</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                defaultValue={currentFilters.marca || "all"}
                onValueChange={(value) => applyFilters({ marca: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las marcas</SelectItem>
                  {marcas.map((marca) => (
                    <SelectItem key={marca.id} value={marca.nombre}>
                      {marca.nombre.charAt(0).toUpperCase() + marca.nombre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categoria">
          <AccordionTrigger>Categoría</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                defaultValue={currentFilters.categoria || "all"}
                onValueChange={(value) => applyFilters({ categoria: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="automovil">Automóvil</SelectItem>
                  <SelectItem value="camioneta">Camioneta</SelectItem>
                  <SelectItem value="motocicleta">Motocicleta</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ciudad">
          <AccordionTrigger>Ciudad</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                defaultValue={parsedDefaultCiudad || "all"}
                onValueChange={(value) => applyFilters({ ciudad: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas las ciudades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las ciudades</SelectItem>
                  {CIUDADES.map((ciudad) => (
                    <SelectItem key={ciudad} value={ciudad}>
                      {ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="anio">
          <AccordionTrigger>Año</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Select
                defaultValue={currentFilters.anio || "all"}
                onValueChange={(value) => applyFilters({ anio: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los años" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los años</SelectItem>
                  {Array.from({ length: 16 }, (_, i) => 2025 - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="precio">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 p-4">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    min={0}
                    max={currentConfig.max}
                    step={currentConfig.step}
                    onValueChange={(value) => setPriceRange([value[0], value[1]])}
                    className="mb-4"
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>
                      {currentConfig.symbol}
                      {priceRange[0].toLocaleString()}
                    </span>
                    <span>
                      {currentConfig.symbol}
                      {priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-24">
                  <Select value={moneda} onValueChange={handleMonedaChange}>
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="USD" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="ARG">ARG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button variant="default" size="sm" className="w-full" onClick={() => applyFilters()}>
                Aplicar
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                defaultValue={currentFilters.color || "all"}
                onValueChange={(value) => applyFilters({ color: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los colores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los colores</SelectItem>
                  <SelectItem value="negro">Negro</SelectItem>
                  <SelectItem value="blanco">Blanco</SelectItem>
                  <SelectItem value="gris">Gris</SelectItem>
                  <SelectItem value="rojo">Rojo</SelectItem>
                  <SelectItem value="azul">Azul</SelectItem>
                  <SelectItem value="verde">Verde</SelectItem>
                  <SelectItem value="amarillo">Amarillo</SelectItem>
                  <SelectItem value="marron">Marrón</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tipo_transmision">
          <AccordionTrigger>Transmisión</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                defaultValue={currentFilters.tipo_transmision || "all"}
                onValueChange={(value) => applyFilters({ tipo_transmision: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="automatico">Automático</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tipo_combustible">
          <AccordionTrigger>Combustible</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <Select
                defaultValue={currentFilters.tipo_combustible || "all"}
                onValueChange={(value) => applyFilters({ tipo_combustible: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  {COMBUSTIBLE.map((combustible) => (
                    <SelectItem key={combustible} value={combustible}>
                      {combustible}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        className="w-full mt-6"
        onClick={() => {
          router.push("/publicaciones")
          setIsOpen(false)
        }}
      >
        Limpiar Filtros
      </Button>
    </>
  )

  return (
    <>
      {/* Botón para móvil que abre el Sheet */}
      <div className="lg:hidden mb-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Ver filtros
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] sm:w-[350px] overflow-y-auto">
            <div className="mt-8 px-2">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Versión de escritorio que siempre está visible */}
      <div className="hidden lg:block bg-card rounded-lg border border-border p-4">
        <FilterContent />
      </div>
    </>
  )
}
