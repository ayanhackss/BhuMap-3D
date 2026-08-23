"use client";

import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Bell, Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Government Dashboard", subtitle: "Overview of 3D cadastral mapping progress" },
  "/map": { title: "3D GIS Map", subtitle: "Interactive 3D cadastral viewer — Patna, Bihar demo area" },
  "/parcels": { title: "Cadastral Parcels", subtitle: "ULPIN-indexed land parcel registry" },
  "/buildings": { title: "Buildings", subtitle: "3D building footprints and volumes" },
  "/properties": { title: "3D Properties", subtitle: "Vertical property units with 3DSPID identifiers" },
  "/surveys": { title: "Survey Management", subtitle: "Field surveys and GNSS observations" },
  "/datasets": { title: "Datasets", subtitle: "Imported geospatial datasets" },
  "/datasets/upload": { title: "Data Import Wizard", subtitle: "Upload and process geospatial data" },
  "/processing": { title: "Processing Queue", subtitle: "Background AI and data processing jobs" },
  "/validation": { title: "Topology Validation", subtitle: "Geometric and spatial validation results" },
  "/conflicts": { title: "Conflict Detection", subtitle: "3D spatial conflicts between objects" },
  "/approvals": { title: "Approval Workflow", subtitle: "Government authority review and approval" },
  "/reports": { title: "Reports", subtitle: "Generate cadastral reports and exports" },
  "/audit": { title: "Audit Log", subtitle: "Complete record of all system actions" },
  "/settings": { title: "Settings", subtitle: "System configuration and administration" },
};

export function AppTopbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const pageInfo =
    PAGE_TITLES[pathname ?? ""] ?? {
      title: "3D-BhuMap",
      subtitle: "3D Cadastral Mapping System",
    };

  return (
    <header
      style={{
        height: 48,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 16px",
        flexShrink: 0,
        background: "#ffffff",
        borderBottom: "1px solid #e2e6ef",
        fontFamily: "var(--font-family-sans)",
      }}
    >
      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "baseline", gap: 8 }}>
        <h1
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-0.01em",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {pageInfo.title}
        </h1>
        <span
          style={{
            fontSize: 11,
            color: "#9ca3af",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          • {pageInfo.subtitle}
        </span>
      </div>

      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (searchQuery.trim())
            router.push(`/map?search=${encodeURIComponent(searchQuery)}`);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "5px 12px",
          borderRadius: 6,
          background: "#f5f6fa",
          border: "1px solid #e2e6ef",
          width: 220,
          flexShrink: 0,
        }}
      >
        <Search size={13} style={{ color: "#9ca3af", flexShrink: 0 }} />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ULPIN, 3DSPID..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 12,
            color: "#374151",
            fontFamily: "var(--font-family-sans)",
          }}
        />
      </form>

      {/* Right actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* DB Live badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 8px",
            borderRadius: 4,
            background: "rgba(22,163,74,0.1)",
            border: "1px solid rgba(22,163,74,0.2)",
            fontSize: 11,
            fontWeight: 600,
            color: "#16a34a",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "#16a34a",
              animation: "pulse 2s infinite",
            }}
          />
          DB Live
        </div>

        {/* Bell */}
        <button
          style={{
            position: "relative",
            width: 30,
            height: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#9ca3af",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f6fa")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <Bell size={15} />
          <span
            style={{
              position: "absolute",
              top: 5,
              right: 5,
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#f59e0b",
            }}
          />
        </button>
      </div>
    </header>
  );
}
