"use server"

import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { mercadopago } from "@/lib/mercadopago";
import { ActionsResponse } from "@/types/actions-response";
import { getSession } from "@/lib/session/session";
import prisma from "@/lib/prisma";
import { Planes } from "@/types/suscriciones";
import { suscribir_a_plan } from "./suscripcion-actions";


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

const code_test = "123456"

export const suscribe = async (email: string, plan: Planes, code: string | null): Promise<ActionsResponse<string>> => {

    try {

        const session = await getSession();

        if(!session) {
            return {
                error: true,
                message: "Debes iniciar sesión para suscribirte",
            }
        }

        if(!email || !email.includes("@")) {
            return {
                error: true,
                message: "El email es requerido",
            }
        }



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
        }else if(existingSubscription?.tipo_suscripcion.nombre === "plan_agencia" && (plan === "plan_vendedor" || plan === "plan_ocasion")){
            return {
                error: true,
                message: "No puede cambiar a un plan menor al que tiene actualmente",
            }
        }else if(existingSubscription?.tipo_suscripcion.nombre === "plan_vendedor" && plan === "plan_ocasion"){
            return {
                error: true,
                message: "No puede cambiar a un plan menor al que tiene actualmente",
            }
        }
        
        if(code && code !== code_test){
            return {
                error: true,
                message: "El codigo de activacion es incorrecto",
            }
        }else if(code && code === code_test){
            const response = await suscribir_a_plan(Number(session.userId), plan)
            if(response.error){
                return {
                    error: true,
                    message: response.message
                }
            }
            return {
                error: false,
                message: "Suscripción creada correctamente",
                data: `${process.env.APP_URL}/suscripcion/success`
            }
        }

        const total_price = 15;
        const suscription = await new PreApproval(mercadopago).create({
            body: {
                back_url: `${process.env.APP_URL}/suscripcion/success`,
                payer_email: email,
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
