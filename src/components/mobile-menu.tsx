"use client"

import { useState } from "react"
import Link from "next/link"
import { Car, LogIn, Menu, User, ArrowUpFromLine, LogOut, Rocket, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { links } from "./navbar"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { useAuth } from "@/hooks/use-auth"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ConfigBtn from "./config-btn"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const { openPublishDialog, openLoginDialog } = useDialogStore()
  const { isAuthenticated, user, loading, logout } = useAuth()
  const pathname = usePathname()

  const handleDialog = () => {
    setOpen(false)
    if (isAuthenticated) {
      openPublishDialog()
    } else {
      openLoginDialog()
    }
  }

  const handleLogout = async () => {
    await logout()
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="lg:hidden">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] sm:w-[350px] p-0">
        <SheetHeader className="text-left p-4 border-b border-border pt-10">
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
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
              <span className="text-xl font-bold">AutoMarket</span>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <ConfigBtn />
            </div>
          </SheetTitle>
          <div className="text-sm text-muted-foreground mt-1">
            {isAuthenticated ? `Hola, ${user?.email?.split("@")[0] || "Usuario"}` : "Menú de navegación"}
          </div>
        </SheetHeader>

        <div className="flex flex-col divide-y divide-border/30 max-h-[calc(100vh-180px)] overflow-y-auto">
          {links
            .filter((link) => !link.required_auth || (link.required_auth && isAuthenticated))
            .map((link) => (
              <SheetClose asChild key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 text-base font-medium transition-colors",
                    pathname === link.href ? "bg-muted/50 text-foreground" : "hover:bg-muted/30 hover:text-foreground",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-md", pathname === link.href ? "bg-primary/10" : "bg-muted")}>
                      {link.icon}
                    </div>
                    {link.label}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </SheetClose>
            ))}

          <Accordion type="single" collapsible className="w-full border-none">
            <AccordionItem value="impulsamos-juntos" className="border-none">
              <AccordionTrigger
                className={cn(
                  "flex items-center px-4 py-3.5 text-base font-medium transition-colors hover:bg-muted/30 hover:no-underline",
                  pathname.startsWith("/impulsamos-juntos") ? "bg-muted/50 text-foreground" : "",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-2 rounded-md",
                      pathname.startsWith("/impulsamos-juntos") ? "bg-primary/10" : "bg-muted",
                    )}
                  >
                    <Rocket className="h-4 w-4" />
                  </div>
                  Impulsamos Juntos
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-0 pt-1">
                <div className="flex flex-col border-l-2 border-muted ml-9 pl-4">
                  <SheetClose asChild>
                    <Link
                      href="/impulsamos-juntos/motorpoint"
                      className={cn(
                        "py-3 text-base hover:text-primary transition-colors",
                        pathname === "/impulsamos-juntos/motorpoint"
                          ? "text-primary font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      MotorPoint
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/impulsamos-juntos/rstronic"
                      className={cn(
                        "py-3 text-base hover:text-primary transition-colors",
                        pathname === "/impulsamos-juntos/rstronic"
                          ? "text-primary font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      Rstronic
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/impulsamos-juntos/esp-off-performance"
                      className={cn(
                        "py-3 text-base hover:text-primary transition-colors",
                        pathname === "/impulsamos-juntos/esp-off-performance"
                          ? "text-primary font-medium"
                          : "text-muted-foreground",
                      )}
                    >
                      Esp Off Performance
                    </Link>
                  </SheetClose>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {isAuthenticated && (
            <SheetClose asChild>
              <Link
                href={`/perfil/${user?.id}`}
                className={cn(
                  "flex items-center justify-between px-4 py-3.5 text-base font-medium transition-colors",
                  pathname === `/perfil/${user?.id}`
                    ? "bg-muted/50 text-foreground"
                    : "hover:bg-muted/30 hover:text-foreground",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn("p-2 rounded-md", pathname === `/perfil/${user?.id}` ? "bg-primary/10" : "bg-muted")}
                  >
                    <User className="h-4 w-4" />
                  </div>
                  Perfil
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </SheetClose>
          )}
        </div>

        <SheetFooter className="flex-col gap-2 p-4 border-t border-border mt-auto">
          <div className="flex items-center justify-between gap-2 w-full">
            {isAuthenticated ? (
              <Button onClick={handleLogout} disabled={loading} variant="outline" className="flex-1 border-border bg-blue-600 text-white dark:bg-blue-600 dark:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                {loading ? "Cerrando..." : "Cerrar Sesión"}
              </Button>
            ) : (
              <Button
                disabled={loading}
                onClick={() => {
                  setOpen(false)
                  openLoginDialog()
                }}
                variant="outline"
                className="flex-1 border-border bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
            <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleDialog}>
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              Publicar
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
