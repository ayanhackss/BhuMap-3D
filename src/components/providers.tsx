"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

/** Syncs Supabase session changes (expiry, sign-out) to Zustand authStore. */
function AuthSync() {
  const { logout, setUser } = useAuthStore();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          logout();
        } else if (event === "TOKEN_REFRESHED" && session?.user) {
          // Keep store in sync if the session user changes
          setUser({
            id: session.user.id,
            email: session.user.email ?? "",
            full_name: session.user.user_metadata?.full_name ?? "",
            role: session.user.user_metadata?.role ?? "public_viewer",
          });
        }
      }
    );
    return () => subscription.unsubscribe();
  }, [logout, setUser]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: true,  // re-validates when user returns to tab
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSync />
      {children}
    </QueryClientProvider>
  );
}

