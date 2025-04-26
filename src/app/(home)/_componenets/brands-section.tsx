
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Marca } from "@/types/publicaciones"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { getMarcasByCantidadPublicaciones } from "@/actions/marcas-actions"

export async function BrandsSection() {
    const marcas: Marca[] = await getMarcasByCantidadPublicaciones()

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Marcas Populares</h2>
                <Link href="#">
                    <Button variant="outline" className="border-border text-foreground">
                        <p className="hidden md:block">Ver Todas las Marcas</p>
                        <p className="block md:hidden">Ver Marcas</p>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </div>
            <Carousel>
                <CarouselContent className="px-8">
                    {marcas.map((marca) => (
                        <BrandItem key={marca.id} id={marca.id} name={marca.nombre} count={marca.cantidad_publicaciones} />
                    ))}
                </CarouselContent>
                <CarouselPrevious className="w-10 h-10 absolute left-0" />
                <CarouselNext className="w-10 h-10 absolute right-0" />
            </Carousel>
        </section>
    )
}

interface BrandCardProps {
    id?: number;
    name?: string;
    count?: number;
}

function BrandItem({ id, name, count }: BrandCardProps) {
    return (
        <CarouselItem key={id} className="md:basis-1/4">
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 flex flex-col items-center hover:shadow-md transition-all duration-300 ">
                <div className="relative w-full h-36  mb-6 flex items-center justify-center">
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        {count || 0}
                    </div>
                    <div className="relative w-[120px] h-[120px]">
                        <Image
                            src={name ? `/${name}-logo.png` : "/placeholder.svg"}
                            alt={name || "Marca"}
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <h3 className="text-lg font-semibold mb-4">{name ? name.charAt(0).toUpperCase() + name.slice(1) : "Marca"}</h3>
                <Link
                    href={name ? `/publicaciones?marca=${encodeURIComponent(name.toLowerCase())}` : "/publicaciones"}
                    className="w-full"
                >
                    <Button variant="outline" className="w-full cursor-pointer">
                        <Car className="h-4 w-4 mr-2" />
                        Ver Modelos
                    </Button>
                </Link>
            </div>
        </CarouselItem>


    )
}


