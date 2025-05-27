// pages/api/enviarMailContacto.js
import { resend, sendEmail } from '@/lib/resend';
import { contactFormSchema } from '@/lib/zod/contacto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


export async function POST(req: NextRequest) {



    try {
        const body = await req.json();
        const parsedData = contactFormSchema.parse(body);
        const { nombre, apellido, email, asunto, mensaje } = parsedData;

        const data = await sendEmail({
            to: "carmarketargentina@gmail.com",
            subject: "Formulario de contacto",
            html: `
              <h1>Formulario de contacto</h1>
              <p>Nombre: ${nombre}</p>
              <p>Apellido: ${apellido}</p>
              <p>Email: ${email}</p>
              <p>Asunto: ${asunto}</p>
              <p>Mensaje: ${mensaje}</p>
              `,
        })


        return NextResponse.json({ message: 'Correo enviado exitosamente.', error: false }, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        if (error instanceof z.ZodError) {
            // Zod validation error
            return NextResponse.json({ message: 'Datos de formulario inválidos.', errors: error.flatten().fieldErrors, error: true }, { status: 400 });
        }
        return NextResponse.json({ message: 'Ocurrió un error inesperado.', error: true }, { status: 500 });
    }
}