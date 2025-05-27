import type React from "react"
import Link from "next/link"
import { Bike, Bus, Car, Truck, } from "lucide-react"


const categories = [
  {
    name: "Automóvil",
    icon: <Car className="h-8 w-6" />,
    color: "bg-blue-500",
    href: "/publicaciones?categoria=automovil"
  },
  {
    name: "Camioneta",
    icon: <Truck className="h-8 w-6" />,
    color: "bg-green-500",
    href: "/publicaciones?categoria=camioneta"
  },
  {
    name: "Motocicleta",
    icon: <Bike className="h-8 w-6" />,
    color: "bg-yellow-500",
    href: "/publicaciones?categoria=motocicleta"
  },
  {
    name: "Comercial",
    icon: <Bus className="h-8 w-6" />,
    color: "bg-red-500",
    href: "/publicaciones?categoria=comercial"
  }
]

export function CategorySection() {


  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8">Explorar por Categoría</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.href} href={category.href} className="block bg-card rounded-lg shadow-sm border border-border p-6 text-center transition-transform hover:scale-102">
            <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-full ${category.color} mb-4`}>
              {category.icon}
            </div>
            <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  )
}

