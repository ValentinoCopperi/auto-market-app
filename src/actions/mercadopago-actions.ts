"use server"

import { MercadoPagoConfig, Preference } from "mercadopago";
import { ActionsResponse } from "@/types/actions-response";
import { getSession } from "@/lib/session/session";
import { Planes } from "@/types/suscriciones";
import prisma from "@/lib/prisma";

const getPlanName = (plan: Planes) => {
    switch(plan) {
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



export const init_point = async (plan: Planes): Promise<ActionsResponse<string>> => {
    const session = await getSession();
    if(!session) {
        return {
            error: true,
            message: "Debes iniciar sesión para suscribirte",
        }
    }
    
    const suscripcion = await prisma.suscripcion.findFirst({
        where: {
            id_cliente: Number(session.userId),
            estado: "activa",
        },select : {
            tipo_suscripcion: {
                select: {
                    nombre: true,
                }
            },
        }
    })

    if(plan === suscripcion?.tipo_suscripcion?.nombre) {
        return {
            error: true,
            message: "Ya tienes una suscripción de el plan seleccionado",
        }
    }

    // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
    try {
        const preference = await new Preference(mercado_pago_config).create({
            body: {
                items: [
                    {
                        id: plan,
                        unit_price: 15,
                        quantity: 1,
                        title: getPlanName(plan),
                    },
                ],
                metadata: {
                    user:{
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
        console.log(error)
        return {
            error: true,
            message: "Error al crear la preferencia",
        }
    }
}