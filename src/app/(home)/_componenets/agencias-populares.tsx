"use cache"

import { getAgenciasPopulares } from "@/actions/clientes-actions"
import Image from "next/image"
import Link from "next/link"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export const AgenciasPopulares = async () => {
  const response = await getAgenciasPopulares()
  if (response.error || !response.data) {
    return null
  }
  const agencias = response.data

  return (
    <div className="w-full py-8 px-2">
      <h2 className="text-2xl font-bold mb-6 ">Agencias Populares</h2>

      <div className="relative">
        <Carousel className="w-full md:w-[90%] mx-auto">
          <CarouselContent className="-ml-2 md:-ml-4">
            {agencias.map((agencia) => (
              <CarouselItem key={agencia.id} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6">
                <Link
                  href={`/perfil/${agencia.id}/publicaciones`}
                  className="flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-200 p-2"
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="w-10 h-10 absolute left-0" />
          <CarouselNext className="w-10 h-10 absolute right-0" />
        </Carousel>
      </div>
    </div>
  )
}
