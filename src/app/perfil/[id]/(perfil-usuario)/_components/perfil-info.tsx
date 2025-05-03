import { Mail, Phone, MapPin, Building2, User, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Cliente } from "@/types/cliente"


interface PerfilInfoProps {
  usuario: Cliente
}

export function PerfilInfo({ usuario }: PerfilInfoProps) {


  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>

      <div className="space-y-4">
        {/* Tipo de cliente */}
        <div className="flex items-center gap-2">
          {usuario.tipo_cliente === "empresa" ? (
            <Building2 className="h-5 w-5 text-muted-foreground" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <span className="text-sm text-muted-foreground">Tipo de cuenta</span>
            <p className="font-medium">
              {usuario.tipo_cliente === "empresa" ? "Empresa" : "Particular"}
              {usuario.admin && <Badge className="ml-2 bg-blue-500 hover:bg-blue-600">Admin</Badge>}
            </p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Email</span>
            <p className="font-medium">{usuario.email}</p>
          </div>
        </div>

        {/* Teléfono */}
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Teléfono</span>
            <p className="font-medium">{usuario.telefono}</p>
          </div>
        </div>

        {/* Ciudad */}
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <span className="text-sm text-muted-foreground">Ubicación</span>
            <p className="font-medium">{usuario.ciudad}</p>
          </div>
        </div>

       
      </div>

      {/* Biografía o descripción */}
      {usuario.bio && (
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="font-medium mb-2">Acerca de</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{usuario.bio}</p>
        </div>
      )}
    </div>
  )
}

