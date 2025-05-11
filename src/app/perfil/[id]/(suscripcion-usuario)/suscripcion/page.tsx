

import { getSuscripcionByUsuario } from '@/actions/suscripcion-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getSession } from '@/lib/session/session'
import { ArrowRight, Calendar } from 'lucide-react'
import { getPlanName, Planes } from '@/types/suscriciones'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BtnCancelar from './_components/btn-cancelar'

// Calcular días restantes
const calcularDiasRestantes = (fechaFin: Date) => {
    const hoy = new Date()
    const fin = new Date(fechaFin)
    const diferencia = fin.getTime() - hoy.getTime()
    return Math.max(0, Math.ceil(diferencia / (1000 * 60 * 60 * 24)))
}

// Calcular porcentaje de tiempo transcurrido
const calcularPorcentajeTranscurrido = (fechaInicio: Date, fechaFin: Date) => {
    const inicio = new Date(fechaInicio).getTime()
    const fin = new Date(fechaFin).getTime()
    const hoy = new Date().getTime()
    const total = fin - inicio
    const transcurrido = hoy - inicio
    const porcentaje = (transcurrido / total) * 100
    return Math.min(100, Math.max(0, porcentaje))
}

const SuscripcionAdministrar = async () => {

    const session = await getSession()

    if (!session || !session.userId) {
        redirect("/suscripcion")
    }
    const id = Number(session.userId)
    const { data: suscripcion, error } = await getSuscripcionByUsuario(id)


    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Administrar Suscripción</h1>
                    <p className="text-muted-foreground">
                        Gestiona tu plan de suscripción, revisa tu historial de pagos y actualiza tus preferencias
                    </p>
                </div>

                {!suscripcion ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-pulse text-center">
                            <p className="text-muted-foreground">No tienes ninguna suscripción</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Panel principal - Información de suscripción */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Tu Suscripción</CardTitle>
                                        <CardDescription>Detalles de tu plan actual</CardDescription>
                                    </div>
                                    <Badge
                                        className={
                                            suscripcion.estado === "activa"
                                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                : suscripcion.estado === "vencida"
                                                    ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        }
                                    >
                                        {suscripcion.estado === "activa"
                                            ? "Activa"
                                            : suscripcion.estado === "vencida"
                                                ? "Vencida"
                                                : suscripcion.estado === "cancelada"
                                                    ? "Cancelada"
                                                    : "Pendiente"}
                                    </Badge>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                                        <div>
                                            <h3 className="font-semibold text-lg">{getPlanName(suscripcion.tipo_suscripcion.nombre as Planes)}</h3>
                                            <p className="text-muted-foreground">
                                                {suscripcion.tipo_suscripcion.nombre === "plan_ocasion"
                                                    ? "1 publicación"
                                                    : suscripcion.tipo_suscripcion.nombre === "plan_vendedor"
                                                        ? "Hasta 3 publicaciones"
                                                        : "Publicaciones ilimitadas"}
                                            </p>
                                        </div>
                                        <Link href="/suscripcion">
                                            <Button
                                                variant="outline"
                                                className="bg-white dark:bg-blue-900/50"
                                            >
                                                Cambiar plan
                                            </Button>
                                        </Link>
                                    </div>

                                    {suscripcion.estado === "activa" && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-muted-foreground">Tiempo restante</span>
                                                <span className="text-sm font-medium">{calcularDiasRestantes(suscripcion.fecha_fin)} días</span>
                                            </div>
                                            <Progress value={calcularPorcentajeTranscurrido(suscripcion.fecha_inicio, suscripcion.fecha_fin)} className="h-2" />
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>Inicio: {suscripcion.fecha_inicio.toLocaleDateString()}</span>
                                                <span>Vence: {suscripcion.fecha_fin.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3">
                                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                                                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">
                                                    {suscripcion.estado === "activa" ? "Fecha de renovación" : "Fecha de vencimiento"}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {suscripcion.estado === "activa" ?
                                                        suscripcion.fecha_fin.toLocaleDateString()
                                                        : suscripcion.fecha_fin.toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row gap-3">
                                    {suscripcion.estado === "activa" ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-auto"
                                            >
                                                <Link href={"/suscripcion"}>
                                                    Renovar suscripción
                                                </Link>
                                            </Button>
                                            <BtnCancelar />
                                        </>
                                    ) : (
                                        <Button
                                            className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white"
                                        >
                                            <Link href={"/suscripcion"} className="flex items-center justify-center">
                                                Reactivar suscripción
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        </div>

                        {/* Panel lateral - Beneficios y acciones rápidas */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        {
                                            suscripcion.estado === "activa" ? "Beneficios de tu plan" : "Reactivar para aprovechar los beneficios"
                                        }
                                    </CardTitle>
                                    <CardDescription>{getPlanName(suscripcion.tipo_suscripcion.nombre as Planes)}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        {suscripcion.tipo_suscripcion.nombre === "plan_ocasion" && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">1 publicación</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Duración ilimitada</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Soporte básico</span>
                                                </div>
                                            </>
                                        )}

                                        {suscripcion.tipo_suscripcion.nombre === "plan_vendedor" && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Hasta 3 publicaciones</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Duración ilimitada</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Estadísticas básicas</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Soporte prioritario</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Badge de vendedor verificado</span>
                                                </div>
                                            </>
                                        )}

                                        {suscripcion.tipo_suscripcion.nombre === "plan_agencia" && (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Publicaciones ilimitadas</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Duración ilimitada</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Publicaciones destacadas</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Estadísticas avanzadas</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Soporte VIP</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                    <span className="text-sm">Badge de vendedor profesional</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                <div className="mt-16 bg-muted rounded-lg p-6 md:p-8">
                    <h2 className="text-xl font-semibold mb-4">¿Necesitas ayuda con tu suscripción?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-muted-foreground mb-4">
                                Si tienes alguna pregunta sobre tu suscripción, facturación o necesitas asistencia para cambiar de plan,
                                nuestro equipo de soporte está disponible para ayudarte.
                            </p>
                            <p className="text-muted-foreground">
                                También puedes consultar nuestra sección de preguntas frecuentes donde encontrarás respuestas a las
                                consultas más comunes sobre suscripciones y pagos.
                            </p>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <Link href="/contacto"> Contactar con soporte </Link>
                            </Button>
                            
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default SuscripcionAdministrar