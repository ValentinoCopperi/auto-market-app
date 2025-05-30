import type { MetadataRoute } from "next"
import { getIdPublicaciones, getPublicaciones } from "@/actions/publicaciones-actions"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Obtén la URL base de tu sitio
  const baseUrl = "https://carmarketarg.com"

  // Define tus rutas estáticas
  const staticRoutes = [
    "",
    "/publicaciones",
    //Por Marca:
    "/publicaciones?marca=toyota",
    "/publicaciones?marca=ford",
    "/publicaciones?marca=chevrolet",
    "/publicaciones?marca=fiat",
    "/publicaciones?marca=peugeot",
    "/publicaciones?marca=renault",
    "/publicaciones?marca=hyundai",
    "/publicaciones?marca=audi",
    "/publicaciones?marca=bmw",
    "/publicaciones?marca=mercedes-benz",
    "/publicaciones?marca=volkswagen",
    "/publicaciones?q=corolla",
    "/publicaciones?q=fiesta",
    "/publicaciones?q=gol",
    "/publicaciones?q=hilux",
    "/publicaciones?q=palio",
    "/publicaciones?q=208",
    "/publicaciones?q=amarok",
    "/publicaciones?q=vento",
    "/publicaciones?q=cronos",
    "/publicaciones?q=ranger",
    "/suscripcion",
    "/chat",
    "/favoritos",
    "/impulsamos-juntos/esp-off-performance",
    "/impulsamos-juntos/dynaco-consulting",
    // Agrega todas tus rutas estáticas aquí
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  const publicaciones = await getIdPublicaciones()
  const dynamicRoutes = publicaciones.map(publicacion => ({
    url: `${baseUrl}/publicaciones/${publicacion.id}`,
    lastModified: new Date(publicacion.created_at || new Date()),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Combina todas las rutas
  return [
    ...staticRoutes,
    ...dynamicRoutes,
  ]
}
