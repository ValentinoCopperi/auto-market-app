"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, Instagram, Twitter } from "lucide-react"
import Link from "next/link"

const DynacoSlug = ({ instagram_url }: { instagram_url: string }) => {
    return (
        <div className="space-y-6 flex flex-col-reverse md:flex-row gap-8 items-center py-4 md:py-12">
            {/* Twitter Profile Card */}
            <div className="w-full md:w-1/2 bg-black text-white rounded-2xl overflow-hidden shadow-xl">
                <div className="p-6 relative h-[500px]">
                    <Image src="/dynaco-tweet.png" alt="Richar profile picture" fill className="object-contain" />
                </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
                <h1 className="text-4xl font-bold ">¿Querés comprar un auto usado sin sorpresas?</h1>

                <p className="text-lg ">
                    En nuestro Twitter compartimos tips clave, alertas sobre modelos problemáticos y casos reales para que tomes
                    decisiones informadas.
                </p>

                <p className="text-lg ">Seguinos y enterate antes de invertir en tu próximo vehículo.</p>

                <Link href={instagram_url} target="_blank">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-3 h-auto rounded-md flex items-center text-sm" >
                        <Twitter className="h-4 w-4 mr-2" />
                        Visita nuestro Twitter
                    </Button>
                </Link>
            </div>

        </div>
    )
}

export default DynacoSlug
