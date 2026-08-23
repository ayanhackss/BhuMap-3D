"use client";

import { useMapStore } from "@/store/mapStore";
import Link from "next/link";
import {
  Layers, Home,
  AlertTriangle, CheckCircle, ZoomIn,
  ArrowDownFromLine, Ruler, FileDown, ScrollText, Edit
} from "lucide-react";
import { getStatusBadgeClass, getConfidenceClass, getConfidenceLabel, formatArea, formatVolume } from "@/lib/utils";

// Mock detailed data for Urban Tower A demo
const DEMO_PROPERTY = {
  spid_3d: "3DSPID-IN-BR-0001-000001-F02-U001",
  parent_ulpin: "BR-01-001-0001",
  building_name: "Urban Tower A",
  floor_name: "Second Floor",
  unit_number: "F2-A01",
  property_type: "residential",
  usage: "apartment",
  min_elevation_m: 60.5,
  max_elevation_m: 64.0,
  area_sqm: 95.0,
  volume_cbm: 332.5,
  survey_source: "AI + Survey",
  ai_confidence: 90.4,
  quality_score: 87.0,
  topology_valid: true,
  validation_status: "validated",
  approval_status: "verified",
  ownership_reference: "REG-REF-2024-F2-1",
  created_at: "2024-03-20T10:30:00Z",
};

export function RightPanel() {
  const { selectedObject, selectObject, isUndergroundMode, toggleUndergroundMode, isExplodedView, toggleExplodedView } = useMapStore();

  const property = DEMO_PROPERTY; // In production, fetch based on selectedObject

  return (
    <div className="h-full flex flex-col overflow-hidden"
      style={{ background: "var(--color-paper)", borderLeft: "1px solid var(--color-border)", width: 308 }}>
      {/* Quick Actions Bar */}
      <div className="px-3 py-2 flex-shrink-0 flex items-center gap-1.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <button onClick={toggleExplodedView}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all"
          style={{ background: isExplodedView ? "rgba(59,130,246,0.12)" : "var(--color-paper-2)", color: isExplodedView ? "#2563eb" : "var(--color-muted)", border: `1px solid ${isExplodedView ? "rgba(59,130,246,0.4)" : "var(--color-rule)"}` }}>
          <Layers className="w-3 h-3" />
          Explode
        </button>
        <button onClick={toggleUndergroundMode}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-medium transition-all"
          style={{ background: isUndergroundMode ? "rgba(220,38,38,0.1)" : "var(--color-paper-2)", color: isUndergroundMode ? "#dc2626" : "var(--color-muted)", border: `1px solid ${isUndergroundMode ? "rgba(220,38,38,0.3)" : "var(--color-rule)"}` }}>
          <ArrowDownFromLine className="w-3 h-3" />
          Underground
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Demo property detail */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-muted)" }}>
              Selected Property
            </div>
            <span className="text-xs px-2 py-0.5 rounded font-medium badge-verified">
              VERIFIED
            </span>
          </div>

          {/* 3DSPID */}
          <div className="mb-3 p-2.5 rounded-lg" style={{ background: "var(--color-paper-2)" }}>
            <div className="text-xs mb-1" style={{ color: "var(--color-muted)" }}>3D Spatial Property ID</div>
            <div className="font-mono-id break-all" style={{ color: "var(--color-accent)" }}>{property.spid_3d}</div>
          </div>

          {/* Key fields */}
          <div className="space-y-2">
            {[
              { label: "Parent ULPIN", value: property.parent_ulpin, mono: true },
              { label: "Building", value: property.building_name },
              { label: "Floor", value: property.floor_name },
              { label: "Unit Number", value: property.unit_number },
              { label: "Property Type", value: property.property_type },
              { label: "Usage", value: property.usage },
            ].map((field) => (
              <div key={field.label} className="flex items-center justify-between text-xs">
                <span style={{ color: "var(--color-muted)" }}>{field.label}</span>
                <span className={field.mono ? "font-mono-id" : "font-medium"} style={{ color: "var(--color-ink)" }}>
                  {field.value}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="my-3" style={{ borderTop: "1px solid var(--color-rule)" }} />

          {/* Dimensions */}
          <div className="text-xs font-medium mb-2" style={{ color: "var(--color-muted)" }}>DIMENSIONS</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: "Min Elevation", value: `${property.min_elevation_m}m` },
              { label: "Max Elevation", value: `${property.max_elevation_m}m` },
              { label: "Area", value: `${property.area_sqm} m²` },
              { label: "Volume", value: `${property.volume_cbm} m³` },
            ].map((d) => (
              <div key={d.label} className="p-2 rounded-lg text-xs" style={{ background: "var(--color-paper-2)" }}>
                <div style={{ color: "var(--color-muted)" }}>{d.label}</div>
                <div className="font-medium mt-0.5" style={{ color: "var(--color-ink)" }}>{d.value}</div>
              </div>
            ))}
          </div>

          {/* Quality metrics */}
          <div className="text-xs font-medium mb-2" style={{ color: "var(--color-muted)" }}>QUALITY METRICS</div>
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--color-muted)" }}>AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
                  <div className="h-full rounded-full" style={{ width: `${property.ai_confidence}%`, background: "#66bb6a" }} />
                </div>
                <span className={`font-medium ${getConfidenceClass(property.ai_confidence)}`}>
                  {property.ai_confidence}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--color-muted)" }}>Data Quality</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--color-surface-3)" }}>
                  <div className="h-full rounded-full" style={{ width: `${property.quality_score}%`, background: "#42a5f5" }} />
                </div>
                <span className="font-medium" style={{ color: "#2563eb" }}>{property.quality_score}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "var(--color-muted)" }}>Topology</span>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-green-600 font-medium">Valid</span>
              </div>
            </div>
          </div>

          {/* Conflict alert */}
          <div className="p-3 rounded-lg mb-3 flex items-start gap-2"
            style={{ background: "rgba(183,28,28,0.15)", border: "1px solid rgba(183,28,28,0.3)" }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ef5350" }} />
            <div>
              <div className="text-xs font-medium" style={{ color: "#ef5350" }}>Conflict Detected</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(239,83,80,0.8)" }}>
                Basement 2 intersects with Main Sewer Line at elevation 47.5–50.5m
              </div>
              <Link href="/conflicts" className="text-xs underline mt-1 inline-block" style={{ color: "#ef5350" }}>
                View conflict →
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="text-xs font-medium mb-2" style={{ color: "var(--color-muted)" }}>ACTIONS</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: "View in 3D", icon: ZoomIn, href: "/map" },
              { label: "Measure", icon: Ruler, href: "/map" },
              { label: "Generate Report", icon: FileDown, href: "/reports" },
              { label: "View Audit", icon: ScrollText, href: "/audit" },
              { label: "Approvals", icon: CheckCircle, href: "/approvals" },
              { label: "Edit", icon: Edit, href: "/properties" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-all item-hover"
                  style={{ background: "var(--color-paper-2)", color: "var(--color-muted)", border: "1px solid var(--color-rule)" }}>
                  <Icon className="w-3 h-3 flex-shrink-0" />
                  {action.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Survey source */}
      <div className="flex-shrink-0 px-4 py-2 text-xs flex items-center gap-1.5"
        style={{ borderTop: "1px solid var(--color-border)", color: "var(--color-muted)" }}>
        <span>Source:</span>
        <span style={{ color: "var(--color-muted)" }}>{property.survey_source}</span>
        <span className="mx-1">·</span>
        <span>DEMO MODE</span>
      </div>
    </div>
  );
}

