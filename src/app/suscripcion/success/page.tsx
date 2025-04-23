// Create a dedicated success page that handles the preapproval_id parameter
import { redirect } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/session/session"

export default async function SubscriptionSuccessPage({
    searchParams,
}: {
    searchParams: { preapproval_id?: string }
}) {

    const get_nombre_plan = (plan: string) => {
        if (plan === "plan_ocasion") return "Plan Ocasional"
        if (plan === "plan_vendedor") return "Plan Vendedor"
        if (plan === "plan_agencia") return "Plan Agencia"
    }

    // Get the user's active subscription
    const subscription = await prisma.suscripcion.findFirst({
        where: {
            id_cliente: Number(18),
        },
        include: {
            tipo_suscripcion: true,
        },
    })

    // If we don't have a subscription and couldn't verify with preapproval_id, redirect to subscription page
    if (!subscription) {
        redirect("/suscripcion")
    }

    return (
        <div className="container max-w-md mx-auto py-12">
            <div className="rounded-lg bg-secondary-foreground/20 shadow-lg p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>

                <h1 className="text-2xl font-bold mb-2">¡Suscripción Exitosa!</h1>

                <p className="text-light mb-6">
                    {subscription ? (
                        <>
                            Tu suscripción al plan <span className="font-semibold">{get_nombre_plan(subscription.tipo_suscripcion.nombre)}</span> ha
                            sido activada correctamente.
                        </>
                    ) : (
                        <>Tu suscripción ha sido procesada correctamente.</>
                    )}
                </p>

                {subscription && (
                    <div className="p-4 w-full lg:w-1/2 mx-auto rounded-md mb-6 bg-secondary-foreground/50 text-white">
                        <div className="flex justify-between mb-2">
                            <span className="">Plan:</span>
                            <span className="font-medium">{get_nombre_plan(subscription.tipo_suscripcion.nombre)}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="">Precio:</span>
                            <span className="font-medium">ARS ${subscription.tipo_suscripcion.precio}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="">Próximo pago:</span>
                            <span className="font-medium">{new Date(subscription.fecha_fin).toLocaleDateString()}</span>
                        </div>
                    </div>
                )}

                <p className="text-sm  mb-6">
                    Tu suscripción se renovará automáticamente cada mes. Puedes cancelarla en cualquier momento desde tu perfil.
                </p>

                <div className="space-y-3 w-full lg:w-1/2 mx-auto">
                    <Button asChild className="w-full">
                        <Link href="/">Ir al home</Link>
                    </Button>

                    <Button variant="outline" asChild className="w-full">
                        <Link href="/profile/subscription">Administrar Suscripción</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
