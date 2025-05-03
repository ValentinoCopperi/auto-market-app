import React from 'react';
import { PerfilHeader } from './_components/perfil-header';
import { PerfilInfo } from './_components/perfil-info';
import { PerfilStats } from './_components/perfil-stats';
import { notFound } from 'next/navigation';
import { getClienteById } from '@/actions/clientes-actions';
import { getSession } from '@/lib/session/session';
import { BtnCalificar } from './_components/calificar/btn-calificar';
import SuscripcionInfo from './_components/suscripcion-info';
import { MensajesProvider } from '@/hooks/use-mensajes';
import SendMessage from './_components/send-message';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TabLinks from './_components/tab-links';
import { getResenasByUsuarioStats } from '@/actions/resenas-actions';

interface PerfilLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

const PerfilLayout = async ({ children, params }: PerfilLayoutProps) => {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const cliente = await getClienteById(id);
  if (!cliente) {
    notFound();
  }
  const calificaciones = await getResenasByUsuarioStats(Number(id));
  const session = await getSession();
  const editable = session?.email === cliente.email && cliente.id.toString() === session?.userId;



  // Define the tabs with their respective routes
  const tabs = [
    { value: 'publicaciones', label: 'Publicaciones', href: `/perfil/${id}/publicaciones` },
    { value: 'resenas', label: 'Reseñas', href: `/perfil/${id}/resenas` },
    { value: 'vendidos', label: 'Vendidos', href: `/perfil/${id}/vendidos` },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Banner y perfil */}
      <PerfilHeader usuario={cliente} editable={editable} />

      {/* Contenido principal */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna lateral - Información del perfil */}
          <div className="space-y-6">
            <PerfilInfo usuario={cliente} />
            <PerfilStats calificacion={calificaciones.promedio_valoracion} numResenas={calificaciones.total_resenas} favoritos={0} />
            {editable && <SuscripcionInfo id_cliente={cliente.id} />}
            {!editable && (
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="text-lg font-semibold mb-2">Acciones</h3>
                <MensajesProvider>
                  <SendMessage id_cliente_perfil={cliente.id} />
                </MensajesProvider>
                <BtnCalificar nombre={cliente.nombre} id_cliente={cliente.id} />
              </div>
            )}
          </div>

          {/* Columna principal - Tabs con publicaciones y reseñas */}
          <div className="lg:col-span-2">
            <div className="w-full">
              <TabLinks id={id} />
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilLayout;