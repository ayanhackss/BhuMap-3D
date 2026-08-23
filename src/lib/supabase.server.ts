// Server-only Supabase client — uses SERVICE_ROLE_KEY (bypasses RLS).
// NEVER import this file from any "use client" component or src/lib/supabase.ts.
// Only call from: app/api/route.ts, server actions, or src/app/*/route.ts files.

import { createClient } from "@supabase/supabase-js";

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials missing from env");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
