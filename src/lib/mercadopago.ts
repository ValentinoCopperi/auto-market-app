import { MercadoPagoConfig } from "mercadopago";

//TODO: Cambiar a la nueva API de Mercado Pago
export const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
})