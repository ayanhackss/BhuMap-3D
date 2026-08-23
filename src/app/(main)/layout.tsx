"use client";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

/**
 * Layout for all /(main) routes.
 * Auth guard is handled by src/middleware.ts (edge layer).
 * We additionally gate the shell render until Zustand has rehydrated from
 * localStorage — this prevents the ~50ms flash where the user appears
 * unauthenticated while the store loads.
 */
export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // useAuthStore.persist.hasHydrated() is true once localStorage is read
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // In case hydration already completed before this effect runs:
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) {
    // Minimal skeleton — prevents layout flash without blocking content long
    return (
      <div style={{ display: "flex", height: "100vh", background: "var(--color-background)" }}>
        <div style={{ width: 240, background: "var(--color-paper)", borderRight: "1px solid var(--color-rule)" }} />
        <div style={{ flex: 1 }} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "var(--color-background)" }}>
      <AppSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        <AppTopbar />
        <main style={{ flex: 1, overflow: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
