"use client"

import { editarPerfil } from "@/actions/clientes-actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { editarPerfilSchema } from "@/types/auth/editar-perfil"
import type { EditarPerfilFormSchema } from "@/types/auth/editar-perfil"
import type { Cliente } from "@/types/cliente"
import { CIUDADES } from "@/types/filtros"
import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, Upload, X, Check, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type React from "react"
import { useRef, useState, useCallback } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

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

  // Estados para el recorte de imágenes
  const [cropMode, setCropMode] = useState<"avatar" | "banner" | null>(null)
  const [imageToCrop, setImageToCrop] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

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

  // Función para inicializar el recorte cuando se carga una imagen
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget

      if (cropMode === "avatar") {
        // Para avatar, usamos un recorte cuadrado (1:1)
        const crop = centerCrop(
          makeAspectCrop(
            {
              unit: "%",
              width: 70,
            },
            1, // Relación de aspecto 1:1 para avatar
            width,
            height,
          ),
          width,
          height,
        )
        setCrop(crop)
      } else {
        // For banner, use a wider panoramic ratio that matches your container
        const bannerAspectRatio = 5; // 5:1 ratio is more appropriate for wide banners
        const crop = centerCrop(
          makeAspectCrop(
            {
              unit: "%",
              width: 90,
            },
            bannerAspectRatio, // Wider aspect ratio for banner
            width,
            height,
          ),
          width,
          height,
        )
        setCrop(crop)
      }
    },
    [cropMode],
  )

  // Función para procesar la imagen recortada
  const handleCropComplete = () => {
    if (!imgRef.current || !completedCrop) {
      return
    }

    // Crear un canvas para el recorte
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      toast.error("No se pudo procesar la imagen")
      return
    }

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height

    canvas.width = completedCrop.width * scaleX
    canvas.height = completedCrop.height * scaleY

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    )

    // Convertir el canvas a un Blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Error al procesar la imagen")
          return
        }

        // Crear un archivo a partir del blob
        const fileName = cropMode === "avatar" ? "avatar.jpg" : "banner.jpg"
        const file = new File([blob], fileName, { type: "image/jpeg" })

        // Actualizar el estado según el tipo de imagen
        if (cropMode === "avatar") {
          setAvatarFile(file)
          const previewUrl = URL.createObjectURL(blob)
          setAvatarPreview(previewUrl)
        } else {
          setBannerFile(file)
          const previewUrl = URL.createObjectURL(blob)
          setBannerPreview(previewUrl)
        }

        // Salir del modo de recorte
        setCropMode(null)
        setImageToCrop(null)
      },
      "image/jpeg",
      0.95,
    )
  }

  // Manejar selección inicial de archivos para avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024 * 2) {
        toast.error("El tamaño de la imagen debe ser menor a 2MB")
        return
      }

      // Leer el archivo como URL de datos
      const reader = new FileReader()
      reader.onload = () => {
        setCropMode("avatar")
        setImageToCrop(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    // Limpiar el input
    e.target.value = ""
  }

  // Manejar selección inicial de archivos para banner
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 1024 * 1024 * 5) {
        toast.error("El tamaño de la imagen debe ser menor a 5MB")
        return
      }

      // Leer el archivo como URL de datos
      const reader = new FileReader()
      reader.onload = () => {
        setCropMode("banner")
        setImageToCrop(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
    // Limpiar el input
    e.target.value = ""
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

  // Cancelar recorte
  const handleCancelCrop = () => {
    setCropMode(null)
    setImageToCrop(null)
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
        new_banner_img,
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

  // Renderizar el modo de recorte
  if (cropMode && imageToCrop) {
    return (
      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl font-bold">
              {cropMode === "avatar" ? "Recortar foto de perfil" : "Recortar imagen de portada"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {cropMode === "avatar"
                ? "Ajusta el área para obtener la mejor vista de tu foto de perfil"
                : "Ajusta el área para obtener la mejor vista de tu imagen de portada"}
            </p>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            <div className="max-h-[60vh] overflow-auto w-full">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={cropMode === "avatar" ? 1 : 16 / 5}
                circularCrop={cropMode === "avatar"}
                className="max-w-full mx-auto"
              >
                <img
                  ref={imgRef}
                  src={imageToCrop || "/placeholder.svg"}
                  alt="Imagen para recortar"
                  onLoad={onImageLoad}
                  className="max-w-full"
                />
              </ReactCrop>
            </div>

            <div className="flex justify-between w-full pt-4">
              <Button type="button" variant="outline" onClick={handleCancelCrop}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>

              <Button
                type="button"
                onClick={handleCropComplete}
                disabled={!completedCrop?.width || !completedCrop?.height}
              >
                <Check className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
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

                {cliente.tipo_cliente !== "empresa" && (
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
                )}

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} disabled={isSubmitting} />
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
