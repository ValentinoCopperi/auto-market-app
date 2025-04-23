"use client"

import { useState } from "react"
import { X, Eye, EyeOff, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CIUDADES } from "@/types/filtros"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { registroSchema, type RegistroFormSchema } from "@/types/auth/registro"
import { useAuth } from "@/hooks/use-auth"


export function RegisterDialog() {
    const { isOpen, dialogType, closeDialog, openLoginDialog } = useDialogStore()
    const open = isOpen && dialogType === "registrarse"
    const [showPassword, setShowPassword] = useState(false)

    const {register,error,success,loading} = useAuth()

    // Configurar el formulario con validación de Zod
    const form = useForm<RegistroFormSchema>({
        resolver: zodResolver(registroSchema),
        defaultValues: {
            nombre: "",
            apellido: "",
            email: "",
            telefono: "",
            ciudad: "",
            tipo_cliente: "personal",
            contrasena: "",
        },
    })

    const {
        control,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form
    const tipoCliente = watch("tipo_cliente")

 
    const switchToLogin = () => {
        closeDialog()
        setTimeout(() => {
            openLoginDialog()
        }, 100)
    }



    return (
        <Dialog open={open} onOpenChange={(open) => !open && closeDialog()}>
            <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-2">
                    <DialogTitle className="text-xl font-bold">Crear Cuenta</DialogTitle>
                    
                    <p className="text-sm text-muted-foreground mt-1">Completa tus datos para registrarte</p>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={handleSubmit(register)} className="space-y-3 py-2">
                        <FormField
                            control={control}
                            name="tipo_cliente"
                            render={({ field }) => (
                                <FormItem className="space-y-1 mb-2">
                                    <FormLabel>
                                        Tipo de cliente <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup disabled={loading} onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 py-2">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="personal" id="personal" />
                                                <Label htmlFor="personal" className="flex items-center gap-1 cursor-pointer">
                                                    <User className="h-4 w-4" /> Personal
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="empresa" id="empresa" />
                                                <Label htmlFor="empresa" className="flex items-center gap-1 cursor-pointer">
                                                    <Building2 className="h-4 w-4" /> Empresa
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                            <FormField
                                control={control}
                                disabled={loading}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            {tipoCliente === "personal" ? "Nombre" : "Nombre de la empresa"}{" "}
                                            <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder={tipoCliente === "personal" ? "Juan" : "AutoMarket S.A."} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {tipoCliente === "personal" && (
                                <FormField
                                    control={control}
                                    disabled={loading}
                                    name="apellido"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Apellido <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pérez" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}


                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <FormField
                                control={control}
                                disabled={loading}
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
                                control={control}
                                disabled={loading}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Teléfono <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+54 11 1234-5678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            disabled={loading}
                            name="ciudad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Ciudad <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona tu ciudad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CIUDADES.map((ciudad) => (
                                                <SelectItem key={ciudad} value={ciudad}>
                                                    {ciudad}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            disabled={loading}
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
                                                autoComplete="new-password"
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
                                    <div className="flex flex-col">
                                        <FormMessage />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            La contraseña debe tener al menos 8 caracteres.
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center space-x-2 mt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                required
                            />
                            <label htmlFor="terms" className="text-sm">
                                Acepto los{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Términos y Condiciones
                                </a>{" "}
                                y la{" "}
                                <a href="#" className="text-primary hover:underline">
                                    Política de Privacidad
                                </a>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-900 hover:bg-blue-800 text-white mt-3"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Procesando..." : "Crear Cuenta"}
                        </Button>

                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                        {success && <p className="text-green-500 text-center mt-2">{success}</p>}

                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">¿Ya tienes una cuenta? </span>
                            <button type="button" className="font-medium text-primary hover:underline" onClick={switchToLogin}>
                                Inicia sesión
                            </button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

