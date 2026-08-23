import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client — uses anon key, respects Row Level Security.
// Safe to import in "use client" components.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// NOTE: For admin/server operations use src/lib/supabase.server.ts (service role key).
// Do NOT add createServiceClient() here — it would leak the secret to the browser bundle.

