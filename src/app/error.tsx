"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
 

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3">Algo salió mal</h1>

        <p className="text-muted-foreground mb-2">
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        </p>

        {error.digest && <p className="text-xs text-muted-foreground mb-6">Código de error: {error.digest}</p>}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <RefreshCw className="h-4 w-4 mr-2" />
            Intentar nuevamente
          </Button>

          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
