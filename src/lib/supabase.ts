import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('seu-projeto'))

// Se não estiver configurado, usamos strings vazias para evitar o crash de "url is required" 
// mas não usamos domínios falsos como 'placeholder.supabase.co' para evitar erros de DNS no console.
export const supabase = createClient(
  supabaseUrl || 'https://lib-not-configured.supabase.co', 
  supabaseAnonKey || 'not-configured'
)
