"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, hasPermission } from "@/store/authStore";
import {
  LayoutDashboard, Map, FileText, Building2,
  Home, Compass, Database, Cpu, CheckSquare, AlertTriangle,
  ClipboardCheck, BarChart2, ScrollText, Settings, ChevronLeft,
  ChevronRight, LogOut, Layers
} from "lucide-react";

// requiredPermission: if set, item is hidden unless user has this permission
const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/map", icon: Map, label: "3D Map", highlight: true },
  { divider: true, label: "Data" },
  { href: "/parcels", icon: FileText, label: "Parcels" },
  { href: "/buildings", icon: Building2, label: "Buildings" },
  { href: "/properties", icon: Home, label: "Properties" },
  { href: "/surveys", icon: Compass, label: "Surveys", requiredPermission: "survey" },
  { divider: true, label: "Processing" },
  { href: "/datasets", icon: Database, label: "Datasets", requiredPermission: "import" },
  { href: "/processing", icon: Cpu, label: "Processing", requiredPermission: "import" },
  { divider: true, label: "Quality" },
  { href: "/validation", icon: CheckSquare, label: "Validation", requiredPermission: "analyze" },
  { href: "/conflicts", icon: AlertTriangle, label: "Conflicts", requiredPermission: "run_conflict" },
  { href: "/approvals", icon: ClipboardCheck, label: "Approvals", requiredPermission: "approve" },
  { divider: true, label: "Administration" },
  { href: "/reports", icon: BarChart2, label: "Reports", requiredPermission: "generate_report" },
  { href: "/audit", icon: ScrollText, label: "Audit Log", requiredPermission: "view_all" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

const W_OPEN = 168;
const W_CLOSED = 52;

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    // Clear cookie via API then redirect
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    }).finally(() => {
      logout();
      router.push("/login");
    });
  }

  // User initial for avatar
  const initials = (user?.full_name || user?.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const rolePretty = user?.role
    ?.split("_")
    .map((w) => w.toUpperCase())
    .join(" ") ?? "PUBLIC";

  return (
    <aside
      style={{
        width: collapsed ? W_CLOSED : W_OPEN,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: "#ffffff",
        borderRight: "1px solid #e2e6ef",
        transition: "width 0.2s ease",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      {/* ── Brand header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          height: 52,
          borderBottom: "1px solid #e2e6ef",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, overflow: "hidden" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Layers size={15} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#111827",
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                3D-BhuMap
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  color: "#9ca3af",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}
              >
                SIH 2026 PROTOTYPE
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* ── Nav ── */}
      <nav
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 6px",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {NAV_ITEMS.filter((item) => {
          // Always show dividers (filtered below if section becomes empty)
          if ("divider" in item) return true;
          // Items without a permission requirement are visible to all
          if (!item.requiredPermission) return true;
          // super_admin sees everything
          if (!user?.role) return false;
          return hasPermission(user.role, item.requiredPermission);
        }).map((item, idx) => {
          if ("divider" in item) {
            if (collapsed) {
              return (
                <div
                  key={idx}
                  style={{
                    height: 1,
                    background: "#e5e7eb",
                    margin: "10px 4px",
                  }}
                />
              );
            }
            return (
              <div
                key={idx}
                style={{
                  padding: "14px 8px 4px",
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                }}
              >
                {item.label}
              </div>
            );
          }

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href!));
          const Icon = item.icon!;

          return (
            <Link
              key={item.href}
              href={item.href!}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: collapsed ? "7px 0" : "7px 8px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 6,
                textDecoration: "none",
                fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#111827" : "#6b7280",
                background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                borderLeft: isActive ? "2px solid #3b82f6" : "2px solid transparent",
                transition: "all 0.12s",
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#111827";
                  e.currentTarget.style.background = "rgba(59,130,246,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "#6b7280";
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <Icon
                size={15}
                style={{
                  flexShrink: 0,
                  color: isActive
                    ? "#3b82f6"
                    : item.highlight
                    ? "#3b82f6"
                    : "#9ca3af",
                }}
              />
              {!collapsed && (
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.label}
                </span>
              )}
              {!collapsed && item.highlight && !isActive && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#3b82f6",
                    flexShrink: 0,
                    animation: "pulse 2s infinite",
                  }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div
        style={{
          padding: "10px 8px",
          borderTop: "1px solid #e2e6ef",
          flexShrink: 0,
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "#e2e6ef",
            border: "1px solid #d0d5e3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontSize: 11,
            fontWeight: 700,
            color: "#374151",
          }}
        >
          {initials}
        </div>

        {!collapsed && (
          <>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.full_name?.split(" ").slice(0, 2).join(" ") || "Guest"}
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#16a34a",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {rolePretty}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                display: "flex",
                alignItems: "center",
                padding: 4,
                borderRadius: 4,
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
            >
              <LogOut size={13} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
