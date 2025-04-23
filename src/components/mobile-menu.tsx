"use client"

import { useState } from "react"
import Link from "next/link"
import { Car, Crown, HomeIcon as House, LogIn, Menu, User, X, ArrowUpFromLine, LogOut, Heart, ChevronDown, Rocket, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"
import { links } from "./navbar"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { useAuth } from "@/hooks/use-auth"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import ConfigBtn from "./config-btn"


export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const[openConfig,setOpenConfig] = useState(false)
  const { openPublishDialog, openLoginDialog } = useDialogStore()

  const { isAuthenticated, user, loading, logout } = useAuth()

  const handleDialog = () => {
    if (isAuthenticated) {
      openPublishDialog()
    } else {
      openLoginDialog()
    }
  }


  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-around p-4 border-b">
            <div className="flex items-center space-x-2">
              <Car className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-bold">AutoMarket</span>
            </div>

            <div className="flex items-center gap-2 pr-3">
              <ModeToggle />
              <ConfigBtn />
            </div>


          </div>

          <nav className="flex flex-col p-4 max-h-[calc(100vh-100px)] overflow-y-auto">
            {
              links.map((link) => (
                link.required_auth && !isAuthenticated ? null : (
                  <Link key={link.href} href={link.href} className="flex items-center gap-3 py-4 text-lg font-medium border-b border-border/30 hover:text-primary transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                )
              ))
            }

            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="flex items-center gap-3 py-4 text-lg font-medium border-b border-border/30 hover:text-primary transition-colors" onClick={() => setOpenConfig(!openConfig)}>
                  <Rocket className="h-4 w-4" />
                  Impulsamos Juntos
                  {
                    openConfig ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                  }
                </AccordionTrigger>
                <AccordionContent>
                  <Link href="/impulsamos-juntos/motorpoint" className="flex items-center gap-3 py-2 text-md font-light border-b border-border/30 hover:text-primary transition-colors">
                    MotorPoint
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link href="/impulsamos-juntos/rstronic" className="flex items-center gap-3 py-2 text-md font-light border-b border-border/30 hover:text-primary transition-colors">
                    Rstronic
                  </Link>
                </AccordionContent>
                <AccordionContent>
                  <Link href="/impulsamos-juntos/esp-off-performance" className="flex items-center gap-3 py-2 text-md font-light border-b border-border/30 hover:text-primary transition-colors">
                    Esp Off Performance
                  </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>


            {isAuthenticated && (
              <Link href={`/perfil/${user?.id}`} className="flex items-center gap-3 py-4 text-lg font-medium border-b border-border/30 hover:text-primary transition-colors">
                <User className="h-4 w-4" />
                Perfil
              </Link>
            )}
          </nav>

          <div className="mt-auto p-4 border-t">

            <div className="flex items-center justify-between gap-4">
              {isAuthenticated ? (
                <Button
                  onClick={logout}
                  disabled={loading}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200 cursor-pointer"
                >
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
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer" onClick={handleDialog}>
                <ArrowUpFromLine className="h-4 w-4 mr-2" />
                Publicar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

