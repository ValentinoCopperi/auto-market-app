import { NextResponse } from "next/server"
import { getSession } from "@/lib/session/session"
import { getClienteById } from "@/actions/clientes-actions"

export async function GET() {
  try {
    // Obtener la sesión actual
    const session = await getSession()


    if (!session) {
      return NextResponse.json({error: true, message: "No hay sesión", authenticated: false }, { status: 200 })
    }

    const cliente = await getClienteById(session.userId);

    if (!cliente) {
      return NextResponse.json({error: true, message: "No hay cliente", authenticated: false }, { status: 200 })
    }

    // Responder con los datos de la sesión
    return NextResponse.json({error: false, message: "Sesión encontrada", authenticated: true, user: {
        id: session.userId,
        email: session.email,
        admin: session.admin,
        suscripcion: session.suscripcion,
      },
    })
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    return NextResponse.json({ error: true, message: "Error al obtener la información de la sesión" }, { status: 500 })
  }
}

