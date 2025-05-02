import imageCompression from "browser-image-compression"

export interface CompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  useWebWorker?: boolean
  initialQuality?: number
}

export async function compressImage(file: File, options: CompressionOptions = {}): Promise<File> {
  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
  }

  const compressionOptions = { ...defaultOptions, ...options }

  try {
    // Verificar si el archivo es una imagen
    if (!file.type.startsWith("image/")) {
      throw new Error(`El archivo "${file.name}" no es una imagen válida.`)
    }

    return await imageCompression(file, compressionOptions)
  } catch (error) {
    console.error("Error compressing image:", error)
    // Asegurarse de que siempre devolvemos un mensaje de error significativo
    if (error instanceof Error) {
      throw new Error(`Error al comprimir la imagen "${file.name}": ${error.message}`)
    } else {
      throw new Error(`Error al comprimir la imagen "${file.name}"`)
    }
  }
}

export async function compressImages(files: File[], options: CompressionOptions = {}): Promise<File[]> {
  if (!files || files.length === 0) {
    return []
  }

  try {
    const compressPromises = files.map((file) => compressImage(file, options))
    return await Promise.all(compressPromises)
  } catch (error) {
    console.error("Error compressing images:", error)
    // Asegurarse de que siempre devolvemos un mensaje de error significativo
    if (error instanceof Error) {
      throw new Error(`Error al comprimir las imágenes: ${error.message}`)
    } else {
      throw new Error("Error al comprimir las imágenes")
    }
  }
}
