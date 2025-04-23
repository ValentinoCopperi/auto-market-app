import Link from "next/link"
import { Car, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Car className="h-10 w-10 text-primary" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3">Página no encontrada</h1>

        <p className="text-muted-foreground mb-8">
          Lo sentimos, la página que estás buscando no existe o ha sido movida a otra ubicación.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/publicaciones">
              <Car className="h-4 w-4 mr-2" />
              Explorar vehículos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
