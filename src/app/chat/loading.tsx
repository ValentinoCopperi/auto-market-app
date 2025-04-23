import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
        <p className="mt-4 text-sm text-gray-500">Cargando conversaciones...</p>
      </div>
    </div>
  )
}
