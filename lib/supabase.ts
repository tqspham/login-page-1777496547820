import { createClient } from '@supabase/supabase-js';

let cachedSupabase: ReturnType<typeof createClient> | null = null;

export function getSupabase(): ReturnType<typeof createClient> {
  if (cachedSupabase) {
    return cachedSupabase;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase credentials not configured');
  }

  cachedSupabase = createClient(supabaseUrl, supabaseKey);
  return cachedSupabase;
}