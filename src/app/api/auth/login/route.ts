import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"
import { createSession } from "@/lib/session/session"

export async function POST(req: Request) {
  const { email, contrasena } = await req.json()

  if(!email || !contrasena) {
    return NextResponse.json({ error: true, message: "Todos los campos son requeridos" }, { status: 400 })
  }

  try {
    const cliente = await prisma.cliente.findUnique({
      where: { email }
    })

    if(!cliente) {
      return NextResponse.json({ error: true, message: "El email no está registrado" }, { status: 400 })
    }

    const contrasena_correcta = await bcrypt.compare(contrasena, cliente.contrasena)

    if(!contrasena_correcta) {
      return NextResponse.json({ error: true, message: "La contraseña es incorrecta" }, { status: 400 })
    }
    
    const suscripcion = await prisma.suscripcion.findFirst({
      where: {
        id_cliente: cliente.id,
        fecha_fin: {
          gt: new Date()
        }
      },
      select : {
        tipo_suscripcion: {
          select: {
            nombre: true,
          }
        }
      }
    })

    const suscripcion_nombre = suscripcion ? suscripcion.tipo_suscripcion.nombre : null

    await createSession({
      userId: cliente.id.toString(),
      email: cliente.email,
      admin: false,
      suscripcion:suscripcion_nombre,
    })

    return NextResponse.json({ error: false, message: "Inicio de sesión exitoso", cliente }, { status: 200 })
    
  } catch (error) {
    return NextResponse.json({ error: true, message: "Error al iniciar sesión" }, { status: 500 })
  }
}

