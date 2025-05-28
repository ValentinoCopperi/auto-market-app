"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { getPlanName, planes, Planes } from "@/types/suscriciones"
import SuscripcionCard from "./_components/suscripcion-card"
import { useAuth } from "@/hooks/use-auth"
import { init_point } from "@/actions/mercadopago-actions"
import PagarMobileDialog from "./_components/pagar-mobile-dialog"
import { Input } from "@/components/ui/input"





export default function SuscripcionesPage() {
  // Añadir estado para el plan seleccionado
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<Planes | null>("plan_vendedor")
  const [loading, setLoading] = useState(false)
  const [code, setCode] = useState<string | null>(null)
  // Función para manejar la selección de plan
  const handleSelectPlan = (planName: Planes) => {
    setSelectedPlan(planName)
  }



  // Función para proceder al pago
  const handleProceedToPayment = async () => {
    if (!user) {
      toast.error("Debes estar autenticado para suscribirte", {
        description: "Por favor, inicia sesión para continuar"
      })
      return
    }
    if (!selectedPlan) {
      toast.error("Debes seleccionar un plan", {
        description: "Por favor, selecciona un plan para continuar"
      })
      return
    }
    setLoading(true)
    let codeToSend = code || null
    if (!code || code === "") {
      codeToSend = null
    } else {
      codeToSend = code
    }
    const response = await init_point(selectedPlan,codeToSend)
    if (response.error) {
      setLoading(false)
      toast.error(response.message, {
        description: "Por favor, intenta nuevamente"
      })
      return
    }
    setLoading(false)
    redirect(response.data!)
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Planes de Suscripción</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>

          <div className="flex items-center justify-center mt-6">
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-full">
              <span className="text-blue-600 dark:text-blue-400">∞</span>
              <span className="text-sm font-medium">Todas las publicaciones tienen duración ilimitada</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Ocasión */}

          {
            planes.map((plan, index) => (
              <SuscripcionCard key={plan.id} plan={plan} selectedPlan={selectedPlan} handleSelectPlan={handleSelectPlan} />
            ))
          }

        </div>

        {/* Sección de confirmación que aparece cuando se selecciona un plan */}
        {selectedPlan && (
          <div className="mt-12 bg-blue-50 dark:bg-blue-950/30 rounded-lg p-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h2 className="text-xl font-semibold">
                  {getPlanName(selectedPlan)} seleccionado
                </h2>
                <p className="text-sm text-muted-foreground mt-2">
                  *Todos los pagos son procesados por Mercado Pago.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  *Si tienes un codigo de descuento, ingresalo en el campo y presiona el boton de proceder al pago.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Codigo descuento..."
                  type="text"
                  value={code || ""}
                  onChange={(e) => setCode(e.target.value)}
                />
                {/* <EmailDialog loading={loading} handleProceedToPayment={handleProceedToPayment} email={email} setEmail={setEmail} code={code} setCode={setCode} /> */}
                <Button onClick={() => handleProceedToPayment()} disabled={loading}>
                  {loading ? "Procesando..." : "Proceder al pago"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 bg-muted rounded-lg p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-4">¿Por qué suscribirte?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-muted-foreground mb-4">
                Suscríbete a  CarMarket para maximizar tus oportunidades de venta. Nuestros planes están diseñados para
                adaptarse a tus necesidades, ya sea que quieras vender un único vehículo o que seas un vendedor
                profesional.
              </p>
              <p className="text-muted-foreground">
                Con funciones como publicaciones destacadas, estadísticas detalladas y soporte prioritario, podrás
                vender tu vehículo más rápido y al mejor precio.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Mayor visibilidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Tus publicaciones aparecerán en los primeros resultados de búsqueda.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Más confianza</h3>
                  <p className="text-sm text-muted-foreground">
                    Los badges de verificación aumentan la confianza de los compradores.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                  <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium">Herramientas profesionales</h3>
                  <p className="text-sm text-muted-foreground">
                    Accede a estadísticas y herramientas que te ayudarán a vender más rápido.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-xl font-semibold mb-4">¿Tienes dudas sobre nuestros planes?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Nuestro equipo está disponible para ayudarte a elegir el plan que mejor se adapte a tus necesidades.
          </p>
          <Button variant="outline" className="mx-auto">
            Contactar con soporte
          </Button>
        </div>
      </main>
      <PagarMobileDialog
        open={selectedPlan !== null}
        handleProceedToPayment={handleProceedToPayment}
        loading={loading}
        selectedPlan={selectedPlan ? getPlanName(selectedPlan) : null}
        code={code}
        setCode={setCode}
      />
    </div>
  )
}
