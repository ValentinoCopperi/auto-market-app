import "server-only"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Asegurarse de que la clave secreta existe
const secretKey = process.env.SESSION_SECRET

const encodedKey = new TextEncoder().encode(secretKey)

export interface SessionPayload {
  userId: string
  email: string
  admin: boolean
  suscripcion: string | null
  expiresAt: number // Timestamp en milisegundos
}

/**
 * Crea y firma un JWT con la información del usuario
 */
export async function encrypt(payload: Omit<SessionPayload, "expiresAt"> & { expiresAt?: Date | number }) {
  // Convertir Date a timestamp si es necesario
  const expiresAt =
    payload.expiresAt instanceof Date
      ? payload.expiresAt.getTime()
      : payload.expiresAt || Date.now() + 7 * 24 * 60 * 60 * 1000

  return new SignJWT({
    ...payload,
    expiresAt,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey)
}

/**
 * Verifica y decodifica un JWT
 */
export async function decrypt(session: string | undefined = ""): Promise<SessionPayload | null> {
  if (!session) return null

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })
    return payload as unknown as SessionPayload
  } catch (error) {
    console.error("Error al verificar la sesión:", error)
    return null
  }
}

/**
 * Crea una sesión y establece una cookie HTTP
 */
export async function createSession(userData: Omit<SessionPayload, "expiresAt">) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ ...userData, expiresAt })

  const cookieStore = await cookies()
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })

  return session
}

/**
 * Obtiene la sesión actual del usuario
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null

  return decrypt(session)
}

/**
 * Verifica si el usuario está autenticado
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession()
  return session !== null
}

/**
 * Verifica si el usuario es administrador
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.admin === true
}

/**
 * Actualiza el campo "suscripcion" de la cookie de sesión
 */
export async function updateSuscripcion(newSuscripcion: string) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("session")?.value

  if (!sessionCookie) {
    console.error("No se encontró la cookie de sesión")
    return
  }

  const session = await decrypt(sessionCookie)

  if (!session) {
    console.error("No se pudo decodificar la sesión")
    return
  }

  // Actualizar el dato de la suscripción
  const updatedSession = {
    ...session,
    suscripcion: newSuscripcion,
  }

  // Re-firmar la cookie con los nuevos datos
  const newToken = await encrypt(updatedSession)

  // Guardar la nueva cookie
  cookieStore.set("session", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(session.expiresAt), // Respetamos la expiración original
    sameSite: "lax",
    path: "/",
  })
}

/**
 * Cierra la sesión del usuario eliminando la cookie
 */
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

/**
 * Actualiza los datos de la sesión actual
 */
export async function updateSession(updatedData: Partial<Omit<SessionPayload, "expiresAt">>) {
  const currentSession = await getSession()
  if (!currentSession) return null

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const updatedSession = await encrypt({
    ...currentSession,
    ...updatedData,
    expiresAt,
  })

  const cookieStore = await cookies()
  cookieStore.set("session", updatedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  })

  return updatedSession
}

