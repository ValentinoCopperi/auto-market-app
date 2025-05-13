import { mercadopago } from "@/lib/mercadopago";
import { PreApproval } from "mercadopago";
import prisma from "@/lib/prisma";
import { getSession, updateSuscripcion } from "@/lib/session/session";

export async function POST(request: Request) {
    try {
        // Obtenemos el cuerpo de la petición que incluye el tipo de notificación
        const body: { data: { id: string }; type: string } = await request.json();

        console.log("Body",body)
        // Solo nos interesan las notificaciones de suscripciones
        if (body.type === "subscription_preapproval") {
            // Obtenemos la suscripción
            const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });

            console.log("Preapproval (antes de autorizar)",preapproval)
            // Si se aprueba, actualizamos el usuario con el id de la suscripción
            if (preapproval.status !== "authorized") {
                
                console.log("Preapproval (despues de autorizar)",preapproval)
                const external_reference = preapproval.external_reference as string
                let plan: string
                let identifier: string
    
                const parts = external_reference.split("|")
    
                plan = parts[0]
                identifier = parts[1]
    
                console.log(plan)
                console.log(identifier)
    
                // Determine if identifier is an email or user ID
                const user = await prisma.cliente.findUnique({
                    where: { id: Number.parseInt(identifier, 10) },
                })
                console.log("User",user)
    
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
                        },
                    })
    
                    let subscriptionId: number
                    if (existingSubscription) {
                        // Update existing subscription
                        const updated_suscripcion = await tx.suscripcion.update({
                            where: { id: existingSubscription.id },
                            data: {
                                id_tipo_suscripcion: tipo_suscripcion.id,
                                fecha_fin: endDate,
                                estado: "activa",
                                fecha_inicio: startDate,
                                // Keep it active
                            },
                            select:{
                                id: true,
                                tipo_suscripcion: {
                                    select: {
                                        nombre: true
                                    }
                                }
                            }
                        })
                        subscriptionId = updated_suscripcion.id
                        await updateSuscripcion(updated_suscripcion.tipo_suscripcion.nombre)
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
                            select:{
                                id: true,
                                tipo_suscripcion: {
                                    select: {
                                        nombre: true
                                    }
                                }
                            }
                        })
                        subscriptionId = nueva_suscripcion.id
                        await updateSuscripcion(nueva_suscripcion.tipo_suscripcion.nombre)
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
        console.log("Notificacion recibida")
        // Respondemos con un estado 200 para indicarle que la notificación fue recibida
        return new Response(null, { status: 200 });
    } catch (error) {
        console.error("Algo salio mal", error);
        return new Response(null, { status: 500 });
    }
}