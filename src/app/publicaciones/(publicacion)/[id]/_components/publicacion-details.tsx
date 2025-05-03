import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PublicacionCompleto } from "@/types/publicaciones"



interface PublicacionDetailsProps {
  publicacion: PublicacionCompleto
}

export function PublicacionDetails({ publicacion }: PublicacionDetailsProps) {
  return (
    <Tabs defaultValue="descripcion" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="descripcion">Descripción</TabsTrigger>
        <TabsTrigger value="caracteristicas">Características</TabsTrigger>
      </TabsList>

      <TabsContent value="descripcion" className="mt-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-lg font-semibold mb-3">Descripción</h3>
          <div className="prose prose-sm max-w-none">
            {publicacion.descripcion ? (
              <p className="whitespace-pre-line">{publicacion.descripcion}</p>
            ) : (
              <p className="text-muted-foreground">No hay descripción disponible.</p>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="caracteristicas" className="mt-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="text-lg font-semibold mb-3">Características</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Marca</span>
                <span className="font-medium">{publicacion.marca?.nombre || "No especificado"}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Año</span>
                <span className="font-medium">{publicacion.anio}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Kilometraje</span>
                <span className="font-medium">{publicacion.kilometraje.toLocaleString()} km</span>
              </div>

              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Color</span>
                <span className="font-medium">{publicacion.color || "No especificado"}</span>
              </div>

            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Combustible</span>
                <span className="font-medium">{publicacion.tipo_combustible || "No especificado"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Transmisión</span>
                <span className="font-medium">{publicacion.tipo_transmision || "No especificado"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/50">
                <span className="text-muted-foreground">Categoria</span>
                <span className="font-medium">{publicacion.categoria|| "No especificado"}</span>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

