"use client"


import React, { useState } from 'react'
import { Button } from './ui/button'
import { Car, LogIn, House, Crown, User, ArrowUpFromLine, LogOut, MessageCircle, Heart, Rocket, ChevronDown, ArrowDown, Check, Settings, ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { MobileMenu } from './mobile-menu'
import { useDialogStore } from '@/lib/store/dialogs-store'
import { useAuth } from '@/hooks/use-auth'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import ConfigBtn from './config-btn'
export const links = [
  {
    href: "/",
    label: "Inicio",
    icon: <House className="h-4 w-4" />,
    required_auth: false
  },
  {
    href: "/publicaciones",
    label: "Publicaciones",
    icon: <Car className="h-4 w-4" />,
    required_auth: false
  },
  {
    href: '/suscripcion',
    label: 'Suscripcion',
    icon: <Crown className="h-4 w-4" />,
    required_auth: false
  }, {
    href: '/chat',
    label: 'Chat',
    icon: <MessageCircle className="h-4 w-4" />,
    required_auth: true
  }


]

const NavBar = () => {
  const [isHovered, setIsHovered] = useState(false)
  const { openLoginDialog, openPublishDialog } = useDialogStore()
  const { user, isAuthenticated, loading, logout } = useAuth()

  const handleDialog = () => {
    if (isAuthenticated) {
      openPublishDialog()
    } else {
      openLoginDialog()
    }
  }

  const handleLogout = async () => {
    await logout()
  }


  return (
    <header className="border-b border-border">
      <div className=" mx-auto w-[90%] py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Car className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold">AutoMarket</span>
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center space-x-5">
            {links.map((link) => (
              link.required_auth && !isAuthenticated ? null : (
                <Link key={link.href} href={link.href} className="flex items-center gap-2 hover:bg-muted p-2 rounded-md">
                  {link.icon}
                  {link.label}
                </Link>
              )
            ))}
            {/* Impulsamos Juntos - Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => !isHovered && setIsHovered(true)}
              onMouseLeave={() => isHovered && setIsHovered(false)}
            >
              <DropdownMenu open={isHovered} onOpenChange={setIsHovered}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="flex items-center gap-2 hover:bg-muted p-2 rounded-md data-[state=open]:bg-muted"
                  >
                    <Rocket className="h-4 w-4" />
                    Impulsamos Juntos
                    {
                      isHovered ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                    }
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48" sideOffset={5}>
                  <DropdownMenuItem asChild>
                    <Link href="/impulsamos-juntos/motorpoint" className="cursor-pointer w-full">
                      MotorPoint
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/impulsamos-juntos/rstronic" className="cursor-pointer w-full">
                      Rstronic
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/impulsamos-juntos/esp-off-performance" className="cursor-pointer w-full">
                      Esp Off Performance
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {isAuthenticated && (
              <Link href={`/perfil/${user?.id}`} className="flex items-center gap-2 hover:bg-muted p-2 rounded-md">
                <User className="h-4 w-4" />
                Perfil
              </Link>
            )}
            <div className="flex items-center gap-2">
              {/* Botón Iniciar Sesión - Acción primaria */}
              {isAuthenticated ? (
                <Button
                  disabled={loading}
                  onClick={handleLogout}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {loading ? "Cerrando sesión..." : "Cerrar Sesión"}
                </Button>
              ) : (
                <Button
                  disabled={loading}
                  onClick={openLoginDialog}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 cursor-pointer"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              )}

              {/* Botón Publicar - Acción secundaria */}
              <Button
                onClick={handleDialog}
                variant="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              >
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Publicar
              </Button>


            </div>
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <ModeToggle />

            {/* Boton Configuracion */}
            <ConfigBtn />

          </div>

          <MobileMenu />
        </div>
      </div >
    </header >
  )
}

export default NavBar