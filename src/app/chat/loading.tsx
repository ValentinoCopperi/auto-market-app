import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-400 dark:text-gray-500" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Cargando conversaciones...</p>
      </div>
    </div>
  )
}
