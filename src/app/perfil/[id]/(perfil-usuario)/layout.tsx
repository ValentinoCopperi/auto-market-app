import type React from "react"
import { PerfilHeader } from "./_components/perfil-header"
import { PerfilInfo } from "./_components/perfil-info"
import { PerfilStats } from "./_components/perfil-stats"
import { notFound } from "next/navigation"
import { getClienteById } from "@/actions/clientes-actions"
import { getSession } from "@/lib/session/session"
import { BtnCalificar } from "./_components/calificar/btn-calificar"
import SuscripcionInfo from "./_components/suscripcion-info"
import { MensajesProvider } from "@/hooks/use-mensajes"
import SendMessage from "./_components/send-message"
import TabLinks from "./_components/tab-links"
import { getResenasByUsuarioStats } from "@/actions/resenas-actions"

interface PerfilLayoutProps {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

const PerfilLayout = async ({ children, params }: PerfilLayoutProps) => {
  const { id } = await params

  if (!id) {
    notFound()
  }

  const cliente = await getClienteById(id)
  if (!cliente) {
    notFound()
  }
  const calificaciones = await getResenasByUsuarioStats(Number(id))
  const session = await getSession()
  const editable = session?.email === cliente.email && cliente.id.toString() === session?.userId

  return (
    <div className="min-h-screen bg-background">
      {/* Banner y perfil */}
      <PerfilHeader usuario={cliente} editable={editable} />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Columna lateral - Información del perfil */}
          <div className="lg:col-span-4 space-y-6">
            <div className="lg:sticky lg:top-4 space-y-6">
              <PerfilInfo usuario={cliente} />
              <PerfilStats
                calificacion={calificaciones.promedio_valoracion}
                numResenas={calificaciones.total_resenas}
                editable={editable}
              />
              {editable && <SuscripcionInfo id_cliente={cliente.id} />}
              {!editable && (
                <div className="hidden lg:block bg-card rounded-lg border border-border p-6 space-y-4 shadow-sm">
                  <h3 className="text-lg font-semibold">Acciones</h3>
                  <div className="space-y-3">
                    <MensajesProvider>
                      <SendMessage id_cliente_perfil={cliente.id} />
                    </MensajesProvider>
                    <BtnCalificar nombre={cliente.nombre} id_cliente={cliente.id} />
                  </div>
                </div>
              )}
              {!editable && (
                <div className="lg:hidden">
                  <MensajesProvider>
                    <SendMessage id_cliente_perfil={cliente.id} />
                  </MensajesProvider>
                  <div className="mt-4">
                    <BtnCalificar nombre={cliente.nombre} id_cliente={cliente.id} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Columna principal - Tabs con publicaciones y reseñas */}
          <div className="lg:col-span-8">
            <div className="bg-card rounded-lg border border-border shadow-sm">
              <TabLinks id={id} />
              <div className="p-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerfilLayout
