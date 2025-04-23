import { mercadopago } from "@/lib/mercadopago";
import { PreApproval } from "mercadopago";
import prisma from "@/lib/prisma";
import { getSession, updateSuscripcion } from "@/lib/session/session";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        // Obtenemos el cuerpo de la petición que incluye el tipo de notificación
        const body: { data: { id: string }; type: string } = await request.json();

        // Solo nos interesan las notificaciones de suscripciones
        if (body.type === "subscription_preapproval") {
            // Obtenemos la suscripción
            const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });

            // Si se aprueba, actualizamos el usuario con el id de la suscripción
            if (preapproval.status === "authorized") {

                const external_reference = preapproval.external_reference as string
                let plan: string
                let identifier: string

                const parts = external_reference.split("|")
                if (parts.length !== 2) {
                    console.error("Invalid external_reference format:", external_reference)
                    return new Response(null, { status: 400 })
                }

                plan = parts[0]
                identifier = parts[1]

                console.log("Plan:", plan, "Identifier:", identifier)

                // Determine if identifier is an email or user ID
                let user
                const session = await getSession()

                // Try to find user by email first
                if (identifier.includes("@")) {
                    user = await prisma.cliente.findUnique({
                        where: { email: identifier },
                    })

                    // Verify session if we have one
                    if (session && session.email !== identifier) {
                        console.log("Session email doesn't match identifier")
                        return new Response(null, { status: 401 })
                    }
                } else {
                    // Try to find by ID
                    user = await prisma.cliente.findUnique({
                        where: { id: Number.parseInt(identifier, 10) },
                    })

                    // Verify session if we have one
                    if (session && user && session.email !== user.email) {
                        console.log("Session email doesn't match user email")
                        return new Response(null, { status: 401 })
                    }
                }

                if (!user) {
                    console.error("User not found for identifier:", identifier)
                    return new Response(null, { status: 404 })
                }

                // Find subscription type
                const tipo_suscripcion = await prisma.tipo_suscripcion.findFirst({
                    where: {
                        OR: [
                            { nombre: plan },
                            { nombre: plan.replace("_", " ") }, // Handle "plan_ocasion" vs "plan ocasion"
                        ],
                    },
                })

                if (!tipo_suscripcion) {
                    console.error("Subscription type not found:", plan)
                    return new Response(null, { status: 404 })
                }

                // Calculate end date from preapproval data
                const startDate = new Date()
                let endDate

                if (preapproval.next_payment_date) {
                    endDate = new Date(preapproval.next_payment_date)
                } else {
                    // Fallback to 30 days if next_payment_date is not available
                    endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)
                }

                // Use a transaction to ensure data consistency
                await prisma.$transaction(async (tx) => {
                    // Check for existing active subscription
                    const existingSubscription = await tx.suscripcion.findFirst({
                        where: {
                            id_cliente: user.id,
                            estado: "activa",
                        },
                    })

                    let subscriptionId: number
                    if (existingSubscription) {
                        // Update existing subscription
                        await tx.suscripcion.update({
                            where: { id: existingSubscription.id },
                            data: {
                                id_tipo_suscripcion: tipo_suscripcion.id,
                                fecha_fin: endDate,
                                // Keep it active
                            },
                        })
                        subscriptionId = existingSubscription.id
                        console.log("Updated existing subscription:", existingSubscription.id)
                    } else {
                        // Create new subscription
                        const nueva_suscripcion = await tx.suscripcion.create({
                            data: {
                                id_cliente: user.id,
                                id_tipo_suscripcion: tipo_suscripcion.id,
                                fecha_inicio: startDate,
                                fecha_fin: endDate,
                                estado: "activa",
                            },
                        })
                        subscriptionId = nueva_suscripcion.id
                        console.log("Created new subscription:", nueva_suscripcion.id)
                    }

                    // Create payment record
                    const nuevo_pago = await tx.pago.create({
                        data: {
                            id_suscripcion: subscriptionId,
                            monto: tipo_suscripcion.precio,
                            metodo_pago: "mercadopago",
                            estado: "completado",
                            transaccion_id: preapproval.id!,
                            id_cliente: user.id,
                        },
                    })

                    console.log("Created payment record:", nuevo_pago.id)
                })

            }
        }

        

        // Respondemos con un estado 200 para indicarle que la notificación fue recibida
        return new Response(null, { status: 200 });
    } catch (error) {
        console.error("Algo salio mal", error);
        return new Response(null, { status: 500 });
    }
}