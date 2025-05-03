"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/charts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { Star, Search, Filter, Calendar, Lock, TrendingUp, BarChart3, MessageSquare, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useAuth } from "@/hooks/use-auth"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { Resena } from "@/types/resenas"
import { puedeVerEstadisticas } from "@/actions/suscripcion-actions"
import { getResenasByUsuario } from "@/actions/resenas-actions"





export default function ResenasPage() {
  const { user, loading } = useAuth()
  const { openLoginDialog } = useDialogStore()
  const [puedeVer, setPuedeVer] = useState(false)
  const [userResenas, setUserResenas] = useState<Resena[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Si el usuario está autenticado, cargamos sus datos
    if (user) {
      // Simulamos la carga de datos
      const loadData = async () => {
        setIsLoading(true)
        try {
          // Aquí irían las llamadas reales a la API
          // const resultado = await getResenasByUsuario(Number(user.id))
          // setUserResenas(resultado)

          // Simulamos la verificación de permisos
          const canViewStats = await puedeVerEstadisticas(Number(user.id))
          setPuedeVer(canViewStats.data || false)

          // Filtramos las reseñas según el término de búsqueda
          const resenas = await getResenasByUsuario(Number(user.id))
          setUserResenas(resenas)
        } catch (error) {
          console.error("Error al cargar datos:")
        } finally {
          setIsLoading(false)
        }
      }

      loadData()
    }
  }, [user])

  // Calcular estadísticas
  const totalResenas = userResenas.length
  const promedioCalificacion = userResenas.reduce((acc, resena) => acc + resena.valoracion, 0) / totalResenas || 0
  const porcentajePositivas = (userResenas.filter((r) => r.valoracion >= 4).length / totalResenas) * 100 || 0

  // Función para renderizar estrellas
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn("h-4 w-4", star <= rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground")}
          />
        ))}
      </div>
    )
  }

  // Si el usuario no está autenticado, mostramos un mensaje para iniciar sesión
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Encabezado de la página */}
          <div className="bg-muted/30 border-b">
            <div className="container mx-auto px-4 py-12 md:py-16">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Reseñas y Calificaciones</h1>
              <p className="text-muted-foreground max-w-2xl">
                Gestiona y analiza las reseñas recibidas por tus publicaciones. Conoce la opinión de tus clientes y
                mejora tu reputación en la plataforma.
              </p>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="bg-muted/50 p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-medium mb-4">Inicia sesión para ver tus reseñas</h2>
              <p className="text-muted-foreground mb-6">
                Inicia sesión para acceder a tu panel de reseñas y calificaciones.
              </p>
              <Button variant="outline" className="w-full" onClick={openLoginDialog}>
                Iniciar sesión
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (isLoading || loading) return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Encabezado de la página */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Reseñas y Calificaciones</h1>
            <p className="text-muted-foreground max-w-2xl">
              Gestiona y analiza las reseñas recibidas por tus publicaciones. Conoce la opinión de tus clientes y
              mejora tu reputación en la plataforma.
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>

      </main>
    </div>
  )
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Encabezado de la página */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Reseñas y Calificaciones</h1>
            <p className="text-muted-foreground max-w-2xl">
              Gestiona y analiza las reseñas recibidas por tus publicaciones. Conoce la opinión de tus clientes y mejora
              tu reputación en la plataforma.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Calificación promedio</CardTitle>
                <CardDescription>Basado en {totalResenas} reseñas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{promedioCalificacion.toFixed(1)}</span>
                  {renderStars(Math.round(promedioCalificacion))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Reseñas positivas</CardTitle>
                <CardDescription>Porcentaje de 4 y 5 estrellas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{porcentajePositivas.toFixed(0)}%</span>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${porcentajePositivas}%` }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total de reseñas</CardTitle>
                <CardDescription>Historial completo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{totalResenas}</span>
                  <Button variant="outline" size="sm" className="text-xs">
                    Ver todas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal con tabs */}
          <Tabs defaultValue="resenas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="resenas" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>Reseñas</span>
              </TabsTrigger>
              <TabsTrigger value="estadisticas" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Estadísticas</span>
              </TabsTrigger>
            </TabsList>

            {/* Contenido de la pestaña Reseñas */}
            <TabsContent value="resenas">
              <div className="space-y-6">
                {/* Filtros y búsqueda */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-2">
                    <Select defaultValue="recientes">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recientes">Más recientes</SelectItem>
                        <SelectItem value="antiguas">Más antiguas</SelectItem>
                        <SelectItem value="mejores">Mejor calificadas</SelectItem>
                        <SelectItem value="peores">Peor calificadas</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Lista de reseñas */}
                <div className="space-y-4">
                  {userResenas.length > 0 ? (
                    userResenas.map((resena) => (
                      <Card key={resena.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          <div className="p-6 flex-1">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={resena.cliente_valoracion_id_cliente_votanteTocliente.profile_img_url || "/placeholder.svg"}
                                    alt={resena.cliente_valoracion_id_cliente_votanteTocliente.nombre}
                                  />
                                  <AvatarFallback>
                                    {resena.cliente_valoracion_id_cliente_votanteTocliente.nombre
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{resena.cliente_valoracion_id_cliente_votanteTocliente.nombre}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {resena?.created_at?.toLocaleDateString("es-ES", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {renderStars(resena.valoracion)}
                                <span className="ml-1 font-medium">{resena.valoracion}.0</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-3">{resena.comentario}</p>
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No se encontraron reseñas que coincidan con tu búsqueda.</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Contenido de la pestaña Estadísticas */}
            <TabsContent value="estadisticas">
              {puedeVer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución de calificaciones</CardTitle>
                      <CardDescription>Desglose por número de estrellas</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      {
                        userResenas.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={[5, 4, 3, 2, 1].map((valor) => ({
                                valoracion: valor,
                                cantidad: userResenas.filter((resena) => resena.valoracion === valor).length,
                              }))}
                            >
                              <XAxis dataKey="valoracion" />
                              <YAxis allowDecimals={false}
                                tickCount={userResenas.length} />
                              <Bar
                                dataKey="cantidad"
                                fill="currentColor"
                                className="fill-primary"
                                radius={[4, 4, 0, 0]}
                                label={{ position: "top" }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No hay datos para mostrar</p>
                          </div>
                        )
                      }
                    </CardContent>
                  </Card>


                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas detalladas</CardTitle>
                      <CardDescription>Análisis de tus reseñas</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                      {
                        userResenas.length > 0 ? (
                          <div className="space-y-6">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Distribución por calificación</h4>
                              <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((stars) => {
                                  const count = userResenas.filter((r) => r.valoracion === stars).length
                                  const percentage = (count / totalResenas) * 100
                                  return (
                                    <div key={stars} className="flex items-center gap-2">
                                      <div className="flex items-center w-12">
                                        <span className="font-medium">{stars}</span>
                                        <Star className="h-4 w-4 ml-1 text-yellow-400 fill-yellow-400" />
                                      </div>
                                      <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                          className={cn(
                                            "h-2 rounded-full",
                                            stars >= 4 ? "bg-green-500" : stars === 3 ? "bg-yellow-500" : "bg-red-500",
                                          )}
                                          style={{ width: `${percentage}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-sm text-muted-foreground w-16 text-right">
                                        {count} ({percentage.toFixed(0)}%)
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <p className="text-muted-foreground">No hay datos para mostrar</p>
                          </div>
                        )
                      }
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center py-10 px-6">
                      <div className="bg-muted/50 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Estadísticas avanzadas bloqueadas</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Mejora tu suscripción para acceder a estadísticas detalladas, análisis de sentimiento y
                        tendencias de tus reseñas.
                      </p>
                      <Button className="bg-blue-600 hover:bg-blue-700">Mejorar suscripción</Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Sección de ayuda */}
          <div className="bg-muted/50 rounded-lg p-6 mt-8 dark:bg-muted/20">
            <h3 className="text-lg font-medium mb-3">Mejora tu reputación</h3>
            <p className="text-muted-foreground mb-4">
              Las reseñas positivas aumentan la confianza de los compradores y mejoran la visibilidad de tus
              publicaciones. Sigue estos consejos para obtener mejores calificaciones.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-background p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Responde rápidamente</h4>
                <p className="text-sm text-muted-foreground">
                  Mantén un tiempo de respuesta bajo para mejorar la satisfacción del cliente.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Sé transparente</h4>
                <p className="text-sm text-muted-foreground">
                  Describe tus vehículos con precisión, incluyendo cualquier detalle o imperfección.
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Ofrece buen servicio</h4>
                <p className="text-sm text-muted-foreground">
                  Brinda una experiencia positiva desde el primer contacto hasta después de la venta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
