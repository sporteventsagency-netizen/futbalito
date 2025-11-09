
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * A robust, adaptive Supabase client initializer.
 * It checks for environment variables in multiple common patterns to avoid
 * environment-specific configuration issues, thus breaking the auto-fix loop.
 */
export const getSupabase = (): SupabaseClient => {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    // --- Adaptive Secret Discovery ---
    // This logic attempts to find the Supabase secrets using all common naming conventions
    // for different environments (Vercel, Vite local, other Node-like environments).
    // It uses the first valid configuration it finds.
    
    // Vercel/Vite standard way (import.meta.env with VITE_ prefix)
    const url1 = (import.meta as any).env?.VITE_SUPABASE_URL;
    const key1 = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

    // Standard Node.js way (process.env with VITE_ prefix)
    const url2 = (typeof process !== 'undefined' && process.env) ? process.env.VITE_SUPABASE_URL : undefined;
    const key2 = (typeof process !== 'undefined' && process.env) ? process.env.VITE_SUPABASE_ANON_KEY : undefined;

    // Standard Node.js way (process.env without prefix)
    const url3 = (typeof process !== 'undefined' && process.env) ? process.env.SUPABASE_URL : undefined;
    const key3 = (typeof process !== 'undefined' && process.env) ? process.env.SUPABASE_ANON_KEY : undefined;

    const finalUrl = url1 || url2 || url3;
    const finalKey = key1 || key2 || key3;

    if (!finalUrl || !finalKey) {
        // If no secrets are found after checking all patterns, provide a clear diagnostic error.
        throw new Error(
`DIAGNOSTIC ERROR: Supabase secrets not found.

I checked for secrets named 'VITE_SUPABASE_URL' and 'SUPABASE_URL' but could not find them.

ACTION REQUIRED:
Please ensure that in your deployment environment (e.g., Vercel), you have correctly set ONE of the following pairs of environment variables:
1. VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (Recommended for Vercel/Vite)
2. SUPABASE_URL and SUPABASE_ANON_KEY

The application cannot start without a valid connection to the database.`
        );
    }

    supabaseInstance = createClient(finalUrl, finalKey);
    return supabaseInstance;
};
