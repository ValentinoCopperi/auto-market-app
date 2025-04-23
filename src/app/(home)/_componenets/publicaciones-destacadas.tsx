

import { getPubliacionesDestacadas } from "@/actions/publicaciones-actions";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {PublicacionesGrid} from "@/components/publicaciones/publicaciones-grid";

export const PublicacionesDestacadas = async () => {


    const publicaciones_destacadas= await getPubliacionesDestacadas();

    return (
        <section className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-2xl font-bold">Vehículos Destacados</h2>
                    <p className="text-muted-foreground hidden md:block">Descubre nuestra selección de vehículos premium</p>
                </div>
                <Link href="#">
                    <Button variant="outline" className="border-border text-foreground">
                        <p className="hidden md:block">Ver Todos los Vehículos</p>
                        <p className="block md:hidden">Ver Vehículos</p>
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                </Link>
            </div>

            <PublicacionesGrid publicaciones={publicaciones_destacadas} />
        </section>
    )
}
