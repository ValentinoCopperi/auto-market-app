"use cache"

import { getAgenciasPopulares } from "@/actions/clientes-actions"
import Image from "next/image"
import Link from "next/link"

export const AgenciasPopulares = async () => {
  const response = await getAgenciasPopulares()
  if (response.error || !response.data) {
    return null
  }
  const agencias = response.data

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-center md:text-left">Agencias Populares</h2>
      
      <div
        className={`grid gap-4 md:gap-6 justify-items-center ${
          agencias.length === 1
            ? "grid-cols-1 justify-center"
            : agencias.length === 2
              ? "grid-cols-2 max-w-md mx-auto"
              : agencias.length === 3
                ? "grid-cols-3 max-w-2xl mx-auto"
                : "grid-cols-2 sm:grid-cols-4  mx-auto"
        }`}
      >
        {agencias.map((agencia) => (
          <Link
            key={agencia.id}
            href={`/perfil/${agencia.id}/publicaciones`}
            className="flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-200"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mb-3">
              {agencia.profile_img_url ? (
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-primary transition-colors duration-200">
                  <Image
                    src={agencia.profile_img_url || "/placeholder.svg"}
                    alt={agencia.nombre}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, (max-width: 1024px) 112px, 128px"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center bg-primary/10 text-primary border-2 border-gray-200 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-200">
                  <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold">
                    {agencia.nombre.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-sm sm:text-base font-medium text-center text-gray-700 group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {agencia.nombre}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  )
}
