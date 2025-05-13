import { CIUDADES } from "@/types/filtros"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import prisma from "@/lib/prisma"
import { createSession } from "@/lib/session/session"
export async function POST(req: Request) {

  const { nombre, apellido, email, telefono, ciudad, tipo_cliente, contrasena } = await req.json()

  if(!nombre || !email || !telefono || !ciudad || !tipo_cliente || !contrasena) {
    return NextResponse.json({ error: true, message: "Todos los campos son requeridos" }, { status: 400 })
  }

  if(!CIUDADES.includes(ciudad)) {
    return NextResponse.json({ error: true, message: "Ciudad no válida" }, { status: 400 })
  }

  if(tipo_cliente !== "personal" && tipo_cliente !== "empresa") {
    return NextResponse.json({ error: true, message: "Tipo de cliente no válido" }, { status: 400 })
  }

  if(contrasena.length < 8) {
    return NextResponse.json({ error: true, message: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 })
  }

  const formattedTelefono = parseInt(telefono)

  if(isNaN(formattedTelefono)) {
    return NextResponse.json({ error: true, message: "Teléfono no válido" }, { status: 400 })
  }

  try {


    const cliente_existe = await prisma.cliente.findUnique({
      where: { email }
    })

    if(cliente_existe) {
      return NextResponse.json({ error: true, message: "El email ya está registrado" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10)

    const cliente = await prisma.cliente.create({
      data: { nombre, apellido, email, telefono: formattedTelefono, ciudad, tipo_cliente, contrasena: hashedPassword }
    })


      await createSession({
        userId: cliente.id.toString(),
        email: cliente.email,
        admin: false,
        suscripcion:null,
      })

    return NextResponse.json({ error: false, message: "Cliente creado correctamente", user : {
      id: cliente.id,
      email: cliente.email,
      admin: false,
      suscripcion:null,
    } }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: true, message: "Error al crear el cliente" }, { status: 500 })
  }
}

