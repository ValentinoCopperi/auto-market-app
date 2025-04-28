import type { Publicacion } from "@/types/publicaciones"
import { MapPin, Star } from "lucide-react"
import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import Link from "next/link"
import MessageBtn from "./message-btn"

const PublicacionCard = ({ publicacion }: { publicacion: Publicacion }) => {
  const portada = publicacion.url_portada ? publicacion.url_portada : "/not_image.webp"

  const moneda = () => {
    if (publicacion.tipo_moneda === "USD") {
      return "Dolares"
    } else if (publicacion.tipo_moneda === "ARG") {
      return "Pesos"
    } else {
      return "No especificado"
    }
  }

  return (
    <div
      key={publicacion.id}
      className="bg-card rounded-lg border border-border overflow-hidden shadow-sm flex flex-col h-[450px]"
    >
      <div className="relative h-48 flex-shrink-0">
        <Image
          src={portada || "/placeholder.svg"}
          alt={publicacion.modelo}
          fill
          loading="lazy"
          className="object-cover"
        />
        {publicacion.destacado && (
          <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md flex items-center">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Destacado
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold truncate" title={publicacion.titulo || "Sin titulo"}>
            {publicacion.titulo ? publicacion.titulo.toUpperCase() : "Sin titulo"}
          </h3>
          <p className="text-lg font-bold text-blue-600 flex-shrink-0">${publicacion.precio.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4 flex-shrink-0">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-muted-foreground">Modelo: </span>
            <span title={publicacion.modelo}>
              {publicacion.modelo.slice(0, 1).toUpperCase() + publicacion.modelo.slice(1)}
            </span>
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-muted-foreground">Marca: </span>
            <span title={publicacion.marca.nombre}>
              {publicacion.marca.nombre.charAt(0).toUpperCase() + publicacion.marca.nombre.slice(1)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Año: </span>
            {publicacion.anio}
          </div>
          <div>
            <span className="text-muted-foreground">Kilometraje: </span>
            {publicacion.kilometraje.toLocaleString()}
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="text-muted-foreground">Categoria: </span>
            <span title={publicacion.categoria || "Sin categoria"}>
              {publicacion.categoria
                ? publicacion.categoria.slice(0, 1).toUpperCase() + publicacion.categoria.slice(1)
                : "Sin categoria"}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Moneda: </span>
            {moneda()}
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4 flex items-center overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span title={publicacion.ciudad || "Sin ciudad"}>
            {publicacion.ciudad
              ? publicacion.ciudad.charAt(0).toUpperCase() + publicacion.ciudad.slice(1)
              : "Sin ciudad"}
          </span>
        </div>

        <div className="flex gap-2 mt-auto flex-shrink-0">
          <Link href={`/publicaciones/${publicacion.id}`} className="w-[70%] cursor-pointer">
            <Button className="flex-1 w-full cursor-pointer">
              Ver Publicacion
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <MessageBtn title={publicacion.titulo} publicacionId={publicacion.id} vendedorId={publicacion.cliente.id} />
        </div>
      </div>
    </div>
  )
}

export default PublicacionCard
