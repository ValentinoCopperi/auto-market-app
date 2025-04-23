"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Pencil, Upload, Star, Mail, Phone, MapPin, Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Cliente } from "@/types/cliente"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { updateProfileBannerImage, updateProfileImage } from "@/actions/clientes-actions"
import { toast } from "sonner"
import EditarPerfilDialog from "@/components/dialogs/editar-perfil/editar-perfil-dialog"

interface PerfilHeaderProps {
  usuario: Cliente
  editable?: boolean
  onBannerChange?: (file: File) => void
  onAvatarChange?: (file: File) => void
}

export function PerfilHeader({
  usuario,
  editable = false,
  onBannerChange,
  onAvatarChange
}: PerfilHeaderProps) {

  const [isHoveringBanner, setIsHoveringBanner] = useState(false)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false)

  const [isLoadingBanner, setIsLoadingBanner] = useState(false)
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false)

  const [banner_img_url, setBanner_img_url] = useState(usuario.banner_img_url ? usuario.banner_img_url : "/not_image.webp")
  const [profile_img_url, setProfile_img_url] = useState(usuario.profile_img_url ? usuario.profile_img_url : "/not_image.webp")

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
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
    // Activar el input file para seleccionar una imagen
    if (bannerInputRef.current) {
      bannerInputRef.current.click()
    }
  }

  const handleCambiarAvatar = () => {
    // Activar el input file para seleccionar una imagen
    if (avatarInputRef.current) {
      avatarInputRef.current.click()
    }
  }

  const handleBannerFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingBanner(true)
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]

      if (file.size > 1024 * 1024 * 5) {
        toast.error("El tamaño de la imagen debe ser menor a 5MB")
        setIsLoadingBanner(false)
        return
      }

      // Si se proporciona una función callback, la llamamos con el archivo
      const response = await updateProfileBannerImage(usuario.id, file)

      if (response.error) {
        toast.error(response.message)
        setIsLoadingBanner(false)
      } else {
        if (response.data) {
          setBanner_img_url(response.data)
          setIsLoadingBanner(false)
          toast.success(response.message)
        }
      }
      setIsLoadingBanner(false)
    }
    // Limpiar el valor del input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = ''
  }

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoadingAvatar(true)
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]

      if (file.size > 1024 * 1024 * 5) {
        toast.error("El tamaño de la imagen debe ser menor a 5MB")
        setIsLoadingAvatar(false)
        return
      }

      const response = await updateProfileImage(usuario.id, file)

      if (response.error) {
        toast.error(response.message)
        setIsLoadingAvatar(false)
      } else {
        if (response.data) {
          setProfile_img_url(response.data)
          setIsLoadingAvatar(false)
          toast.success(response.message)
        }
      }
      setIsLoadingAvatar(false)

    }
    // Limpiar el valor del input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = ''
  }

  return (
    <div className="relative">
      {/* Inputs ocultos para seleccionar archivos */}
      <input
        type="file"
        ref={bannerInputRef}
        disabled={isLoadingBanner}
        onChange={handleBannerFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Seleccionar imagen de banner"
      />

      <input
        type="file"
        ref={avatarInputRef}
        disabled={isLoadingAvatar}
        onChange={handleAvatarFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Seleccionar imagen de perfil"
      />

      {/* Banner */}
      <div
        className="relative w-full h-[200px] bg-gradient-to-r from-gray-900 to-gray-700 overflow-hidden"
        onMouseEnter={() => editable && setIsHoveringBanner(true)}
        onMouseLeave={() => editable && setIsHoveringBanner(false)}
      >
        {usuario.banner_img_url && (
          <Image
            src={banner_img_url}
            alt="Banner de perfil"
            fill
            className="object-cover"
            priority
          />
        )}
        {isLoadingBanner && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
        )}
        {/* Overlay para oscurecer ligeramente el banner */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Botón para cambiar banner (solo visible al hacer hover si es editable) */}
        {editable && (
          <Button
            variant="secondary"
            size="sm"
            className={`absolute right-4 top-4 transition-opacity duration-200 ${isHoveringBanner ? "opacity-100" : "opacity-0"
              }`}
            onClick={handleCambiarBanner}
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar Banner
          </Button>
        )}


      </div>

      {/* Contenedor de información de perfil */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-18 bg-card rounded-lg border border-border p-6 pt-8">
          {/* Avatar */}
          <div
            className="absolute -top-16 left-6 w-[120px] h-[120px]"
            onMouseEnter={() => editable && setIsHoveringAvatar(true)}
            onMouseLeave={() => editable && setIsHoveringAvatar(false)}
          >
            <div className="relative w-full h-full rounded-full border-4 border-background overflow-hidden bg-muted">
              {
                isLoadingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  </div>
                ) : (
                  usuario.profile_img_url ? (
                    <Image
                      src={profile_img_url}
                      alt={nombreCompleto}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-4xl font-bold">
                      {nombreCompleto.charAt(0)}
                    </div>
                  )
                )
              }

              {/* Overlay para cambiar avatar (solo visible al hacer hover si es editable) */}
              {editable && (
                <div
                  className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 cursor-pointer ${isHoveringAvatar ? "opacity-100" : "opacity-0"
                    }`}
                  onClick={handleCambiarAvatar}
                >
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Información del perfil */}
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mt-[22px] md:mt-[0px] md:ml-[140px]">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{nombreCompleto}</h1>
                  <p className="text-muted-foreground mt-1">{usuario.descripcion}</p>
                </div>

                {editable && (
                  <Button variant="outline" size="sm" className="md:hidden" onClick={handleEditarPerfil}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar Perfil
                  </Button>
                )}
              </div>

            </div>

            <div className="flex flex-col items-end mt-4 md:mt-0">
              {editable && (
                <Button variant="outline" size="sm" className="hidden md:flex mb-4" onClick={() => setIsEditModalOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              )}

              {/* Calificación */}
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
      {/* Modal de edición de perfil */}
      {
        (isEditModalOpen && editable) && (
          <EditarPerfilDialog cliente={usuario} isEditModalOpen={isEditModalOpen} setIsEditModalOpen={setIsEditModalOpen} />
        )
      }
    </div>
  )
}