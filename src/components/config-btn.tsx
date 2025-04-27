import Link from "next/link"
import {
    User,
    Car,
    Heart,
    MessageSquare,
    History,
    Tag,
    Star,
    Receipt,
    CreditCard,
    Wallet,
    Bell,
    Shield,
    Settings,
    HelpCircle,
    LogOut,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
const ConfigBtn = () => {
    const { isAuthenticated, user, loading, logout } = useAuth()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64" sideOffset={5}>
                <div className="py-2 px-3 font-medium border-b">Mi Cuenta</div>

                {
                    isAuthenticated && (
                        <>
                            <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                                <Link href={`/perfil/${user?.id}`} className="cursor-pointer w-full">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">Mi Perfil</span>
                                            <span className="text-xs text-muted-foreground">Ver y editar tu información personal</span>
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </>
                    )
                }



                <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                    <Link href="/favoritos" className="cursor-pointer w-full">
                        <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">Favoritos</span>
                                <span className="text-xs text-muted-foreground">Vehículos guardados</span>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                    <Link href="/chat" className="cursor-pointer w-full">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">Mensajes</span>
                                <span className="text-xs text-muted-foreground">Centro de mensajes</span>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>





                <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                    <Link href="/resenas" className="cursor-pointer w-full">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">Reputación</span>
                                <span className="text-xs text-muted-foreground">Tu puntuación y reseñas</span>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>

              

                <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                    <Link href={isAuthenticated ? `/perfil/${user?.id}/suscripcion` : "/suscripcion"} className="cursor-pointer w-full">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">Suscripción</span>
                                <span className="text-xs text-muted-foreground">Gestiona tu plan</span>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>

               

                <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                    <Link href="/configuracion" className="cursor-pointer w-full">
                        <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">Configuración</span>
                                <span className="text-xs text-muted-foreground">Ajustes de la cuenta</span>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild className="py-2 flex flex-col items-start">
                    <Link href="/contacto" className="cursor-pointer w-full">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            <div className="flex flex-col">
                                <span className="font-medium">Contacto</span>
                                <span className="text-xs text-muted-foreground">Centro de contacto</span>
                            </div>
                        </div>
                    </Link>
                </DropdownMenuItem>

                {
                    isAuthenticated && (
                        <DropdownMenuItem asChild className="py-2 flex flex-col items-start border-t mt-1">
                            <Button className={cn(buttonVariants({ variant: "destructive" }), "cursor-pointer w-full")} onClick={logout} disabled={loading}>
                                <div className="flex items-center gap-2">
                                    <div className="flex flex-col">
                                        <span className="font-medium">Cerrar Sesión</span>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuItem>
                    )
                }
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ConfigBtn
