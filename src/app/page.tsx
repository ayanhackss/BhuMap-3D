"use client";

/* Hallmark · genre: modern-minimal · macrostructure: Workbench · nav: N5 Floating-pill · footer: Ft2 Minimal · theme: Quiet
 * Pre-emit critique: P5 H5 E5 S4 R5 V4
 * Audience: govt officials + SIH judges · Use: evaluate & sign in · Tone: utilitarian
 */

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight, Layers, Box, Zap, ShieldCheck,
  Database, BarChart3, Building2, Cpu, ChevronRight
} from "lucide-react";

/* ── Intersection-triggered counter ── */
function useCounter(target: number, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const step = target / (duration / 16);
      let v = 0;
      const id = setInterval(() => {
        v = Math.min(v + step, target);
        setCount(Math.floor(v));
        if (v >= target) clearInterval(id);
      }, 16);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function KpiCell({ n, label, sub }: { n: number; label: string; sub: string }) {
  const { count, ref } = useCounter(n);
  return (
    <div ref={ref} style={{ padding: "28px 24px", borderRight: "1px solid var(--color-rule)" }}>
      <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.04em", lineHeight: 1 }}>
        {count}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginTop: 6 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 3, lineHeight: 1.5 }}>{sub}</div>
    </div>
  );
}

function CapabilityRow({ icon: Icon, title, desc, tag }: { icon: React.ElementType; title: string; desc: string; tag: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr auto",
        gap: "0 20px",
        alignItems: "start",
        padding: "20px 0",
        borderBottom: "1px solid var(--color-rule)",
        cursor: "default",
        transition: "opacity 0.15s",
        opacity: hov ? 1 : 0.9,
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 8, border: "1px solid var(--color-rule)",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: hov ? "var(--color-paper-2)" : "transparent",
        transition: "background 0.15s",
        flexShrink: 0,
      }}>
        <Icon size={17} style={{ color: hov ? "var(--color-accent)" : "var(--color-muted)" }} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", marginBottom: 4 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.6 }}>{desc}</div>
      </div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
        color: "var(--color-muted)", paddingTop: 2, whiteSpace: "nowrap",
      }}>{tag}</div>
    </div>
  );
}

function FloorRow({ floor, id, type, status }: { floor: string; id: string; type: string; status: "verified" | "draft" }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "44px 1fr 80px 70px",
      gap: "0 16px", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid var(--color-rule)",
      fontSize: 12,
    }}>
      <div style={{
        fontSize: 10, fontWeight: 800, color: "var(--color-accent)",
        background: "rgba(59,130,246,0.08)", borderRadius: 4,
        padding: "4px 6px", textAlign: "center",
      }}>{floor}</div>
      <span style={{ fontFamily: "var(--font-family-mono)", fontSize: 10.5, color: "var(--color-muted)" }}>{id}</span>
      <span style={{ color: "var(--color-muted)" }}>{type}</span>
      <span style={{
        fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 9999,
        background: status === "verified" ? "rgba(22,163,74,0.1)" : "rgba(107,114,128,0.1)",
        color: status === "verified" ? "#16a34a" : "#6b7280",
        textAlign: "center",
      }}>{status === "verified" ? "Verified" : "Draft"}</span>
    </div>
  );
}

export default function RootPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-background)",
      color: "var(--color-ink)",
      fontFamily: "var(--font-family-sans)",
    }}>

      {/* ── N5 Floating pill nav ── */}
      <nav style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)", zIndex: 100 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 28,
          padding: "9px 18px", borderRadius: 9999,
          background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)",
          backdropFilter: "blur(16px)",
          border: "1px solid var(--color-rule)",
          boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.05)",
          transition: "all 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 24, height: 24, borderRadius: 5, background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={12} color="#fff" />
            </div>
            <span style={{ fontSize: 13.5, fontWeight: 800, letterSpacing: "-0.025em", color: "var(--color-ink)" }}>3D-BhuMap</span>
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 13, fontWeight: 500, color: "var(--color-muted)" }}>
            {["Platform", "3D-ULPIN", "Stack"].map(lbl => (
              <a key={lbl} href={`#${lbl.toLowerCase().replace("-", "")}`} style={{
                textDecoration: "none", color: "inherit", transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--color-ink)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--color-muted)")}
              >{lbl}</a>
            ))}
          </div>
          <div style={{ width: 1, height: 14, background: "var(--color-rule)" }} />
          {user ? (
            <button onClick={() => router.push("/dashboard")} style={{
              fontSize: 13, fontWeight: 600, color: "var(--color-accent)",
              background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, padding: 0,
            }}>Dashboard <ArrowRight size={12} /></button>
          ) : (
            <Link href="/login" style={{
              fontSize: 12.5, fontWeight: 700, color: "#fff",
              background: "var(--color-accent)", padding: "5px 14px", borderRadius: 9999,
              textDecoration: "none", transition: "opacity 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >Sign In</Link>
          )}
        </div>
      </nav>

      {/* ── Premium Marquee Hero ── */}
      <section style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--color-background)",
      }}>
        {/* Dot-grid texture — very subtle */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "radial-gradient(circle, #d0d5e3 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.55,
        }} />
        {/* Soft radial wash — top-left bloom */}
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "60vw", height: "60vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
          pointerEvents: "none", zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "140px 40px 100px", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "0 64px", alignItems: "center" }}>

            {/* ── Left: Headline + CTA ── */}
            <div>
              {/* Eyebrow pill */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "5px 14px 5px 8px", borderRadius: 9999,
                border: "1px solid var(--color-rule)",
                background: "var(--color-paper)",
                fontSize: 11.5, fontWeight: 600, color: "var(--color-muted)",
                marginBottom: 32,
                animation: "fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  background: "rgba(59,130,246,0.1)", color: "var(--color-accent)",
                  padding: "2px 8px", borderRadius: 9999, fontSize: 10.5, fontWeight: 700,
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-accent)", display: "inline-block", animation: "pulse 2s infinite" }} />
                  Live Demo
                </span>
                SIH 2026 · Problem Statement GIS-042
              </div>

              {/* Display headline */}
              <h1 style={{
                fontSize: "clamp(3rem, 5.5vw, 5rem)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 1.02,
                color: "var(--color-ink)",
                margin: "0 0 28px",
                overflowWrap: "anywhere",
                minWidth: 0,
                animation: "fadeUp 0.55s 0.07s cubic-bezier(0.16,1,0.3,1) both",
              }}>
                India's first<br />
                <span style={{
                  background: "linear-gradient(90deg, var(--color-ink) 60%, var(--color-accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>3D cadastral</span><br />
                platform.
              </h1>

              {/* Sub */}
              <p style={{
                fontSize: 17,
                color: "var(--color-muted)",
                lineHeight: 1.68,
                maxWidth: "38ch",
                marginBottom: 40,
                animation: "fadeUp 0.55s 0.14s cubic-bezier(0.16,1,0.3,1) both",
              }}>
                Extend India's 2D ULPIN land records into a full volumetric spatial database — with automated 3DSPID generation, topology conflict detection, and government approval workflows.
              </p>

              {/* CTAs */}
              <div style={{
                display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
                animation: "fadeUp 0.55s 0.21s cubic-bezier(0.16,1,0.3,1) both",
              }}>
                <Link href="/login" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "13px 26px", borderRadius: 9999,
                  background: "var(--color-ink)", color: "var(--color-paper)",
                  fontWeight: 700, fontSize: 14.5, textDecoration: "none",
                  transition: "opacity 0.15s, box-shadow 0.15s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.14)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "0.84"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.18)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.14)"; }}
                >
                  Enter Platform <ArrowRight size={15} />
                </Link>
                <a href="#platform" style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "13px 24px", borderRadius: 9999,
                  border: "1px solid var(--color-rule)",
                  color: "var(--color-muted)", fontWeight: 600, fontSize: 14.5,
                  textDecoration: "none", transition: "border-color 0.15s, color 0.15s",
                  background: "var(--color-paper)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.color = "var(--color-ink)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-rule)"; e.currentTarget.style.color = "var(--color-muted)"; }}
                >
                  Explore Features <ChevronRight size={14} />
                </a>
              </div>

              {/* Trust strip */}
              <div style={{
                display: "flex", gap: 20, marginTop: 44, flexWrap: "wrap",
                animation: "fadeUp 0.55s 0.28s cubic-bezier(0.16,1,0.3,1) both",
              }}>
                {[
                  { val: "10", label: "Parcels mapped" },
                  { val: "22", label: "3DSPIDs issued" },
                  { val: "90%+", label: "AI confidence" },
                  { val: "GIS-042", label: "SIH problem ID" },
                ].map(({ val, label }) => (
                  <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em" }}>{val}</span>
                    <span style={{ fontSize: 11.5, color: "var(--color-muted)", fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Floating product mockup ── */}
            <div style={{
              animation: "fadeUp 0.65s 0.18s cubic-bezier(0.16,1,0.3,1) both",
            }}>
              {/* Outer glow shadow */}
              <div style={{
                borderRadius: 20,
                boxShadow: "0 0 0 1px var(--color-rule), 0 32px 80px rgba(0,0,0,0.10), 0 8px 24px rgba(0,0,0,0.07)",
                background: "var(--color-paper)",
                overflow: "hidden",
                animation: "floatY 6s ease-in-out infinite",
              }}>

                {/* ── Window chrome bar ── */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 16px",
                  background: "var(--color-paper-2)",
                  borderBottom: "1px solid var(--color-rule)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Layers size={11} color="#fff" />
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.01em" }}>3D-BhuMap</span>
                    <span style={{ fontSize: 10, color: "var(--color-muted)", padding: "1px 6px", border: "1px solid var(--color-rule)", borderRadius: 4 }}>3D GIS Map</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 9999, background: "rgba(22,163,74,0.1)", color: "#16a34a", letterSpacing: "0.04em" }}>● DB Live</span>
                  </div>
                </div>

                {/* ── Topbar toolbar ── */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 14px",
                  borderBottom: "1px solid var(--color-rule)",
                  background: "var(--color-background)",
                  flexWrap: "wrap",
                }}>
                  {["Demo Area", "Explode Building", "Underground Mode", "AI Extract", "Detect Conflicts"].map((lbl, i) => (
                    <span key={lbl} style={{
                      fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 9999,
                      background: i === 0 ? "var(--color-accent)" : "var(--color-paper)",
                      color: i === 0 ? "#fff" : "var(--color-muted)",
                      border: `1px solid ${i === 0 ? "var(--color-accent)" : "var(--color-rule)"}`,
                      letterSpacing: "0.01em",
                    }}>{lbl}</span>
                  ))}
                </div>

                {/* ── Main content: map placeholder + right panel ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 200px" }}>
                  {/* Map area */}
                  <div style={{
                    height: 260,
                    background: "linear-gradient(135deg, #e8f0fe 0%, #d4e4f7 40%, #c5daf4 100%)",
                    position: "relative", overflow: "hidden",
                    borderRight: "1px solid var(--color-rule)",
                  }}>
                    {/* Fake buildings grid */}
                    {[
                      { x: 20, y: 30, w: 80, h: 60, opacity: 0.7 },
                      { x: 110, y: 20, w: 60, h: 80, opacity: 0.85 },
                      { x: 60, y: 110, w: 100, h: 50, opacity: 0.6 },
                      { x: 180, y: 50, w: 70, h: 70, opacity: 0.5 },
                      { x: 240, y: 120, w: 50, h: 60, opacity: 0.65 },
                    ].map((b, i) => (
                      <div key={i} style={{
                        position: "absolute", left: b.x, top: b.y,
                        width: b.w, height: b.h,
                        background: `rgba(59,130,246,${b.opacity * 0.6})`,
                        border: "1px solid rgba(59,130,246,0.3)",
                        borderRadius: 2,
                      }} />
                    ))}
                    {/* Selected building highlight */}
                    <div style={{
                      position: "absolute", left: 110, top: 20, width: 60, height: 80,
                      background: "rgba(59,130,246,0.25)",
                      border: "2px solid var(--color-accent)",
                      borderRadius: 2,
                      boxShadow: "0 0 0 4px rgba(59,130,246,0.12)",
                    }} />
                    {/* Coordinates bar */}
                    <div style={{
                      position: "absolute", bottom: 8, left: 8,
                      fontSize: 9, fontFamily: "var(--font-family-mono)",
                      color: "rgba(30,60,100,0.7)",
                      background: "rgba(255,255,255,0.8)", padding: "3px 8px", borderRadius: 4,
                    }}>
                      Lat: 25.590200  Lng: 85.098000  ·  EPSG:4326
                    </div>
                    <div style={{
                      position: "absolute", bottom: 8, right: 8,
                      fontSize: 9, color: "rgba(30,60,100,0.7)",
                      background: "rgba(255,255,255,0.8)", padding: "3px 8px", borderRadius: 4,
                    }}>
                      Scale: 1:4514
                    </div>
                  </div>

                  {/* Right property panel */}
                  <div style={{ background: "var(--color-paper)", overflow: "hidden" }}>
                    <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--color-rule)", background: "var(--color-paper-2)" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-muted)", marginBottom: 4 }}>Selected</div>
                      <div style={{ fontSize: 9, fontFamily: "var(--font-family-mono)", color: "var(--color-accent)", lineHeight: 1.5 }}>3DSPID-IN-BR-<br />0001-F02-U001</div>
                    </div>
                    <div style={{ padding: "8px 12px" }}>
                      {[
                        ["Building", "Urban Tower A"],
                        ["Floor", "Second"],
                        ["Unit", "F2-A01"],
                        ["Type", "Residential"],
                      ].map(([k, v]) => (
                        <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid var(--color-rule)", fontSize: 10 }}>
                          <span style={{ color: "var(--color-muted)" }}>{k}</span>
                          <span style={{ fontWeight: 600, color: "var(--color-ink)" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    {/* Quality bar */}
                    <div style={{ padding: "8px 12px", borderTop: "1px solid var(--color-rule)" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--color-muted)", marginBottom: 8 }}>AI Confidence</div>
                      <div style={{ fontSize: 10, display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ color: "var(--color-muted)" }}>Score</span>
                        <span style={{ fontWeight: 700, color: "#16a34a" }}>90.4%</span>
                      </div>
                      <div style={{ height: 3, background: "var(--color-rule)", borderRadius: 9999 }}>
                        <div style={{ height: "100%", width: "90.4%", background: "#16a34a", borderRadius: 9999 }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Bottom status bar ── */}
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 14px",
                  background: "var(--color-paper-2)",
                  borderTop: "1px solid var(--color-rule)",
                  fontSize: 9.5,
                  fontFamily: "var(--font-family-mono)",
                  color: "var(--color-muted)",
                }}>
                  <span>CRS: WGS84 / EPSG:4326</span>
                  <span>Source: Survey of India · ISRO Cartosat-3</span>
                  <span style={{ color: "#16a34a", fontWeight: 700 }}>● Live · Supabase PostGIS</span>
                </div>
              </div>

              {/* Floating notification card — conflict alert */}
              <div style={{
                position: "absolute",
                bottom: -20, right: -16,
                background: "var(--color-paper)",
                border: "1px solid var(--color-rule)",
                borderRadius: 12,
                padding: "10px 14px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
                fontSize: 11,
                maxWidth: 200,
                animation: "floatY 6s 1.5s ease-in-out infinite",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ef4444", display: "block", flexShrink: 0 }} />
                  <span style={{ fontWeight: 700, color: "var(--color-ink)" }}>Conflict Detected</span>
                </div>
                <div style={{ fontSize: 10.5, color: "var(--color-muted)", lineHeight: 1.5 }}>
                  Basement 2 intersects with Main Sewer Line at elev. 475–50.0m
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ── KPI Strip ── */}
      <section style={{ borderTop: "1px solid var(--color-rule)", borderBottom: "1px solid var(--color-rule)", marginTop: 72 }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
          <KpiCell n={10} label="Total Parcels" sub="Cadastral parcels" />
          <KpiCell n={6} label="3D Mapped" sub="With volumetric data" />
          <KpiCell n={6} label="Buildings" sub="AI-extracted" />
          <KpiCell n={22} label="Property Units" sub="3DSPID-registered" />
          <KpiCell n={3} label="Underground" sub="Utility networks" />
          <div style={{ padding: "28px 24px" }}>
            <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#ef4444", letterSpacing: "-0.04em", lineHeight: 1 }}>1</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-ink)", marginTop: 6 }}>Open Conflict</div>
            <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 3 }}>Spatial overlap</div>
          </div>
        </div>
      </section>

      {/* ── Platform capabilities (Workbench row list) ── */}
      <section id="platform" style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "0 80px" }}>
          {/* Sticky label */}
          <div>
            <div style={{
              position: "sticky", top: 96,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>
                Platform
              </div>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-ink)", marginBottom: 16, overflowWrap: "anywhere", minWidth: 0 }}>
                Everything you need for 3D cadastral mapping
              </h2>
              <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.7 }}>
                A complete sovereign platform built for India's national land governance transition from 2D to 3D.
              </p>
            </div>
          </div>

          {/* Capability rows */}
          <div>
            <CapabilityRow icon={Layers} title="Multi-Layer Geometry Ingestion" desc="Accepts IFC, Point Clouds, and GeoJSON. Automatically extrudes volumes and maps 3D topological relationships." tag="Core" />
            <CapabilityRow icon={Box} title="3DSPID Generation" desc="Every vertical unit receives a mathematically precise 3D Spatial Property Identifier bound to the national ULPIN grid." tag="Core" />
            <CapabilityRow icon={Zap} title="Conflict Detection Engine" desc="Automated clash detection across surface properties and underground utilities. Flags boundary overlaps with severity scoring." tag="Quality" />
            <CapabilityRow icon={Building2} title="AI Building Extraction" desc="Computer vision pipeline extracts building footprints from satellite imagery with 90%+ AI confidence scores." tag="AI" />
            <CapabilityRow icon={Cpu} title="Background Processing Queue" desc="Track, retry, and review AI jobs across datasets. Full audit trail for every processing step." tag="Infra" />
            <CapabilityRow icon={ShieldCheck} title="Government Approval Workflow" desc="Role-based sign-off, digital audit trails, and tamper-evident records for every property state change." tag="Governance" />
            <CapabilityRow icon={Database} title="Spatial Database" desc="PostGIS-backed with full 3D geometry support, version history, and national EPSG coordinate standardisation." tag="Infra" />
            <CapabilityRow icon={BarChart3} title="Reports & Exports" desc="Generate PDF cadastral certificates, export GeoJSON boundaries, and produce government-grade statistical summaries." tag="Output" />
          </div>
        </div>
      </section>

      {/* ── 3D-ULPIN process ── */}
      <section id="3dulpin" style={{ borderTop: "1px solid var(--color-rule)", background: "var(--color-paper)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px", alignItems: "start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 12 }}>
                3D-ULPIN Standard
              </div>
              <h2 style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--color-ink)", marginBottom: 20, overflowWrap: "anywhere", minWidth: 0 }}>
                One ID for every vertical property unit
              </h2>
              <p style={{ fontSize: 14, color: "var(--color-muted)", lineHeight: 1.75, marginBottom: 32 }}>
                The 3DSPID extends the national ULPIN framework into the Z-axis. Each unit in a multi-storey building receives a unique, persistent, legally-valid identifier tied to its exact 3D bounding volume.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {[
                  { n: "01", t: "Parcel ingestion", d: "2D cadastral parcel ingested from state land records, assigned a ULPIN." },
                  { n: "02", t: "Building extraction", d: "AI extracts 3D footprint and extrudes floors from IFC or survey data." },
                  { n: "03", t: "3DSPID generation", d: "Each floor–unit pair issued a unique 3DSPID in the national registry." },
                  { n: "04", t: "Topology validation", d: "Automated checks verify no inter-unit overlaps or undeclared voids." },
                ].map(({ n, t, d }) => (
                  <div key={n} style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: "1px solid var(--color-rule)" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "var(--color-accent)", letterSpacing: "0.04em", minWidth: 28, paddingTop: 2 }}>{n}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-ink)", marginBottom: 4 }}>{t}</div>
                      <div style={{ fontSize: 13, color: "var(--color-muted)", lineHeight: 1.6 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — integration stack */}
            <div id="stack">
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-accent)", marginBottom: 20 }}>
                Sovereign Stack
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { name: "ULPIN", desc: "National parcel IDs" },
                  { name: "Bhuvan ISRO", desc: "Satellite imagery" },
                  { name: "DigiLocker", desc: "Document chain" },
                  { name: "Supabase", desc: "Realtime database" },
                  { name: "PostGIS", desc: "3D spatial queries" },
                  { name: "CesiumJS", desc: "3D globe renderer" },
                  { name: "Next.js 16", desc: "App framework" },
                  { name: "e-Stamp API", desc: "Digital seals" },
                ].map(({ name, desc }) => (
                  <div key={name} style={{
                    padding: "16px",
                    border: "1px solid var(--color-rule)",
                    borderRadius: 8,
                    background: "var(--color-background)",
                    transition: "border-color 0.15s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--color-accent)")}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--color-rule)")}
                  >
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--color-ink)", marginBottom: 3 }}>{name}</div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA strip ── */}
      <section style={{
        borderTop: "1px solid var(--color-rule)",
        background: "var(--color-paper)",
        padding: "72px 32px",
      }}>
        <div style={{
          maxWidth: 1120, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 24,
        }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", fontWeight: 800, color: "var(--color-ink)", letterSpacing: "-0.03em", marginBottom: 8, overflowWrap: "anywhere", minWidth: 0 }}>
              Ready to explore the demo?
            </h2>
            <p style={{ fontSize: 14, color: "var(--color-muted)", maxWidth: "48ch" }}>
              Log in with demo credentials — no setup required. Full platform access for evaluation.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "11px 22px", borderRadius: 9999,
              background: "var(--color-ink)", color: "var(--color-background)",
              fontWeight: 700, fontSize: 14, textDecoration: "none",
              transition: "opacity 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Enter Platform <ArrowRight size={14} />
            </Link>
            <Link href="/login" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "11px 22px", borderRadius: 9999,
              border: "1px solid var(--color-rule)",
              color: "var(--color-muted)", fontWeight: 600, fontSize: 14,
              textDecoration: "none", transition: "border-color 0.15s, color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-ink)"; e.currentTarget.style.color = "var(--color-ink)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--color-rule)"; e.currentTarget.style.color = "var(--color-muted)"; }}
            >
              View Demo Credentials
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ft2 Minimal footer ── */}
      <footer style={{
        borderTop: "1px solid var(--color-rule)",
        padding: "20px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={10} color="#fff" />
          </div>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--color-ink)", letterSpacing: "-0.015em" }}>3D-BhuMap</span>
        </div>
        <span style={{ fontSize: 11.5, color: "var(--color-muted)" }}>
          ⚠ SIH 2026 Demo Prototype · GIS-042 · Data is simulated
        </span>
        <Link href="/login" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--color-accent)", textDecoration: "none" }}>
          Sign in →
        </Link>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
      `}</style>
    </div>
  );
}
