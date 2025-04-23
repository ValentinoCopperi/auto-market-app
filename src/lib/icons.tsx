import { Car, Truck, Bike, Bus } from "lucide-react";
import { Categoria } from "@/types/publicaciones";

export const getIcon = (tipo: Categoria) => {
  const icons = {
    automovil: { icon: <Car className="h-8 w-8 text-white" />, title: "Automóviles", color: "bg-blue-500" },
    camioneta: { icon: <Truck className="h-8 w-8 text-white" />, title: "Camionetas", color: "bg-green-500" },
    motocicleta: { icon: <Bike className="h-8 w-8 text-white" />, title: "Motocicletas", color: "bg-yellow-500" },
    comercial: { icon: <Bus className="h-8 w-8 text-white" />, title: "Comerciales", color: "bg-red-500" },
  };

  return icons[tipo] || { icon: <Car className="h-8 w-8 text-white" />, title: "Desconocido", color: "bg-gray-500" };
};

export const categories: Categoria[] = ['automovil', 'camioneta', 'motocicleta', 'comercial']
