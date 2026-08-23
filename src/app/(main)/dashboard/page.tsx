"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  FileText, Building2, Home, Layers, AlertTriangle,
  CheckSquare, Clock, TrendingUp, Map, ArrowRight, Activity, RefreshCw
} from "lucide-react";
import { getStatusBadgeClass, formatArea, truncate } from "@/lib/utils";

/* ── Fetch all dashboard data in one combined async function ── */
async function fetchAllDashboardData() {
  const [statsRes, buildingsRes, propertiesRes, conflictsRes] = await Promise.all([
    supabase.rpc("get_dashboard_stats"),
    supabase.from("buildings").select("building_type, status, ai_confidence"),
    supabase.from("properties").select("approval_status, id"),
    supabase.from("conflicts").select("*").order("created_at", { ascending: false }).limit(5),
  ]);

  // Build property breakdown
  const counts: Record<string, number> = {};
  propertiesRes.data?.forEach((p) => {
    counts[p.approval_status] = (counts[p.approval_status] ?? 0) + 1;
  });
  const propertyBreakdown = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return {
    stats: (statsRes.data as Record<string, number>) ?? {},
    buildings: buildingsRes.data ?? [],
    propertyBreakdown,
    recentConflicts: conflictsRes.data ?? [],
    // Used to compute dynamic demo steps
    propertyCount: propertiesRes.data?.length ?? 0,
    conflictCount: conflictsRes.data?.length ?? 0,
  };
}

const STATUS_COLORS: Record<string, string> = {
  verified:        "#16a34a",
  provisional:     "#d97706",
  draft:           "#6b7280",
  rejected:        "#dc2626",
  requires_review: "#9333ea",
  processing:      "#0ea5e9",
  archived:        "#64748b",
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#dc2626",
  high:     "#ea580c",
  medium:   "#d97706",
  low:      "#84cc16",
};

/* ── "Updated Xs ago" ticker ── */
function useLastUpdated(dataUpdatedAt: number | undefined) {
  const [label, setLabel] = useState("just now");
  useEffect(() => {
    if (!dataUpdatedAt) return;
    const tick = () => {
      const s = Math.floor((Date.now() - dataUpdatedAt) / 1000);
      if (s < 5) setLabel("just now");
      else if (s < 60) setLabel(`${s}s ago`);
      else setLabel(`${Math.floor(s / 60)}m ago`);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, [dataUpdatedAt]);
  return label;
}

export default function DashboardPage() {
  const { data, isLoading, dataUpdatedAt, refetch, isFetching } = useQuery({
    queryKey: ["dashboard-all"],
    queryFn: fetchAllDashboardData,
    refetchInterval: 30_000,
  });

  const updatedLabel = useLastUpdated(dataUpdatedAt);

  const stats             = data?.stats ?? {};
  const buildings         = data?.buildings ?? [];
  const propertyBreakdown = data?.propertyBreakdown ?? [];
  const recentConflicts   = data?.recentConflicts ?? [];

  const confidenceData = [
    { range: "90–100%", count: buildings.filter(b => (b.ai_confidence ?? 0) >= 90).length,  label: "Very High" },
    { range: "80–90%",  count: buildings.filter(b => (b.ai_confidence ?? 0) >= 80 && (b.ai_confidence ?? 0) < 90).length, label: "High" },
    { range: "60–80%",  count: buildings.filter(b => (b.ai_confidence ?? 0) >= 60 && (b.ai_confidence ?? 0) < 80).length, label: "Moderate" },
    { range: "<60%",    count: buildings.filter(b => (b.ai_confidence ?? 0) < 60).length,   label: "Low" },
  ];

  const KPI_CARDS = [
    { label: "Total Parcels",       value: stats.total_parcels      ?? 0, icon: FileText,      color: "#1565c0", link: "/parcels",    sublabel: "Active cadastral parcels" },
    { label: "3D Mapped",           value: stats.mapped_3d          ?? 0, icon: Map,           color: "#0288d1", link: "/map",        sublabel: "Parcels with 3D data" },
    { label: "Buildings",           value: stats.total_buildings    ?? 0, icon: Building2,     color: "#00796b", link: "/buildings",  sublabel: "Extracted buildings" },
    { label: "Property Units",      value: stats.total_properties   ?? 0, icon: Home,          color: "#7b1fa2", link: "/properties", sublabel: "3DSPID-registered units" },
    { label: "Underground Assets",  value: stats.underground_assets ?? 0, icon: Layers,        color: "#e65100", link: "/map",        sublabel: "Utility networks" },
    { label: "Pending Verification",value: stats.pending_verification ?? 0, icon: Clock,       color: "#f57f17", link: "/approvals",  sublabel: "Awaiting review" },
    { label: "Open Conflicts",      value: stats.open_conflicts     ?? 0, icon: AlertTriangle, color: "#b71c1c", link: "/conflicts",  sublabel: "Spatial conflicts detected" },
    { label: "High Confidence",     value: stats.high_confidence    ?? 0, icon: TrendingUp,    color: "#2e7d32", link: "/properties", sublabel: "AI confidence ≥ 80%" },
  ];

  // Computed demo steps — done state based on real data
  const DEMO_STEPS = [
    { step: "1", label: "Open 3D Map",              href: "/map",       done: true },
    { step: "2", label: "Select Urban Tower A",      href: "/map",       done: true },
    { step: "3", label: "View 3DSPID identifiers",   href: "/properties", done: (data?.propertyCount ?? 0) > 0 },
    { step: "4", label: "Enable Underground Mode",   href: "/map",       done: false },
    { step: "5", label: "Run Conflict Detection",    href: "/conflicts",  done: (data?.conflictCount ?? 0) > 0 },
    { step: "6", label: "Approve in Workflow",       href: "/approvals",  done: (stats.pending_verification ?? 0) === 0 && !isLoading },
    { step: "7", label: "Generate PDF Report",       href: "/reports",    done: false },
  ];

  /* Shared tooltip style — correct for light theme */
  const tooltipStyle = {
    contentStyle: {
      background: "var(--color-paper)",
      border: "1px solid var(--color-rule)",
      borderRadius: 8,
      color: "var(--color-ink)",
      fontSize: 12,
    },
  };

  return (
    <div className="p-6 space-y-6 overflow-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)]">Mapping Progress Overview</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Patna, Bihar — SIH 2026 Demo Area · Real-time data from Supabase
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Last-updated ticker */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
            style={{ color: "var(--color-muted)", border: "1px solid var(--color-rule)", background: "var(--color-paper)" }}
            title="Refresh data"
          >
            <RefreshCw
              className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`}
              style={{ color: "var(--color-muted)" }}
            />
            Updated {updatedLabel}
          </button>
          <Link
            href="/map"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all bg-[var(--color-accent)] hover:opacity-90"
          >
            <Map className="w-4 h-4" />
            Open 3D Map
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.link}
              className="p-4 rounded-xl flex flex-col gap-3 transition-all group bg-[var(--color-paper)] border border-[var(--color-rule)] hover:border-[var(--color-neutral)]"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}18` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <ArrowRight
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--color-muted)" }}
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--color-ink)]">
                  {isLoading
                    ? <div className="h-8 w-16 rounded animate-pulse" style={{ background: "var(--color-rule)" }} />
                    : card.value.toLocaleString()}
                </div>
                <div className="text-xs font-medium mt-0.5" style={{ color: "var(--color-muted)" }}>{card.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{card.sublabel}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Property Approval Status */}
        <div className="p-5 rounded-xl border" style={{ background: "var(--color-paper)", borderColor: "var(--color-rule)" }}>
          <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-4">Property Approval Status</h3>
          {propertyBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={propertyBreakdown}
                  cx="50%" cy="50%"
                  innerRadius={50} outerRadius={75}
                  dataKey="value"
                >
                  {propertyBreakdown.map((entry, index) => (
                    <Cell key={index} fill={STATUS_COLORS[entry.name] ?? "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 rounded-lg animate-pulse" style={{ background: "var(--color-rule)" }} />
          )}
          <div className="space-y-1.5 mt-2">
            {propertyBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS_COLORS[item.name] ?? "#6b7280" }} />
                  <span style={{ color: "var(--color-muted)" }}>{item.name.replace(/_/g, " ")}</span>
                </div>
                <span className="font-medium text-[var(--color-ink)]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Confidence Distribution */}
        <div className="p-5 rounded-xl border" style={{ background: "var(--color-paper)", borderColor: "var(--color-rule)" }}>
          <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-4">AI Confidence Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={confidenceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--color-muted)" }} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="count" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Demo Quick Actions — computed steps */}
        <div className="p-5 rounded-xl border" style={{ background: "var(--color-paper)", borderColor: "var(--color-rule)" }}>
          <h3 className="text-sm font-semibold text-[var(--color-ink)] mb-4">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
              Demo Flow — Judge Walkthrough
            </span>
          </h3>
          <div className="space-y-2">
            {DEMO_STEPS.map((item) => (
              <Link
                key={item.step}
                href={item.href}
                className="flex items-center gap-3 p-2 rounded-lg text-xs transition-all hover:bg-[var(--color-paper-2)]"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                  style={
                    item.done
                      ? { background: "#16a34a", color: "#fff" }
                      : { background: "var(--color-paper-2)", border: "1px solid var(--color-rule)", color: "var(--color-muted)" }
                  }
                >
                  {item.done ? "✓" : item.step}
                </div>
                <span style={{ color: item.done ? "var(--color-muted)" : "var(--color-ink)", textDecoration: item.done ? "line-through" : "none" }}>
                  {item.label}
                </span>
                <ArrowRight className="w-3 h-3 ml-auto" style={{ color: "var(--color-muted)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conflicts — uses truncate() util */}
      <div className="p-5 rounded-xl border" style={{ background: "var(--color-paper)", borderColor: "var(--color-rule)" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">Recent Spatial Conflicts</h3>
          <Link href="/conflicts" className="text-xs flex items-center gap-1" style={{ color: "var(--color-accent)" }}>
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentConflicts.length > 0 ? (
          <div className="space-y-2">
            {recentConflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "var(--color-paper-2)" }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: SEVERITY_COLORS[conflict.severity] ?? "#d97706" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-ink)] truncate">{conflict.conflict_type}</div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {/* Fix 10: use truncate() util instead of raw .slice() */}
                    {truncate(conflict.description ?? "", 100)}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(conflict.status)}`}>
                    {conflict.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-center py-8" style={{ color: "var(--color-muted)" }}>
            No conflicts detected
          </div>
        )}
      </div>

      {/* Demo watermark */}
      <div className="text-xs text-center py-2" style={{ color: "var(--color-muted)" }}>
        ⚠ DEMO PROTOTYPE — Data is simulated for SIH 2026. Not for production use. · 3D-BhuMap v1.0.0-sih2026
      </div>
    </div>
  );
}
