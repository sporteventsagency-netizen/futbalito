// supabaseClient.ts
/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Citim valorile din .env.local sau din Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Verificare utilă pentru debugging
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase] Lipsesc variabilele VITE_SUPABASE_URL sau VITE_SUPABASE_ANON_KEY.'
  );
}

// Creăm și exportăm clientul Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
