"use client"

import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { loginSchema, type LoginFormSchema } from "@/types/auth/login"
import { useAuth } from "@/hooks/use-auth"

export function LoginDialog() {
  const { isOpen, dialogType, closeDialog, openRegisterDialog } = useDialogStore()
  const open = isOpen && dialogType === "iniciar_sesion"
  const [showPassword, setShowPassword] = useState(false)
  
  const { login, loading, error, success } = useAuth()

  // Configurar el formulario con validación de Zod
  const form = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      contrasena: "",
    },
  })

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form

  

  const switchToRegister = () => {
    closeDialog()
    setTimeout(() => {
      openRegisterDialog()
    }, 100)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold">Iniciar Sesión</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Ingresa tus credenciales para acceder</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(login)} className="space-y-3 py-2">
            <FormField
              disabled={loading}
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="tu@email.com" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              disabled={loading}
              control={control}
              name="contrasena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Contraseña <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between mt-1">
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-800 text-white mt-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Iniciar Sesión"}
            </Button>

            {error && <p className="text-red-500 text-center mt-2">{error}</p>}
            {success && <p className="text-green-500 text-center mt-2">{success}</p>}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿No tienes una cuenta? </span>
              <button type="button" className="font-medium text-primary hover:underline" onClick={switchToRegister}>
                Regístrate
              </button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

