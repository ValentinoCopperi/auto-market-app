"use server"

import { MercadoPagoConfig, Preference } from "mercadopago";
import { ActionsResponse } from "@/types/actions-response";
import { getSession } from "@/lib/session/session";
import { Planes } from "@/types/suscriciones";
import prisma from "@/lib/prisma";
import { suscribir_a_plan } from "./suscripcion-actions";
import { redirect } from "next/navigation";

const getPlanName = (plan: Planes) => {
    switch (plan) {
        case "plan_vendedor":
            return "Plan Vendedor - Car Market"
        case "plan_ocasion":
            return "Plan Ocasional - Car Market"
        case "plan_agencia":
            return "Plan Agencia - Car Market"

    }
}

const mercado_pago_config = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});



export const init_point = async (plan: Planes, code: string | null): Promise<ActionsResponse<string>> => {
    const session = await getSession();
    if (!session) {
        return {
            error: true,
            message: "Debes iniciar sesión para suscribirte",
        }
    }

    const suscripcion = await prisma.suscripcion.findFirst({
        where: {
            id_cliente: Number(session.userId),
            estado: "activa",
        }, select: {
            tipo_suscripcion: {
                select: {
                    nombre: true,
                }
            },
        }
    })

    if (plan === suscripcion?.tipo_suscripcion?.nombre) {
        return {
            error: true,
            message: "Ya tienes una suscripción de el plan seleccionado",
        }
    }

    let descuento = 0;
    if (code) {
        const codigoExistente = await prisma.codigos.findUnique({
            where: {
                codigo: code,
            }
        });


        if (!codigoExistente) {
            return {
                error: true,
                message: "El código ingresado no es válido"
            }
        }

        if(codigoExistente.fecha_fin < new Date()) {
            return {
                error: true,
                message: "El código ingresado expiro"
            }
        }

        if (codigoExistente.cantidad_usos >= codigoExistente.max_usos) {
            return {
                error: true,
                message: "El código ya no es válido"
            }
        }

        const codigo = await prisma.codigos.update({
            where: {
                codigo: code,
            },
            data: {
                cantidad_usos: {
                    increment: 1
                },
            }
        });

        if (codigo?.activa_suscripcion) {
            const response = await suscribir_a_plan(Number(session.userId), plan)
            if (response.error) {
                return {
                    error: true,
                    message: "No se pudo activar la suscripcion"
                }
            }
            redirect(`${process.env.NEXT_PUBLIC_API_URL}/suscripcion/success`)
        } else if (codigo?.cantidad_descuento != null && codigo?.cantidad_descuento > 0) {
            descuento = codigo.cantidad_descuento;
        }


    }

    

    const planDetails = await prisma.tipo_suscripcion.findUnique({
        where: {
            nombre: plan, // Asumiendo que 'nombre' es único y mapea a 'Planes'
        },
        select: {
            precio: true,
        },
    });

    if (!planDetails || typeof planDetails.precio === 'undefined') {
        return {
            error: true,
            message: "No se pudo obtener el precio del plan.",
        };
    }
    const montoDescuento = (planDetails.precio * descuento) / 100;

    const precio_final = planDetails.precio - montoDescuento;

    if (precio_final <= 0) {
        return {
            error: true,
            message: "El precio final es menor o igual a 0"
        }
    }
    // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
    try {
        const preference = await new Preference(mercado_pago_config).create({
            body: {
                items: [
                    {
                        id: plan,
                        unit_price: precio_final,
                        quantity: 1,
                        title: getPlanName(plan),
                    },
                ],
                metadata: {
                    user: {
                        id: Number(session.userId),
                        email: session.email!,
                    },
                    plan: plan,
                    fecha_inicio: new Date(),
                    fecha_fin: new Date(new Date().setMonth(new Date().getMonth() + 1)),

                },
                back_urls: {
                    success: `${process.env.APP_URL}/suscripcion/success`,
                    pending: `${process.env.APP_URL}/suscripcion`,
                    failure: `${process.env.APP_URL}/suscripcion`,
                },
                redirect_urls: {
                    success: `${process.env.APP_URL}/suscripcion/success`,
                    pending: `${process.env.APP_URL}/suscripcion`,
                    failure: `${process.env.APP_URL}/suscripcion`,
                },
                auto_return: "approved",
            },
        });


        // Devolvemos el init point (url de pago) para que el usuario pueda pagar
        return {
            error: false,
            message: "Url generada correctamente",
            data: preference.init_point!
        }
    } catch (error) {
        return {
            error: true,
            message: "Error al crear la preferencia",
        }
    }
}