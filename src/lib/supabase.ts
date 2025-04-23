import { createClient } from "@supabase/supabase-js"

// Estas variables de entorno deben configurarse en tu proyecto
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Cliente para uso en el servidor (con clave de servicio)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
})

// Cliente para uso en el cliente (con clave anónima)
export const supabaseClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "")

export const supabase = supabaseClient
