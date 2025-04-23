import { Publicacion } from '@/types/publicaciones';
import PublicacionCard from './publicacion-card';
import { cn } from '@/lib/utils';
interface PublicacionesGridProps {
  publicaciones: Publicacion[],
  className?: string
}


export const PublicacionesGrid = ({ publicaciones, className }: PublicacionesGridProps) => {
  return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8", className)}>
        {publicaciones.length === 0 || !publicaciones ? (
          <div className="text-center text-muted-foreground">No se encontraron publicaciones</div>
        ) : (
          publicaciones.map((publicacion) => (
            <PublicacionCard key={publicacion.id} publicacion={publicacion} />
          ))
        )}
      </div>
  )
}
