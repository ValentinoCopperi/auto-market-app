"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import {
  Car,
  LogIn,
  HomeIcon as House,
  Crown,
  User,
  ArrowUpFromLine,
  LogOut,
  MessageCircle,
  Rocket,
  ChevronDown,
} from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { MobileMenu } from "./mobile-menu"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu"
import ConfigBtn from "./config-btn"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export const links = [
  {
    href: "/",
    label: "Inicio",
    icon: <House className="h-4 w-4" />,
    required_auth: false,
  },
  {
    href: "/publicaciones",
    label: "Publicaciones",
    icon: <Car className="h-4 w-4" />,
    required_auth: false,
  },
  {
    href: "/suscripcion",
    label: "Suscripción",
    icon: <Crown className="h-4 w-4" />,
    required_auth: false,
  },
  {
    href: "/chat",
    label: "Chat",
    icon: <MessageCircle className="h-4 w-4" />,
    required_auth: true,
  },
]

const NavBar = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { openLoginDialog, openPublishDialog } = useDialogStore()
  const { user, isAuthenticated, loading, logout } = useAuth()
  const pathname = usePathname()

  // Detect scroll position to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-1"
          : "bg-background border-b border-border py-2",
      )}
    >
      <div className="container mx-auto py-3 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="bg-blue-600 text-white p-1 rounded mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <path d="M9 17h6" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          </div>
          <span className="text-xl font-bold">CarMarket</span>
        </Link>

        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center space-x-1">
            {links.map((link) =>
              link.required_auth && !isAuthenticated ? null : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-md font-medium transition-colors",
                    pathname === link.href
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  )}
                >
                  {link.icon}
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ),
            )}

            {/* Impulsamos Juntos - Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => !isHovered && setIsHovered(true)}
              onMouseLeave={() => isHovered && setIsHovered(false)}
            >
              <DropdownMenu open={isHovered} onOpenChange={setIsHovered}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      pathname.startsWith("/impulsamos-juntos")
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    <Rocket className="h-4 w-4" />
                    Impulsamos Juntos
                    <motion.div animate={{ rotate: isHovered ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="h-4 w-4" />
                    </motion.div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-56" sideOffset={8}>
                  <div className="p-2 text-xs font-medium text-muted-foreground">Nuestros aliados</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/impulsamos-juntos/dynaco-consulting" className="cursor-pointer w-full flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Dynaco Consulting
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/impulsamos-juntos/esp-off-performance"
                      className="cursor-pointer w-full flex items-center gap-2"
                    >
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      Esp Off Performance
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {isAuthenticated && (
              <Link
                href={`/perfil/${user?.id}/publicaciones`}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === `/perfil/${user?.id}/publicaciones`
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <User className="h-4 w-4" />
                Perfil
              </Link>
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {/* Botones de autenticación */}
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Button
                  disabled={loading}
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-sm font-medium border-border bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {loading ? "Cerrando..." : "Salir"}
                </Button>
              ) : (
                <Button
                  disabled={loading}
                  onClick={openLoginDialog}
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-sm font-medium border-border bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Iniciar Sesión
                </Button>
              )}

              {/* Botón Publicar */}
              <Button
                onClick={handleDialog}
                variant="default"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 text-sm font-medium"
              >
                <ArrowUpFromLine className="h-3.5 w-3.5" />
                Publicar
              </Button>
            </div>

            <div className="flex items-center pl-2 border-l border-border space-x-1">
              <ModeToggle />
              <ConfigBtn />
            </div>
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  )
}

export default NavBar
