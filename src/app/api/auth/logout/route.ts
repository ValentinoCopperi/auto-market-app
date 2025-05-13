import { NextResponse } from "next/server"
import { logout } from "@/lib/session/session"

export async function POST() {
  try {
    // Cerrar sesión eliminando la cookie
    await logout()

    return NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    })
  } catch (error) {
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}

