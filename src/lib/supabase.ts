import { createClient } from '@supabase/supabase-js'
import { isDemoMode } from '@/config/demo-mode'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('seu-projeto'))

const supabaseClient = createClient(
  supabaseUrl || 'https://lib-not-configured.supabase.co', 
  supabaseAnonKey || 'not-configured'
)

// Proxy para bloquear chamadas no modo demo e garantir que nada seja escrito no banco real
export const supabase = isDemoMode ? new Proxy(supabaseClient, {
  get(target, prop) {
    const original = target[prop as keyof typeof target];
    
    // Bloqueia chamadas de autenticação e banco de dados
    if (prop === 'from') {
      return (table: string) => {
        console.warn(`[MODO DEMO] Chamada interceptada na tabela: ${table}`);
        return {
          select: () => Promise.resolve({ data: [], error: null }),
          insert: (data: any) => {
            console.log(`[MODO DEMO] Tentativa de inserção na tabela ${table} bloqueada:`, data);
            return Promise.resolve({ data, error: null });
          },
          delete: () => {
            console.log(`[MODO DEMO] Tentativa de exclusão na tabela ${table} bloqueada.`);
            return { neq: () => Promise.resolve({ error: null }) };
          },
          update: (data: any) => {
            console.log(`[MODO DEMO] Tentativa de atualização na tabela ${table} bloqueada:`, data);
            return Promise.resolve({ error: null });
          }
        };
      };
    }

    if (prop === 'auth') {
      return {
        ...target.auth,
        signInWithPassword: ({ email }: { email: string }) => {
          console.log(`[MODO DEMO] Login simulado para: ${email}`);
          return Promise.resolve({ data: { user: { email }, session: { access_token: 'demo-token' } }, error: null });
        },
        signOut: () => {
          console.log(`[MODO DEMO] Logout simulado.`);
          return Promise.resolve({ error: null });
        },
        getUser: () => Promise.resolve({ data: { user: { email: 'demo@veolia.com' } }, error: null }),
        getSession: () => Promise.resolve({ data: { session: { access_token: 'demo-token' } }, error: null }),
        onAuthStateChange: (callback: any) => {
          // No modo demo, o estado de auth não muda via Supabase real
          return { data: { subscription: { unsubscribe: () => {} } } };
        }
      };
    }

    return typeof original === 'function' ? original.bind(target) : original;
  }
}) : supabaseClient;
