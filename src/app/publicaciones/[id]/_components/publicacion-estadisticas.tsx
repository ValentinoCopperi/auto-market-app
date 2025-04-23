"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Heart, BarChart2, TrendingUp, Calendar } from "lucide-react"

interface VistaItem {
  id: string | number
  created_at: string | Date
}

interface FavoritoItem {
  id: string | number
  created_at: string | Date
}

interface DatoHistorico {
  fecha: string
  vistas: number
  favoritas: number
}

interface Estadisticas {
  vistas: VistaItem[]
  favoritas: FavoritoItem[]
  totalVistas: number
  totalFavoritas: number
  porcentajeVistas: number
  porcentajeFavoritas: number
  tendencia: "up" | "down" | "stable"
  historico: DatoHistorico[]
}

const PublicacionEstadisticas = ({
  id_publicacion,
  verEstadisticas,
}: { id_publicacion: number; verEstadisticas: boolean }) => {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEstadisticas, setShowEstadisticas] = useState(false)
  const [showAccesoDenegado, setShowAccesoDenegado] = useState(false)

  const handleShowEstadisticas = () => {
    if (verEstadisticas) {
      setShowEstadisticas(true)
    } else {
      setShowAccesoDenegado(true)
    }
  }

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/publiaciones/${id_publicacion}/estadisticas`)
        if (!response.ok) {
          setError("Error al obtener las estadísticas")
          setIsLoading(false)
          return
        }
        const data = await response.json()
        console.log(data)
        // Procesar los datos recibidos
        const vistas: VistaItem[] = data.estadisticas.vistas || []
        const favoritas: FavoritoItem[] = data.estadisticas.favoritas || []

        // Calcular totales
        const totalVistas = vistas.length
        const totalFavoritas = favoritas.length

        // Calcular porcentajes (asumiendo objetivos mensuales)
        // Puedes ajustar estos objetivos según tus necesidades
        const objetivoMensualVistas = 100
        const objetivoMensualFavoritos = 50
        const porcentajeVistas = Math.min(Math.round((totalVistas / objetivoMensualVistas) * 100), 100)
        const porcentajeFavoritas = Math.min(Math.round((totalFavoritas / objetivoMensualFavoritos) * 100), 100)

        // Determinar tendencia (esto requeriría datos históricos para comparar)
        // Por ahora, lo establecemos basado en una lógica simple
        const tendencia = totalVistas > 100 ? "up" : "stable"

        // Procesar datos históricos (últimos 7 días)
        const historico = procesarDatosHistoricos(vistas, favoritas)

        setEstadisticas({
          vistas,
          favoritas,
          totalVistas,
          totalFavoritas,
          porcentajeVistas,
          porcentajeFavoritas,
          tendencia,
          historico,
        })

        setIsLoading(false)
      } catch (err) {
        console.error("Error en fetchEstadisticas:", err)
        setError("Error al conectar con el servidor")
        setIsLoading(false)
      }
    }

    if (showEstadisticas && verEstadisticas) {
      fetchEstadisticas()
    }
  }, [id_publicacion, showEstadisticas, verEstadisticas])

  // Función para procesar los datos históricos
  const procesarDatosHistoricos = (vistas: VistaItem[], favoritas: FavoritoItem[]): DatoHistorico[] => {
    // Obtener los últimos 7 días
    const fechas: DatoHistorico[] = []
    const hoy = new Date()

    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - i)

      // Formato corto del día de la semana
      const nombreDia = new Intl.DateTimeFormat("es", { weekday: "short" }).format(fecha)

      // Inicializar el día con 0 vistas y favoritos
      fechas.push({
        fecha: nombreDia,
        vistas: 0,
        favoritas: 0,
      })
    }

    // Contar vistas por día
    vistas.forEach((vista) => {
      const fechaVista = new Date(vista.created_at)
      const indice = obtenerIndiceDia(fechaVista, hoy)

      if (indice >= 0 && indice < 7) {
        fechas[indice].vistas++
      }
    })

    // Contar favoritos por día
    favoritas.forEach((favorito) => {
      const fechaFavorito = new Date(favorito.created_at)
      const indice = obtenerIndiceDia(fechaFavorito, hoy)

      if (indice >= 0 && indice < 7) {
        fechas[indice].favoritas++
      }
    })

    return fechas
  }

  // Función auxiliar para obtener el índice del día
  const obtenerIndiceDia = (fecha: Date, hoy: Date): number => {
    // Crear copias para no modificar los originales
    const fechaCopia = new Date(fecha)
    const hoyCopia = new Date(hoy)

    // Resetear las horas para comparar solo fechas
    fechaCopia.setHours(0, 0, 0, 0)
    hoyCopia.setHours(0, 0, 0, 0)

    // Calcular la diferencia en días
    const diferenciaMilisegundos = hoyCopia.getTime() - fechaCopia.getTime()
    const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24))

    // Devolver el índice (6 - diferencia porque el array va de más antiguo a más reciente)
    return 6 - diferenciaDias
  }

  const renderTendenciaIcon = () => {
    if (!estadisticas?.tendencia) return null

    switch (estadisticas.tendencia) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
      default:
        return <TrendingUp className="h-4 w-4 text-yellow-500 rotate-90" />
    }
  }

  // Encontrar el valor máximo para escalar el gráfico
  const encontrarMaximoVistas = () => {
    if (!estadisticas?.historico) return 10
    return Math.max(...estadisticas.historico.map((dia) => dia.vistas), 10)
  }

  const encontrarMaximoFavoritas = () => {
    if (!estadisticas?.historico) return 5
    return Math.max(...estadisticas.historico.map((dia) => dia.favoritas), 5)
  }

  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Estadísticas de la publicación</CardTitle>
              <CardDescription className="mt-1">Mira el rendimiento de tu publicación</CardDescription>
            </div>
            <BarChart2 className="h-6 w-6 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Vistas totales</p>
                <p className="text-2xl font-bold">{estadisticas?.totalVistas || "**"}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
              <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-2">
                <Heart className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Favoritos</p>
                <p className="text-2xl font-bold">{estadisticas?.totalFavoritas || "**"}</p>
              </div>
            </div>
          </div>

          <Button variant="default" className="w-full" onClick={handleShowEstadisticas}>
            Ver estadísticas detalladas
          </Button>
        </CardContent>
      </Card>

      {/* Diálogo de acceso denegado */}
      <Dialog open={showAccesoDenegado} onOpenChange={setShowAccesoDenegado}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No tienes acceso a las estadísticas</DialogTitle>
            <DialogDescription>
              Para ver las estadísticas de tu publicación, necesitas una suscripción de plan Vendedor o Empresa.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAccesoDenegado(false)}>
              Entendido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de estadísticas */}
      <Dialog open={showEstadisticas} onOpenChange={setShowEstadisticas}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Estadísticas detalladas
            </DialogTitle>
            <DialogDescription>Análisis completo del rendimiento de tu publicación</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="py-6 text-center">Cargando estadísticas...</div>
          ) : error ? (
            <div className="py-6 text-center text-red-500">{error}</div>
          ) : (
            <Tabs defaultValue="resumen" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="resumen">Resumen</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="resumen" className="space-y-4 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Vistas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{estadisticas?.totalVistas}</span>
                        {renderTendenciaIcon()}
                      </div>
                    </div>
                    <Progress value={estadisticas?.porcentajeVistas} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {estadisticas?.porcentajeVistas}% del objetivo mensual (100)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span className="font-medium">Favoritos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold">{estadisticas?.totalFavoritas}</span>
                        {renderTendenciaIcon()}
                      </div>
                    </div>
                    <Progress value={estadisticas?.porcentajeFavoritas} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {estadisticas?.porcentajeFavoritas}% del objetivo mensual (50)
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900 p-4 mt-4">
                    <h4 className="font-medium mb-2">Tasa de conversión</h4>
                    <div className="text-2xl font-bold">
                      {estadisticas && estadisticas.totalVistas > 0
                        ? ((estadisticas.totalFavoritas / estadisticas.totalVistas) * 100).toFixed(1)
                        : "0"}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Porcentaje de vistas que resultaron en favoritos
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="historico" className="py-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Últimos 7 días</h4>

                  <div className="h-[200px] w-full">
                    <div className="flex h-full items-end gap-2">
                      {estadisticas?.historico?.map((dia, index) => {
                        const maxVistas = encontrarMaximoVistas()
                        const maxFavoritas = encontrarMaximoFavoritas()

                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="w-full flex flex-col items-center gap-1">
                              <div
                                className="w-full bg-blue-200 dark:bg-blue-900 rounded-t-sm"
                                style={{
                                  height: `${Math.max((dia.vistas / maxVistas) * 100, 2)}%`,
                                  minHeight: dia.vistas > 0 ? "4px" : "0",
                                }}
                                title={`${dia.vistas} vistas`}
                              />
                              <div
                                className="w-full bg-pink-200 dark:bg-pink-900 rounded-t-sm"
                                style={{
                                  height: `${Math.max((dia.favoritas / maxFavoritas) * 100, 2)}%`,
                                  minHeight: dia.favoritas > 0 ? "4px" : "0",
                                }}
                                title={`${dia.favoritas} favoritos`}
                              />
                            </div>
                            <span className="text-xs mt-2 text-muted-foreground">{dia.fecha}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="flex justify-center gap-6 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded-sm" />
                      <span className="text-xs text-muted-foreground">Vistas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-200 dark:bg-pink-900 rounded-sm" />
                      <span className="text-xs text-muted-foreground">Favoritos</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            <div className="flex items-center text-xs text-muted-foreground gap-1 mr-auto">
              <Calendar className="h-3 w-3" />
              Última actualización: {new Date().toLocaleDateString()}
            </div>
            <Button variant="outline" onClick={() => setShowEstadisticas(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PublicacionEstadisticas
