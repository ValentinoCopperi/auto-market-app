"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CalendarIcon, ImageIcon, PencilIcon, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { Publicacion, Categoria } from "@/types/publicaciones"
import { CATEOGORIAS, CIUDADES, TRANSMISION, COMBUSTIBLE, COLORES } from "@/types/filtros"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "sonner"
import { editarPublicacion } from "@/actions/publicaciones-actions"
import { useRouter } from "next/navigation"

interface EditPublicationDialogProps {
  publicacion: Publicacion
}

interface imagesUrls {
  url: string;
  es_nueva: boolean;
}

export function EditPublicationDialog({ publicacion }: EditPublicationDialogProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  //Publicacion con los cambios que se han realizado en los datos
  const [editedPublication, setEditedPublication] = useState<Publicacion>({ ...publicacion })

  //Index dentro de imageURLs de la imagen seleccionada
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const [newImages, setNewImages] = useState<File[]>([])
  //Sirve para mostrar las imagenes en el preview
  const [imageURLs, setImageURLs] = useState<imagesUrls[]>(publicacion.publicacion_imagenes.map((image) => ({ url: image.url, es_nueva: false })))

  // Initialize URLs for preview
  useState(() => {
    if (publicacion.publicacion_imagenes && publicacion.publicacion_imagenes.length > 0) {
      setImageURLs(publicacion.publicacion_imagenes.map((image) => ({ url: image.url, es_nueva: false })))
    }
  })

  const handleInputChange = (field: keyof Publicacion, value: any) => {
    setEditedPublication((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const onSave = async () => {
    setIsLoading(true)
    if (!user) {
      toast.error("Debes estar autenticado para editar una publicación")
      setIsLoading(false)
      return
    }

    if (editedPublication.cliente.id !== Number(user.id)) {
      toast.error("No puedes editar una publicación que no es tuya")
      setIsLoading(false)
      return
    }

    // Pass the newImages array to the editarPublicacion function
    const { error, message } = await editarPublicacion(editedPublication, newImages)

    if (error) {
      toast.error(message)
      setIsLoading(false)
      return
    }

    toast.success(message)
    setOpen(false)
    setIsLoading(false)
    router.refresh()
  }

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleSetCoverImage = (imageUrl: string) => {
    setEditedPublication((prev) => ({
      ...prev,
      url_portada: imageUrl,
    }))
  }

  const handleRemoveImage = (index: number, imageUrl?: string) => {
    // Check if this is a new image (exists in newImages array)
    const isNewImage = index >= editedPublication.publicacion_imagenes.length - newImages.length

    // If it's a new image, remove it from newImages array
    if (isNewImage) {
      const newImageIndex = index - (editedPublication.publicacion_imagenes.length - newImages.length)
      const updatedNewImages = [...newImages]
      updatedNewImages.splice(newImageIndex, 1)
      setNewImages(updatedNewImages)
    }

    // Update images URL array
    const updatedImageURLs = [...imageURLs]
    updatedImageURLs.splice(index, 1)
    setImageURLs(updatedImageURLs)

    // Update the edited publication with the new images
    const updatedImages = [...editedPublication.publicacion_imagenes]
    updatedImages.splice(index, 1)
    setEditedPublication((prev) => ({
      ...prev,
      publicacion_imagenes: updatedImages,
    }))

    // Adjust selected index if needed
    if (selectedImageIndex >= updatedImageURLs.length) {
      setSelectedImageIndex(Math.max(0, updatedImageURLs.length - 1))
    }

    // If we removed the cover image, reset it
    if (editedPublication.url_portada === imageURLs[index].url) {
      setEditedPublication((prev) => ({
        ...prev,
        url_portada: updatedImageURLs.length > 0 ? updatedImageURLs[0].url : "",
      }))
    }
  }

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length > 0) {
      // Add files to newImages array
      setNewImages((prev) => [...prev, ...files])

      // Create object URLs for preview
      const fileURLs = files.map((file) => URL.createObjectURL(file))
      setImageURLs((prev) => [...prev, ...fileURLs.map((url) => ({ url, es_nueva: true }))])

      // Update the publication images array with placeholder objects
      const newImageObjects = files.map((file) => ({
        id: Math.random(), // Temporary ID
        url: URL.createObjectURL(file),
        publicacion_id: editedPublication.id,
      }))

      setEditedPublication((prev) => ({
        ...prev,
        publicacion_imagenes: [...prev.publicacion_imagenes, ...newImageObjects],
      }))
    }

    e.target.value = ""
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any object URLs we created to prevent memory leaks
      imageURLs.forEach(({ url }) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [])


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 hover:text-white"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar publicación</DialogTitle>
          <DialogDescription>
            Actualiza la información de tu publicación. Haz clic en guardar cuando hayas terminado.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-1 lg:grid-cols-3 my-8">
            <TabsTrigger value="info">Información básica</TabsTrigger>
            <TabsTrigger value="details">Detalles técnicos</TabsTrigger>
            <TabsTrigger value="images">Imágenes</TabsTrigger>
          </TabsList>

          {/* Pestaña de información básica */}
          <TabsContent value="info" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={editedPublication.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="precio">Precio</Label>
                <div className="flex gap-2">
                  <Select
                    value={editedPublication.tipo_moneda}
                    onValueChange={(value) => handleInputChange("tipo_moneda", value as "USD" | "ARG")}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Moneda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="ARG">ARG</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    id="precio"
                    type="number"
                    className="flex-1"
                    value={editedPublication.precio}
                    onChange={(e) => handleInputChange("precio", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={editedPublication.categoria}
                  defaultValue={editedPublication.categoria}
                  onValueChange={(value) => handleInputChange("categoria", value as Categoria)}
                >
                  <SelectTrigger id="categoria" className="w-full">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEOGORIAS.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad</Label>
                <Select
                  value={editedPublication.ciudad}
                  defaultValue={editedPublication.ciudad}
                  onValueChange={(value) => handleInputChange("ciudad", value as string)}
                >
                  <SelectTrigger id="ciudad" className="w-full">
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {CIUDADES.map((ciu) => (
                      <SelectItem key={ciu} value={ciu}>
                        {ciu}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                rows={5}
                value={editedPublication.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
              />
            </div>
          </TabsContent>

          {/* Pestaña de detalles técnicos */}
          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="modelo">Modelo</Label>
                <Input
                  id="modelo"
                  value={editedPublication.modelo}
                  onChange={(e) => handleInputChange("modelo", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anio">Año</Label>
                <div className="relative">
                  <Input
                    id="anio"
                    type="number"
                    value={editedPublication.anio}
                    onChange={(e) => handleInputChange("anio", Number(e.target.value))}
                  />
                  <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kilometraje">Kilometraje</Label>
                <Input
                  id="kilometraje"
                  type="number"
                  value={editedPublication.kilometraje}
                  onChange={(e) => handleInputChange("kilometraje", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_transmision">Tipo de transmisión</Label>
                <Select
                  value={editedPublication.tipo_transmision}
                  onValueChange={(value) => handleInputChange("tipo_transmision", value)}
                >
                  <SelectTrigger id="tipo_transmision" className="w-full">
                    <SelectValue placeholder="Seleccionar transmisión" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSMISION.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_combustible">Tipo de combustible</Label>
                <Select
                  value={editedPublication.tipo_combustible}
                  onValueChange={(value) => handleInputChange("tipo_combustible", value)}
                >
                  <SelectTrigger id="tipo_combustible" className="w-full">
                    <SelectValue placeholder="Seleccionar combustible" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMBUSTIBLE.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select value={editedPublication.color} onValueChange={(value) => handleInputChange("color", value)}>
                  <SelectTrigger id="color" className="w-full">
                    <SelectValue placeholder="Seleccionar color" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLORES.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          {/* Pestaña de imágenes */}
          <TabsContent value="images" className="py-4">
            <div className="grid grid-cols-1 gap-6">
              {/* Vista previa de la imagen seleccionada */}
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {imageURLs.length > 0 ? (
                  <Image
                    src={imageURLs[selectedImageIndex].url || "/placeholder.svg"}
                    alt="Imagen seleccionada"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Sección de portada */}
              <div className="bg-muted/30 p-4 rounded-lg border">
                <h3 className="font-medium mb-3">Imagen de portada</h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                    {editedPublication.url_portada ? (
                      <Image
                        src={editedPublication.url_portada || "/placeholder.svg"}
                        alt="Portada actual"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      La imagen de portada es la primera que verán los usuarios al navegar por las publicaciones.
                    </p>
                    <p className="text-sm font-medium">
                      Selecciona una imagen de la galería para establecerla como portada.
                    </p>
                  </div>
                </div>
              </div>

              {/* Galería de imágenes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-base">Galería de imágenes ({imageURLs.length})</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={handleAddImage}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => document.getElementById("image-upload")?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Agregar imagen
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {imageURLs.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={cn(
                        "group relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer",
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-muted-foreground/50",
                        editedPublication.url_portada === imageUrl.url ? "ring-2 ring-primary ring-offset-2" : "",
                      )}
                      onClick={() => handleImageSelect(index)}
                    >
                      <Image
                        src={imageUrl.url || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                      />

                      {/* Overlay con acciones */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                        {
                          !imageUrl.es_nueva && (
                            <Button
                              variant="secondary"
                              size="sm"
                              className="mb-2"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetCoverImage(imageUrl.url)
                              }}
                              disabled={editedPublication.url_portada === imageUrl.url}
                            >
                              {editedPublication.url_portada === imageUrl.url ? (
                                <>
                                  <Check className="h-3 w-3 mr-1" />
                                  Portada actual
                                </>
                              ) : (
                                <>Establecer como portada</>
                              )}
                            </Button>
                          )
                        }
                        {
                          (imageURLs.length > 1) && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage(index, imageUrl.url)
                              }}
                            >
                              <X className="h-3 w-3 mr-1" />
                              Eliminar
                            </Button>
                          )
                        }
                      </div>

                      {/* Indicador de número */}
                      <div className="absolute bottom-1 left-1 bg-background/80 rounded-md px-1.5 py-0.5 text-xs">
                        {index + 1}
                      </div>

                      {/* Indicador de portada */}
                      {editedPublication.url_portada === imageUrl.url && (
                        <div className="absolute top-1 left-1 bg-primary text-primary-foreground rounded-md px-1.5 py-0.5 text-xs">
                          Portada
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="gap-2 sm:gap-0 flex flex-col md:flex-row items-center space-x-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Button disabled={isLoading} variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button disabled={isLoading} onClick={onSave}>
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
