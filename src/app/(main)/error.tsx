"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

/**
 * Root error boundary for the /(main) route group.
 * Catches any unhandled render errors in dashboard, map, parcels, etc.
 */
export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BhuMap] Page error:", error);
  }, [error]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        padding: "2rem",
        background: "var(--color-background)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          padding: "2rem",
          borderRadius: 16,
          background: "var(--color-paper)",
          border: "1px solid var(--color-rule)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(220,38,38,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
          }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: "#dc2626" }} />
        </div>

        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "var(--color-ink)",
            marginBottom: "0.5rem",
          }}
        >
          Something went wrong
        </h2>

        <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", marginBottom: "0.5rem" }}>
          {error.message || "An unexpected error occurred in this page."}
        </p>

        {error.digest && (
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--color-muted)",
              fontFamily: "var(--font-family-mono)",
              marginBottom: "1.5rem",
            }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            onClick={reset}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: 9999,
              background: "var(--color-accent)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer",
            }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Try again
          </button>
          <Link
            href="/dashboard"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1.25rem",
              borderRadius: 9999,
              background: "var(--color-paper-2)",
              color: "var(--color-ink)",
              fontWeight: 500,
              fontSize: "0.875rem",
              border: "1px solid var(--color-rule)",
              textDecoration: "none",
            }}
          >
            <Home className="w-3.5 h-3.5" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
