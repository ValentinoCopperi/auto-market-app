import { getSession } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/lib/resend";


export async function POST(request: NextRequest) {

    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: true, message: "No estás autenticado" }, { status: 401 });
        }

        //Este sera el usuario del id que envia el mensaje
        const userId = parseInt(session.userId);
        if (isNaN(userId)) {
            return NextResponse.json({ error: true, message: "ID de usuario inválido" }, { status: 401 });
        }

        //Este sera el usuario del id que recibe el mensaje + el mensaje que envia el usuario
        const { message, id_cliente_receptor } = await request.json();
        
        if (!message  || !id_cliente_receptor) {
            return NextResponse.json({ error: true, message: "Faltan datos" }, { status: 400 });
        }

        const parsedId_cliente_receptor = parseInt(id_cliente_receptor);
        if (isNaN(parsedId_cliente_receptor)) {
            return NextResponse.json({ error: true, message: "ID de vendedor inválido" }, { status: 400 });
        }


        if(parsedId_cliente_receptor === userId){
            return NextResponse.json({ error: true, message: "No puedes enviar un mensaje a ti mismo" }, { status: 400 });
        }

        //Buscamos la conversacion entre los dos usuarios
        const conversacion = await prisma.conversacion.findFirst({
            where: {
                OR: [
                    { id_cliente_1: userId, id_cliente_2: parsedId_cliente_receptor },
                    { id_cliente_1: parsedId_cliente_receptor, id_cliente_2: userId }
                ]
            }
        })

        

        if (!conversacion) {

            //Si no existe, creamos una nueva conversacion
            const nuevaConversacion = await prisma.conversacion.create({
                data: {
                    id_cliente_1: userId,
                    id_cliente_2: parsedId_cliente_receptor
                }
            })

            //Creamos el mensaje en la nueva conversacion
            const newMensaje = await prisma.mensaje.create({
                data: {
                    id_conversacion: nuevaConversacion.id,
                    id_cliente: userId,
                    contenido: message,
                }
            })

            const clienteReceptor = await prisma.cliente.findUnique({
                where: {
                    id: parsedId_cliente_receptor
                },
                select: {
                    email: true
                }
            })

            
            if(clienteReceptor){
                const response = await sendEmail({
                    to: clienteReceptor.email,
                    subject: "Felicidades! Has recibido un nuevo mensaje en unas de tus publicaciones",
                    html: `
                    <div>
                        <h1>Felicidades! Has recibido un nuevo mensaje en unas de tus publicaciones</h1>
                        <p>Chequea tu conversacion con el usuario</p>
                        <p>Mensaje: ${message}</p>
                        <a href="${process.env.APP_URL}/chat">Ir a la conversacion</a>
                    </div>
                    `
                })
            }

           

            return NextResponse.json({ error: false, message: "Mensaje enviado correctamente", data: newMensaje }, { status: 200 })

        } else {

            //Si existe, creamos el mensaje en la conversacion existente
            const newMensaje = await prisma.mensaje.create({
                data: {
                    id_conversacion: conversacion.id,
                    id_cliente: userId,
                    contenido: message,
                }
            })

           

            return NextResponse.json({ error: false, message: "Mensaje enviado correctamente", data: newMensaje }, { status: 200 })
        }



    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: true, message: "Error al enviar el mensaje" }, { status: 500 })
    }


}

