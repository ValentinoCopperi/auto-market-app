
import { notFound } from "next/navigation"
import { getSession } from "@/lib/session/session"
import { PublicacionHeader } from "./_components/publicacion-header"
import { ImageCarousel } from "./_components/image-carrousel"
import { PublicacionDetails } from "./_components/publicacion-details"
import { PublicacionActions } from "./_components/publicacion-actions"
import { PublicacionContacto } from "./_components/publicacion-contacto"
import { VendedorCard } from "./_components/vendedor-card"
import { MensajesProvider } from "@/hooks/use-mensajes"
import { Marca, Publicacion, PublicacionCompleto } from "@/types/publicaciones"
import { unstable_cache } from "next/cache"
import { EditPublicationDialog } from "@/components/dialogs/editar-publicacion/editar-publicacion-dialog"
import { agregarVista } from "@/actions/publicaciones-actions"
import PublicacionEstadisticas from "./_components/publicacion-estadisticas"
import { puedeVerEstadisticas } from "@/lib/planes"



const getPublicacion =async   (id: string) : Promise<PublicacionCompleto> => {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/${id}`)

    if(!response.ok){
        notFound()
    }

    const data = await response.json()

    if(data.error){
        notFound()
    }

    return data.publicacion;
}

const esPublicacionFavorita = async (id: string, userId: string | undefined) : Promise<boolean> => {

    if(!userId){
        return false;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/publiaciones/favoritos`, {
        method: "POST",
        body: JSON.stringify({ publicacionId: id, userId })
    })
    if(!response.ok){
        return false;
    }
    const data = await response.json()
    return data.esFavorito
}


const PublicacionPage = async ({
    params,
}: {
    params: Promise<{ id: string }>
}) => {

    const { id } = await params;

    const session = await getSession()
    
    // Obtener la publicación con sus relaciones
    const [publicacion] = await Promise.all([getPublicacion(id)]);

    if (!publicacion) {
        notFound();
    }


    let esFavorito = false
    let verEstadisticas = false
    // Verificar si el usuario actual es el propietario de la publicación
    const esEditable = session?.userId.toString() === publicacion.cliente.id.toString()

    if(!esEditable && session?.userId){
        await agregarVista(publicacion.id,parseInt(session?.userId))
        esFavorito = await esPublicacionFavorita(id,session?.userId)
    }

    if(esEditable && session?.suscripcion){
        verEstadisticas = puedeVerEstadisticas(session?.suscripcion)
    }
   
    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna principal (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                   
                        {/* Encabezado móvil (visible solo en móvil) */}
                        <div className="block lg:hidden">
                            <PublicacionHeader publicacion={publicacion}/>
                        </div>

                        {/* Carrusel de imágenes */}
                        <ImageCarousel imagenes={publicacion.publicacion_imagenes} titulo={publicacion.titulo} />

                        {/* Encabezado desktop (visible solo en desktop) */}
                        <div className="hidden lg:block">
                            <PublicacionHeader publicacion={publicacion}/>
                            
                        </div>

                        {/* Detalles de la publicación */}
                        <PublicacionDetails publicacion={publicacion} />

                        

                        {/* Acciones de publicación (solo visible en móvil) */}
                        <div className="block lg:hidden space-y-4">
                            <PublicacionActions publicacion={publicacion} esEditable={esEditable} esFavorito={esFavorito} />
                            {
                                (esEditable) && (
                                    <PublicacionEstadisticas id_publicacion={publicacion.id} verEstadisticas={verEstadisticas} />
                                )
                            }
                        </div>
                    </div>

                    {/* Columna lateral (1/3) */}
                    <div className="space-y-6">
                        {/* Acciones de publicación (solo visible en desktop) */}
                        <div className="hidden lg:block space-y-4">
                            <PublicacionActions publicacion={publicacion} esEditable={esEditable} esFavorito={esFavorito} />
                            {
                                esEditable && (
                                    <PublicacionEstadisticas id_publicacion={publicacion.id} verEstadisticas={verEstadisticas} />
                                )
                            }
                        </div>

                        {/* Información de contacto */}
                        <MensajesProvider>
                            <PublicacionContacto telefono={publicacion.cliente.telefono} vendedorId={publicacion.cliente.id} esEditable={esEditable} />
                        </MensajesProvider>

                        {/* Tarjeta del vendedor */}
                        <VendedorCard vendedor={publicacion.cliente} />
                    </div>
                </div>
            </div>
        </div>
    )   
}

export default PublicacionPage;
