import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function SubscriptionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-[90%] lg:w-[60%] mx-auto mt-20">
      {/* Panel principal - Información de suscripción */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-blue-50/10 rounded-lg">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Skeleton className="h-9 w-full sm:w-36" />
            <Skeleton className="h-9 w-full sm:w-36" />
          </CardFooter>
        </Card>
      </div>

      {/* Panel lateral - Beneficios y acciones rápidas */}
      <div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-28" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Skeleton className="h-5 w-32 mb-3" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historial de pagos */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 border-b">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-32 col-span-2" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="grid grid-cols-5 p-4 border-b last:border-0">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-48 col-span-2" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16 ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección de ayuda */}
      <div className="lg:col-span-3 mt-8">
        <div className="bg-muted rounded-lg p-6 md:p-8">
          <Skeleton className="h-6 w-64 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex flex-col space-y-4">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
