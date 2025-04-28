"use server"

import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { mercadopago } from "@/lib/mercadopago";
import { ActionsResponse } from "@/types/actions-response";
import { getSession } from "@/lib/session/session";
import prisma from "@/lib/prisma";
import { Planes } from "@/types/suscriciones";


const getPlan = (plan: Planes) => {
    switch (plan) {
        case "plan_ocasion":
            return { name: "Plan Ocasional", price: 100 };
        case "plan_vendedor":
            return { name: "Plan Vendedor", price: 200 };
        case "plan_agencia":
            return { name: "Plan Agencia", price: 300 };
    }
}

export const suscribe = async (plan: Planes): Promise<ActionsResponse<string>> => {

    try {

        const session = await getSession();

        if(!session) {
            return {
                error: true,
                message: "Debes iniciar sesión para suscribirte",
            }
        }

        // if(!email || !email.includes("@")) {
        //     return {
        //         error: true,
        //         message: "El email es requerido",
        //     }
        // }



        const existingSubscription = await prisma.suscripcion.findFirst({
            where: {
                id_cliente: Number(session.userId),
                estado: "activa",
            },
            select: {
                tipo_suscripcion: {
                    select: {
                        nombre: true,
                        precio: true,
                    }
                }
            }
        })

        

        if(existingSubscription?.tipo_suscripcion.nombre === plan){
            return {
                error: true,
                message: "Ya tienes una suscripción activa de tipo " + getPlan(plan).name,
            }
        }
        

        const total_price = 15;
        
        const suscription = await new PreApproval(mercadopago).create({
            body: {
                back_url: `${process.env.APP_URL}/suscripcion/success`,
                payer_email: "mjmorazzo@gmail.com",
                reason: "Suscripción a auto market - " + getPlan(plan).name,
                auto_recurring: {
                    frequency_type: "months",
                    frequency: 1,
                    transaction_amount: total_price,
                    currency_id: "ARS",
                },
                status: "pending",
                external_reference: plan + "|" + session.userId,
            },
        })


        return {
            error: false,
            message: "Url generada correctamente",
            data: suscription.init_point!
        }
    } catch (error) {
        console.log("Error: ", error)
        return {
            error: true,
            message: "Error al crear la suscripción",
        }
    }
}
