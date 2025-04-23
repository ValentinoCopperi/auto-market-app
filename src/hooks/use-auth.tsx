"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { LoginFormSchema } from "@/types/auth/login"
import { toast } from "sonner"
import { useDialogStore } from "@/lib/store/dialogs-store"
import { RegistroFormSchema } from "@/types/auth/registro"

interface User {
  id: string
  email: string
  admin: boolean
  suscripcion: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  success: string | null
  isAuthenticated: boolean
  login: (formData: LoginFormSchema) => Promise<boolean>
  register: (userData: RegistroFormSchema) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}



const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { closeDialog } = useDialogStore()

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth()
  }, [])

  // Verificar si el usuario está autenticado
  const checkAuth = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/authenticate`)
      const data = await res.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (err) {
      console.error("Error al verificar autenticación:", err)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }


  // Iniciar sesión
  const login = async (formData: LoginFormSchema): Promise<boolean> => {

    setSuccess(null)
    setError(null)
    setLoading(true)

    try {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (data.error) {
        setError(data.message)
        setIsAuthenticated(false)
        return false
      }
      toast.success("Inicio de sesión exitoso")
      closeDialog()
      setUser(data.cliente)
      setIsAuthenticated(true)
      router.refresh()
      return true
    } catch (err) {
      setError("Error al iniciar sesión")
      setIsAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Registrar usuario
  const register = async (userData: RegistroFormSchema) => {
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(userData),
      })
      const res = await response.json()

      if (res.error) {
        setError(res.message)
        return
      }
      toast.success("Usuario creado correctamente")
      setUser(res.user)
      setIsAuthenticated(true)
      closeDialog()
    } catch (error) {
      console.error("Error al registrar:", error)
      setError("Error al registrar")
    } finally {
      setLoading(false)
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      setLoading(true)
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, { method: "POST" })
      setUser(null)
      setIsAuthenticated(false)
      router.refresh()
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        success,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}

