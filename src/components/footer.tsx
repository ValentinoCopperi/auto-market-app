import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="w-full bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Columna 1: Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-600 text-white p-1 rounded mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </div>
              <span className="text-xl font-bold">CarMarket</span>
            </div>
            <p className="text-muted-foreground text-sm">
              La plataforma líder para comprar y vender vehículos en Argentina. Conectamos compradores y vendedores para
              hacer el proceso simple y seguro.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook size={18} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram size={18} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter size={18} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube size={18} />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          {/* Columna 2: Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Publicaciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Suscripción
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Chat
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Impulsamos Juntos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Vender mi Auto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Categorías */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Categorías</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Automóviles
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Camionetas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Motocicletas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Vehículos Comerciales
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Repuestos
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-base">Mantente informado</h3>
            <p className="text-sm text-muted-foreground">
              Suscríbete para recibir las últimas novedades y ofertas especiales.
            </p>
            <div className="flex space-x-2">
              <Input type="email" placeholder="Tu correo electrónico" className="max-w-[220px]" />
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Suscribir
              </Button>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-muted-foreground" />
                <span className="text-sm">+54 11 5555-5555</span>
              </div>
              <div className="flex items-center">
                <Mail size={16} className="mr-2 text-muted-foreground" />
                <span className="text-sm">contacto@automarket.com</span>
              </div>
              <div className="flex items-center">
                <MapPin size={16} className="mr-2 text-muted-foreground" />
                <span className="text-sm">Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Footer inferior */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CarMarket. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Términos y condiciones
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Política de privacidad
            </Link>
            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Ayuda
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
