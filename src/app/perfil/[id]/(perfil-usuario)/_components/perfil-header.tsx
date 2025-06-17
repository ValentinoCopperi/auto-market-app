"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Pencil, Upload, Star, Camera, Loader2, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Cliente } from "@/types/cliente"
import { updateProfileBannerImage, updateProfileImage } from "@/actions/clientes-actions"
import { toast } from "sonner"
import EditarPerfilDialog from "@/components/dialogs/editar-perfil/editar-perfil-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"
import { Badge } from "@/components/ui/badge"

interface PerfilHeaderProps {
  usuario: Cliente
  editable?: boolean
  onBannerChange?: (file: File) => void
  onAvatarChange?: (file: File) => void
}

export function PerfilHeader({ usuario, editable = false, onBannerChange, onAvatarChange }: PerfilHeaderProps) {
  const [isHoveringBanner, setIsHoveringBanner] = useState(false)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)
  const [isLoadingBanner, setIsLoadingBanner] = useState(false)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)
  const [banner_img_url, setBanner_img_url] = useState(
    usuario.banner_img_url ? usuario.banner_img_url : "/fondo-negro.webp",
  )
  const [profile_img_url, setProfile_img_url] = useState(
    usuario.profile_img_url ? usuario.profile_img_url : "/not_image.webp",
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Estado para el recorte de imágenes
  const [cropDialogOpen, setCropDialogOpen] = useState(false)
  const [cropType, setCropType] = useState<"banner" | "avatar">("banner")
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  // Referencias a los inputs de tipo file
  const bannerInputRef = useRef<HTMLInputElement>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)

  const nombreCompleto = `${usuario.nombre} ${usuario?.apellido || ""}`
  const calificacion = 0
  const numResenas = 0

  const handleEditarPerfil = () => {
    setIsEditModalOpen(true)
  }

  const handleCambiarBanner = () => {
    if (bannerInputRef.current) {
      bannerInputRef.current.click()
    }
  }

  const handleCambiarAvatar = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click()
    }
  }

  // Función para inicializar el recorte cuando se carga una imagen
  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget

      // Diferentes configuraciones de recorte según el tipo (banner o avatar)
      if (cropType === "avatar") {
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
        // Para banner, usamos un recorte panorámico (16:5 o similar)
        const crop = centerCrop(
          makeAspectCrop(
            {
              unit: "%",
              width: 90,
            },
            16 / 5, // Relación de aspecto para banner
            width,
            height,
          ),
          width,
          height,
        )
        setCrop(crop)
      }
    },
    [cropType],
  )

  // Función para procesar y subir la imagen recortada
  const handleCropComplete = async () => {
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

    canvas.width = completedCrop.width
    canvas.height = completedCrop.height

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height,
    )

    // Convertir el canvas a un Blob
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          toast.error("Error al procesar la imagen")
          return
        }

        // Crear un archivo a partir del blob
        const file = new File([blob], cropType === "banner" ? "banner.jpg" : "avatar.jpg", {
          type: "image/jpeg",
        })

        // Subir la imagen según el tipo
        if (cropType === "banner") {
          setIsLoadingBanner(true)
          const response = await updateProfileBannerImage(usuario.id, file)
          setIsLoadingBanner(false)

          if (response.error) {
            toast.error(response.message)
          } else if (response.data) {
            setBanner_img_url(response.data)
            toast.success(response.message)
          }
        } else {
          setIsLoadingAvatar(true)
          const response = await updateProfileImage(usuario.id, file)
          setIsLoadingAvatar(false)

          if (response.error) {
            toast.error(response.message)
          } else if (response.data) {
            setProfile_img_url(response.data)
            toast.success(response.message)
          }
        }

        // Cerrar el diálogo y limpiar
        setCropDialogOpen(false)
        setImageSrc(null)
      },
      "image/jpeg",
      0.95,
    )
  }

  // Manejar la selección inicial de archivos
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "banner" | "avatar") => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    if (file.size > 1024 * 1024 * 5) {
      toast.error("El tamaño de la imagen debe ser menor a 5MB")
      return
    }

    // Leer el archivo como URL de datos
    const reader = new FileReader()
    reader.onload = () => {
      setCropType(type)
      setImageSrc(reader.result as string)
      setCropDialogOpen(true)
    }
    reader.readAsDataURL(file)

    // Limpiar el input
    e.target.value = ""
  }

  return (
    <div className="relative">
      {/* Inputs ocultos para seleccionar archivos */}
      <input
        type="file"
        ref={bannerInputRef}
        onChange={(e) => handleFileSelect(e, "banner")}
        accept="image/*"
        className="hidden"
        aria-label="Seleccionar imagen de banner"
      />

      <input
        type="file"
        ref={avatarInputRef}
        onChange={(e) => handleFileSelect(e, "avatar")}
        accept="image/*"
        className="hidden"
        aria-label="Seleccionar imagen de perfil"
      />

      {/* Banner - Altura optimizada para mobile */}
      <div
        className="relative w-full h-[160px] sm:h-[200px] lg:h-[250px] bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden"
        onMouseEnter={() => editable && setIsHoveringBanner(true)}
        onMouseLeave={() => editable && setIsHoveringBanner(false)}
      >
        {banner_img_url && (
          <Image
            src={banner_img_url || "/placeholder.svg"}
            alt="Banner de perfil"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-center"
            priority
            quality={90}
          />
        )}
        {isLoadingBanner && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        {/* Overlay para oscurecer ligeramente el banner */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Botón para cambiar banner */}
        {editable && (
          <Button
            variant="secondary"
            size="sm"
            className={`absolute right-2 top-2 sm:right-4 sm:top-4 transition-opacity duration-200 text-xs sm:text-sm ${
              isHoveringBanner ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleCambiarBanner}
          >
            <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Cambiar Banner</span>
            <span className="sm:hidden">Banner</span>
          </Button>
        )}
      </div>

      {/* Contenedor principal - Nuevo diseño */}
      <div className="container mx-auto px-4">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="relative bg-card rounded-lg border border-border -mt-8 pt-4 pb-6">
            {/* Avatar centrado en mobile */}
            <div className="flex justify-center -mt-16 mb-4">
              <div
                className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]"
                onMouseEnter={() => editable && setIsHoveringAvatar(true)}
                onMouseLeave={() => editable && setIsHoveringAvatar(false)}
              >
                <div className="relative w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted shadow-lg">
                  {isLoadingAvatar ? (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <Loader2 className="h-8 w-8 text-white animate-spin" />
                    </div>
                  ) : usuario.profile_img_url ? (
                    <Image
                      src={profile_img_url || "/placeholder.svg"}
                      alt={nombreCompleto}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl sm:text-5xl font-bold">
                      {nombreCompleto.charAt(0)}
                    </div>
                  )}

                  {/* Overlay para cambiar avatar */}
                  {editable && (
                    <div
                      className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
                        isHoveringAvatar ? "opacity-100" : "opacity-0"
                      }`}
                      onClick={handleCambiarAvatar}
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Información centrada en mobile */}
            <div className="text-center px-4 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{nombreCompleto}</h1>
                {usuario.descripcion && (
                  <p className="text-muted-foreground mt-2 text-sm sm:text-base leading-relaxed break-words">
                    {usuario.descripcion}
                  </p>
                )}
              </div>

              {/* Badges y calificación */}
              <div className="flex flex-col items-center space-y-2">
                {usuario.suscripcion &&
                  usuario.suscripcion.tipo_suscripcion !== "plan_ocasion" &&
                  usuario.suscripcion.estado === "activa" && (
                    <Badge className="bg-green-500 text-white">
                      {usuario.suscripcion.tipo_suscripcion === "plan_vendedor"
                        ? "Vendedor Verificado"
                        : "Vendedor Profesional"}
                    </Badge>
                  )}

                {numResenas > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{calificacion.toFixed(1)}/5</span>
                    <span className="text-muted-foreground ml-1">({numResenas} reseñas)</span>
                  </div>
                )}
              </div>

              {/* Botón editar perfil */}
              {editable && (
                <Button variant="outline" onClick={handleEditarPerfil} className="mt-4">
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="relative -mt-18 bg-card rounded-lg border border-border p-6 pt-8">
            {/* Avatar posicionado a la izquierda en desktop */}
            <div
              className="absolute -top-16 left-6 w-[120px] h-[120px]"
              onMouseEnter={() => editable && setIsHoveringAvatar(true)}
              onMouseLeave={() => editable && setIsHoveringAvatar(false)}
            >
              <div className="relative w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
                {isLoadingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                ) : usuario.profile_img_url ? (
                  <Image
                    src={profile_img_url || "/placeholder.svg"}
                    alt={nombreCompleto}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                    {nombreCompleto.charAt(0)}
                  </div>
                )}

                {/* Overlay para cambiar avatar */}
                {editable && (
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
                      isHoveringAvatar ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={handleCambiarAvatar}
                  >
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Información del perfil en desktop */}
            <div className="flex justify-between">
              <div className="ml-[140px]">
                <h1 className="text-2xl font-bold">{nombreCompleto}</h1>
                {usuario.descripcion && (
                  <p className="text-muted-foreground mt-1 max-w-2xl break-words">{usuario.descripcion}</p>
                )}
              </div>

              <div className="flex flex-col items-end space-y-2">
                {usuario.suscripcion &&
                  usuario.suscripcion.tipo_suscripcion !== "plan_ocasion" &&
                  usuario.suscripcion.estado === "activa" && (
                    <Badge className="bg-green-500 text-white">
                      {usuario.suscripcion.tipo_suscripcion === "plan_vendedor"
                        ? "Vendedor Verificado"
                        : "Vendedor Profesional"}
                    </Badge>
                  )}

                {editable && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                )}

                {numResenas > 0 && (
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="font-medium">{calificacion.toFixed(1)}/5</span>
                    <span className="text-muted-foreground ml-1">({numResenas} reseñas)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      {isEditModalOpen && editable && (
        <EditarPerfilDialog
          cliente={usuario}
          isEditModalOpen={isEditModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      )}

      {/* Diálogo para recortar imágenes */}
      <Dialog open={cropDialogOpen} onOpenChange={(open) => !open && setCropDialogOpen(false)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {cropType === "banner" ? "Ajustar imagen de banner" : "Ajustar imagen de perfil"}
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {imageSrc && (
              <div className="max-h-[50vh] sm:max-h-[60vh] overflow-auto w-full">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={cropType === "avatar" ? 1 : 16 / 5}
                  circularCrop={cropType === "avatar"}
                >
                  <img
                    ref={imgRef}
                    src={imageSrc || "/placeholder.svg"}
                    alt="Imagen para recortar"
                    onLoad={onImageLoad}
                    className="max-w-full h-auto"
                  />
                </ReactCrop>
              </div>
            )}

            <div className="flex justify-end gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCropDialogOpen(false)
                  setImageSrc(null)
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>

              <Button size="sm" onClick={handleCropComplete} disabled={!completedCrop?.width || !completedCrop?.height}>
                <Check className="h-4 w-4 mr-2" />
                Aplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
