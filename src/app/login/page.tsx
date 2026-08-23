"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Eye, EyeOff, Loader2, Layers } from "lucide-react";

const DEMO_USERS = [
  { email: "admin@bhumap.gov.in", password: "Admin@123", role: "Super Admin" },
  { email: "authority@bhumap.gov.in", password: "Auth@123", role: "Govt. Authority" },
  { email: "surveyor@bhumap.gov.in", password: "Survey@123", role: "Surveyor" },
  { email: "analyst@bhumap.gov.in", password: "Analyst@123", role: "GIS Analyst" },
];

// LoginForm is extracted so useSearchParams can be used inside Suspense
function LoginForm() {
  const [email, setEmail] = useState("authority@bhumap.gov.in");
  const [password, setPassword] = useState("Auth@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  /** Sets session cookie via server-side API so middleware sees it immediately */
  async function setSessionCookie() {
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "set" }),
    });
  }

  /** Redirect to the originally requested page (if any) or dashboard */
  function redirectAfterLogin() {
    const from = searchParams.get("from");
    router.push(from && from.startsWith("/") ? from : "/dashboard");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ── Demo bypass ─────────────────────────────────────────────────────────
    const demoUser = DEMO_USERS.find(u => u.email === email);
    if (demoUser && password === demoUser.password) {
      const roleMap: Record<string, string> = {
        "Super Admin": "super_admin",
        "Govt. Authority": "government_authority",
        "Surveyor": "surveyor",
        "GIS Analyst": "gis_analyst",
      };
      setUser({
        id: `demo-${Date.now()}`,
        email,
        full_name: demoUser.role + " User",
        role: roleMap[demoUser.role] as never,
        department: "Demo Department",
      });
      // BUG FIX 1: await cookie write BEFORE redirect — middleware must see
      // the cookie on the very first request to the protected route.
      await setSessionCookie();
      redirectAfterLogin();
      // setLoading(false) intentionally omitted — page will unmount on redirect
      return;
    }

    // ── Supabase auth ────────────────────────────────────────────────────────
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid credentials. Use demo credentials below.");
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setUser({
        id: data.user.id,
        email: data.user.email!,
        full_name: profile?.full_name ?? "User",
        role: profile?.role ?? "public_viewer",
        department: profile?.department ?? undefined,
      });
      // BUG FIX 2: await cookie write BEFORE redirect here too
      await setSessionCookie();
      redirectAfterLogin();
      return; // BUG FIX 3: early return — don't fall through to setLoading(false) below
    }

    // Reached only if data.user was null without an error (edge case)
    setError("Authentication failed. Please try again.");
    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "var(--color-paper)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      {/* ── Left branding panel ── */}
      <div
        style={{
          flex: "0 0 52%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3rem",
          background: "var(--color-paper-2)",
          borderRight: "1px solid var(--color-rule)",
          position: "relative",
          overflow: "hidden",
        }}
        className="hidden lg:flex"
      >
        {/* subtle dot grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, oklch(40% 0.008 240) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.4,
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "4rem" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "var(--color-ink)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Layers size={22} color="var(--color-paper)" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
                3D-BhuMap
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--color-muted)", marginTop: 1 }}>
                Government of India
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              marginBottom: "1.25rem",
              maxWidth: "18ch",
            }}
          >
            3D ULPIN Generation &{" "}
            <span style={{ color: "var(--color-accent)" }}>Vertical Property</span>{" "}
            Mapping System
          </h1>

          <p style={{ fontSize: "1rem", color: "var(--color-muted)", lineHeight: 1.7, maxWidth: "42ch", marginBottom: "2.5rem" }}>
            Extending 2D cadastral records into a comprehensive 3D volumetric framework for modern land governance.
          </p>

          {/* Feature pills */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              "3D Spatial Property ID (3DSPID)",
              "AI-Assisted Building Extraction",
              "Underground Infrastructure Mapping",
              "Topology Validation Engine",
              "Government Approval Workflow",
            ].map((f) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--color-accent)",
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, fontSize: "0.75rem", color: "var(--color-muted)" }}>
          Smart India Hackathon 2026 · SIH-2026-GIS-042
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div
        style={{
          flex: "0 0 48%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem",
          overflowY: "auto",
        }}
        className="w-full lg:w-auto"
      >
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--color-ink)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={18} color="var(--color-paper)" />
            </div>
            <span style={{ fontWeight: 700, letterSpacing: "-0.02em" }}>3D-BhuMap</span>
          </div>

          <h2 style={{ fontSize: "1.625rem", fontWeight: 700, letterSpacing: "-0.025em", marginBottom: "0.375rem" }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", marginBottom: "2rem" }}>
            Access the 3D cadastral management platform
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--color-neutral)" }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@bhumap.gov.in"
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 10,
                  background: "var(--color-paper-2)",
                  border: "1px solid var(--color-rule)",
                  color: "var(--color-ink)",
                  fontSize: "0.9375rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--color-rule)")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 500, marginBottom: "0.5rem", color: "var(--color-neutral)" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem 3rem 0.75rem 1rem",
                    borderRadius: 10,
                    background: "var(--color-paper-2)",
                    border: "1px solid var(--color-rule)",
                    color: "var(--color-ink)",
                    fontSize: "0.9375rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--color-accent)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--color-rule)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--color-muted)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "0.75rem 1rem",
                borderRadius: 8,
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                fontSize: "0.875rem",
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.8125rem",
                borderRadius: 9999,
                background: loading ? "var(--color-paper-2)" : "var(--color-ink)",
                color: loading ? "var(--color-muted)" : "var(--color-paper)",
                fontWeight: 600,
                fontSize: "0.9375rem",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                transition: "opacity 0.15s",
                marginTop: "0.25rem",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Authenticating…" : "Sign In"}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-rule)" }}>
            <div style={{ fontSize: "0.6875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-muted)", marginBottom: "0.875rem" }}>
              Demo Credentials
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem" }}>
              {DEMO_USERS.map((u) => (
                <button
                  key={u.email}
                  onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  style={{
                    padding: "0.75rem",
                    borderRadius: 8,
                    textAlign: "left",
                    background: "var(--color-paper-2)",
                    border: "1px solid var(--color-rule)",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-neutral)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-rule)")}
                >
                  <div style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--color-ink)", marginBottom: "0.25rem" }}>
                    {u.role}
                  </div>
                  <div style={{ fontSize: "0.6875rem", color: "var(--color-muted)", fontFamily: "var(--font-family-mono)" }}>
                    {u.email}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", fontSize: "0.6875rem", textAlign: "center", color: "var(--color-muted)", letterSpacing: "0.05em" }}>
            ⚠ DEMO MODE — SIH 2026 · Not for production use
          </div>
        </div>
      </div>
    </div>
  );
}

// Suspense wrapper required by Next.js when using useSearchParams in a page
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
