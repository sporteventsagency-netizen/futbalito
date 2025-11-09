
import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

/**
 * Initializes and returns a singleton Supabase client instance.
 * This final version throws a highly instructional error to guide the user
 * in correctly setting up their environment secrets.
 */
export const getSupabase = (): SupabaseClient => {
    if (supabaseInstance) {
        return supabaseInstance;
    }

    // Standard names for Supabase secrets.
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    // Vercel-specific names for Supabase secrets.
    const vercelSupabaseUrl = process.env.VITE_SUPABASE_URL;
    const vercelSupabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

    const finalUrl = supabaseUrl || vercelSupabaseUrl;
    const finalKey = supabaseAnonKey || vercelSupabaseAnonKey;

    // If secrets are still not found after checking all common names, throw the final instructional error.
    if (!finalUrl || !finalKey) {
        throw new Error(
`URGENT: Supabase secrets are NOT configured correctly in this environment.

ACTION REQUIRED:
1. Find the "Secrets" panel for this project on the platform you are currently using.
2. DELETE any existing secrets related to Supabase to start fresh.
3. Create TWO new secrets with these EXACT names and values:

   - Secret Name: SUPABASE_URL
   - Secret Value: [Paste your Supabase URL from Project Settings -> API]
   
   - Secret Name: SUPABASE_ANON_KEY
   - Secret Value: [Paste your Supabase 'anon' 'public' key from Project Settings -> API]

4. Save the secrets. If the platform has a "Restart" or "Redeploy" button for the development environment, use it.

The application cannot connect to the database until this is fixed.`
        );
    }

    supabaseInstance = createClient(finalUrl, finalKey);
    return supabaseInstance;
};
