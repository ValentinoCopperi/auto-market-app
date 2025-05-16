import prisma from "@/lib/prisma";
import { updateSuscripcion } from "@/lib/session/session";
import MercadoPagoConfig, { Payment } from "mercadopago";
import { revalidatePath } from "next/cache";


const mercado_pago_config = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});

interface Metadata {
    user: {
        id: number;
        email: string;
    };
    plan: string;
    fecha_inicio: Date;
    fecha_fin: Date;
}

export async function POST(request: Request) {
    // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
    const body: { data: { id: string } } = await request.json();

    // Obtenemos el pago
    const payment = await new Payment(mercado_pago_config).get({ id: body.data.id });

    // Si se aprueba, agregamos el mensaje
    if (payment.status === "approved") {
        // Obtenemos los datos
        const {user, plan, fecha_inicio, fecha_fin} = payment.metadata as Metadata;

        const tipo_suscripcion = await prisma.tipo_suscripcion.findFirst({
            where: {
                OR: [
                    { nombre: plan },
                    { nombre: plan.replace("_", " ") }, // Handle "plan_ocasion" vs "plan ocasion"
                ],
            },
        })
        console.log("Tipo de suscripcion:", tipo_suscripcion)
        if (!tipo_suscripcion) {
            console.error("Subscription type not found:", plan)
            return new Response(null, { status: 404 })
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
                        fecha_fin: fecha_fin,
                        estado: "activa",
                        // Keep it active
                    },
                    select: {
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
                        fecha_inicio: fecha_inicio,
                        fecha_fin: fecha_fin,
                        estado: "activa",
                    },
                    select: {
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
            if(!payment.id) {
                console.error("Payment ID not found")
                return new Response(null, { status: 404 })
            }
            // Create payment record
            const nuevo_pago = await tx.pago.create({
                data: {
                    id_suscripcion: subscriptionId,
                    monto: tipo_suscripcion.precio,
                    metodo_pago: "mercadopago",
                    estado: "completado",
                    transaccion_id: payment.id.toString(),
                    id_cliente: user.id,
                },
            })

            console.log("Created payment record:", nuevo_pago.id)


        })
        // Revalidamos la página de inicio para mostrar los datos actualizados
        revalidatePath("/");
    }

    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, { status: 200 });
}