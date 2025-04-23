import { editarPerfil } from '@/actions/clientes-actions'
import { Button } from '@/components/ui/button'
import { DialogContent } from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import { DialogTitle } from '@/components/ui/dialog'
import { DialogHeader } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { editarPerfilSchema } from '@/types/auth/editar-perfil'
import { EditarPerfilFormSchema } from '@/types/auth/editar-perfil'
import { Cliente } from '@/types/cliente'
import { CIUDADES } from '@/types/filtros'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditModalProps {
  isEditModalOpen: boolean
  setIsEditModalOpen: (open: boolean) => void
  cliente: Cliente
}

const EditarPerfilDialog = ({ isEditModalOpen, setIsEditModalOpen, cliente }: EditModalProps) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(cliente.profile_img_url || null)
  const [bannerPreview, setBannerPreview] = useState<string | null>(cliente.banner_img_url || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [bannerFile, setBannerFile] = useState<File | null>(null)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)



  // Configurar formulario
  const form = useForm<EditarPerfilFormSchema>({
    resolver: zodResolver(editarPerfilSchema),
    defaultValues: {
      nombre: cliente.nombre,
      apellido: cliente.apellido || "",
      telefono: cliente.telefono.toString(),
      ciudad: cliente.ciudad,
      descripcion: cliente.descripcion || "",
    },
  })

  // Manejar cambio de avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const previewUrl = URL.createObjectURL(file)
      setAvatarPreview(previewUrl)
    }
  }

  // Manejar cambio de banner
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setBannerFile(file)
      const previewUrl = URL.createObjectURL(file)
      setBannerPreview(previewUrl)
    }
  }

  // Eliminar avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setAvatarFile(null)
    if (avatarInputRef.current) {
      avatarInputRef.current.value = ""
    }
  }

  // Eliminar banner
  const handleRemoveBanner = () => {
    setBannerPreview(null)
    setBannerFile(null)
    if (bannerInputRef.current) {
      bannerInputRef.current.value = ""
    }
  }

  // Enviar formulario
  const onSubmit = async (data: EditarPerfilFormSchema) => {
    setIsSubmitting(true)
    try {


      const new_profile_img = avatarFile ? avatarFile : null
      const new_banner_img = bannerFile ? bannerFile : null

      // Crear FormData para enviar archivos
      const new_data = {
        ...data,
        new_profile_img,
        new_banner_img
      }

      const response = await editarPerfil(cliente.id, new_data)

      if (response.error) {
        toast.error(response.message)
        setIsSubmitting(false)
        return
      } else {
        router.refresh()
        toast.success("Perfil actualizado")
      }
      setIsEditModalOpen(false)
    } catch (error) {
      toast.error("Error al actualizar perfil", {
        description: "No se pudo actualizar el perfil. Intenta nuevamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold">Edita tu perfil</DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">Edita tus datos para que sean más precisos</p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Sección de imágenes */}
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Imágenes de perfil</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar */}
                <div>
                  <FormLabel>Foto de perfil</FormLabel>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted">
                      {avatarPreview ? (
                        <>
                          <Image src={avatarPreview || "/placeholder.svg"} alt="Avatar" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="absolute top-0 right-0 bg-black/50 p-1 rounded-full"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                          {cliente.nombre.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div>
                      <input
                        type="file"
                        id="avatar"
                        ref={avatarInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="avatar">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <Camera className="h-4 w-4 mr-2" />
                            Cambiar foto
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG o GIF. Máximo 2MB.</p>
                    </div>
                  </div>
                </div>

                {/* Banner */}
                <div>
                  <FormLabel>Imagen de portada</FormLabel>
                  <div className="mt-2">
                    <div className="relative w-full h-32 rounded-md overflow-hidden bg-muted">
                      {bannerPreview ? (
                        <>
                          <Image src={bannerPreview || "/placeholder.svg"} alt="Banner" fill className="object-cover" />
                          <button
                            type="button"
                            onClick={handleRemoveBanner}
                            className="absolute top-2 right-2 bg-black/50 p-1 rounded-full"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                          Sin imagen de portada
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <input
                        type="file"
                        id="banner"
                        ref={bannerInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerChange}
                        disabled={isSubmitting}
                      />
                      <label htmlFor="banner">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>
                            <Upload className="h-4 w-4 mr-2" />
                            Cambiar portada
                          </span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">Recomendado: 1200 x 400 píxeles. Máximo 5MB.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información personal */}
            <div className="space-y-3">
              <h2 className="text-lg font-medium">Información personal</h2>

              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isSubmitting} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {
                  cliente.tipo_cliente !== "empresa" && (
                    <FormField
                      control={form.control}
                      name="apellido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellido</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={isSubmitting} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                }

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ciudad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <Select onValueChange={field.onChange} disabled={isSubmitting} defaultValue={field.value}>
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
              </div>

              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Cuéntanos sobre ti o tu experiencia en el mercado automotor..."
                        className="resize-none"
                        rows={3}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">{field.value?.length || 0}/160 caracteres</p>
                  </FormItem>
                )}
              />
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-900 hover:bg-blue-800 text-white" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditarPerfilDialog