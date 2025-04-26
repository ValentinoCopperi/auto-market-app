

import { Plus, Star, MessageSquare, Flag, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { getPublicacionesByUsuario } from "@/actions/publicaciones-actions"
import { getClienteById } from "@/actions/clientes-actions"
import { PerfilHeader } from "./_components/perfil-header"
import { PublicacionesGrid } from "@/components/publicaciones/publicaciones-grid"
import { getSession } from "@/lib/session/session"
import { PerfilInfo } from "./_components/perfil-info"
import { PerfilStats } from "./_components/perfil-stats"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { PerfilReviews } from "./_components/perfil-reviews"
import { getResenasByUsuario } from "@/actions/resenas-actions"
import { SearchBar } from "@/components/search-bar"
import SendMessage from "./_components/send-message"
import { MensajesProvider } from "@/hooks/use-mensajes"
import PublicarBtn from "./_components/publicar-btn"
import { getSuscripcionByUsuario } from "@/actions/suscripcion-actions"
import SuscripcionInfo from "./_components/suscripcion-info"

export default async function PerfilPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [q: string]: string }>
}) {
    const { id } = await params
    const { q } = await searchParams

    if (!id) {
        notFound()
    }

    // Ejecutar consultas en paralelo
    const [cliente, publicaciones, resenas] = await Promise.all([
        getClienteById(id),
        id ? getPublicacionesByUsuario(Number(id), q) : Promise.resolve([]),
        id ? getResenasByUsuario(Number(id)) : Promise.resolve([])
    ])

    if (!cliente) {
        notFound()
    }


    const session = await getSession()


    const calificacion = !resenas || resenas.length === 0 ? 0 : resenas.reduce((acc, resena) => acc + resena.valoracion, 0) / resenas.length;


    const editable = session?.email === cliente.email && cliente.id.toString() === session?.userId

   
    
    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Banner y perfil */}
            <PerfilHeader usuario={cliente} editable={editable} />

            {/* Contenido principal */}
            <div className="container mx-auto px-4 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna lateral - Información del perfil */}
                    <div className="space-y-6">
                        {/* Información de contacto y personal */}
                        <PerfilInfo usuario={cliente} />

                        {/* Estadísticas del vendedor */}
                        <PerfilStats calificacion={calificacion} numResenas={resenas.length} favoritos={0} />

                        {/* Suscripción del usuario */}
                        {
                            editable && (
                                <SuscripcionInfo id_cliente={cliente.id} />
                            )
                        }
                        {/* Acciones (solo visible si no es el propio perfil) */}
                        {!editable && (
                            <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                                <h3 className="text-lg font-semibold mb-2">Acciones</h3>

                                <div>
                                    <MensajesProvider>
                                        <SendMessage id_cliente_perfil={cliente.id} />
                                    </MensajesProvider>
                                </div>

                                <div className="grid ">
                                    <Button variant="outline">
                                        <Star className="h-4 w-4 mr-2" />
                                        Calificar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Columna principal - Tabs con publicaciones y reseñas */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="publicaciones" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="publicaciones">Publicaciones</TabsTrigger>
                                <TabsTrigger value="resenas">Reseñas</TabsTrigger>
                            </TabsList>


                            <TabsContent value="publicaciones" className="mt-0">
                                {
                                    editable && (
                                        <PublicarBtn />
                                    )
                                }
                                <SearchBar baseUrl={`/perfil/${id}`} />
                                <PublicacionesGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-2" publicaciones={publicaciones} />
                            </TabsContent>

                            <TabsContent value="resenas" className="mt-0">
                                <PerfilReviews
                                    calificacion={calificacion}
                                    numResenas={resenas.length}
                                    resenas={resenas}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}

