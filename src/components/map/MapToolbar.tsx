"use client";

import { useMapStore } from "@/store/mapStore";
import {
  Ruler, Square, Mountain, ArrowDownFromLine, Layers,
  RotateCcw, Navigation, Brain, AlertTriangle
} from "lucide-react";

interface MapToolbarProps {
  viewerRef: React.MutableRefObject<unknown>;
}

export function MapToolbar({ viewerRef }: MapToolbarProps) {
  const { measureMode, setMeasureMode, isUndergroundMode, toggleUndergroundMode, isExplodedView, toggleExplodedView } = useMapStore();

  async function zoomToDemo() {
    if (!viewerRef.current) return;
    try {
      // @ts-expect-error - Cesium is loaded globally via CDN script
      const Cesium = window.Cesium;
      const v = viewerRef.current as Record<string, unknown>;
      (v.camera as { flyTo: (opts: unknown) => void }).flyTo({
        destination: Cesium.Cartesian3.fromDegrees(85.0960, 25.5902, 400),
        orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-40), roll: 0 },
        duration: 1.5,
      });
    } catch { /* ignore */ }
  }

  function handleMeasure(mode: "distance" | "area" | "height") {
    const next = measureMode === mode ? "none" : mode;
    setMeasureMode(next);
    if (next !== "none") {
      const labels: Record<string, string> = {
        distance: "Distance",
        area: "Area",
        height: "Height",
      };
      alert(
        `📐 MEASURE — ${labels[mode]}\n\nDEMO SIMULATION\n\nClick points on the 3D map to measure.\nIn this prototype, measurement is simulated:\n\n${
          mode === "distance"
            ? "• Urban Tower A → Commercial Plaza C\n• Distance: 218.4 metres"
            : mode === "area"
            ? "• Urban Tower A footprint\n• Area: 2,750 m²"
            : "• Urban Tower A\n• Min elevation: 53 m\n• Max elevation: 233 m\n• Height: 180 m"
        }\n\nFull interactive measurement requires a Cesium Ion token.`
      );
    }
  }

  return (
    <div className="flex items-center gap-1 px-3 flex-shrink-0"
      style={{ height: 40, background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
      {/* Zoom to demo */}
      <button onClick={zoomToDemo}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{ background: "var(--color-primary)", color: "white" }}
        title="Zoom to Patna demo area">
        <Navigation className="w-3.5 h-3.5" />
        Demo Area
      </button>

      <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

      {/* Measure tools */}
      <div className="flex items-center gap-0.5">
        {[
          { mode: "distance" as const, icon: Ruler, label: "Measure Distance" },
          { mode: "area" as const, icon: Square, label: "Measure Area" },
          { mode: "height" as const, icon: Mountain, label: "Measure Height" },
        ].map(({ mode, icon: Icon, label }) => (
          <button key={mode}
            onClick={() => handleMeasure(mode)}
            className="p-1.5 rounded text-xs transition-all"
            title={label}
            style={{
              background: measureMode === mode ? "rgba(59,130,246,0.12)" : "transparent",
              color: measureMode === mode ? "#2563eb" : "var(--color-muted)",
              border: measureMode === mode ? "1px solid rgba(59,130,246,0.3)" : "1px solid transparent",
            }}>
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
      </div>

      <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

      {/* Explode Building */}
      <button onClick={toggleExplodedView}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{
          background: isExplodedView ? "rgba(59,130,246,0.12)" : "var(--color-surface-3)",
          color: isExplodedView ? "#2563eb" : "var(--color-muted)",
          border: `1px solid ${isExplodedView ? "rgba(59,130,246,0.4)" : "var(--color-rule)"}`,
        }}
        title="Explode building floors">
        <Layers className="w-3.5 h-3.5" />
        Explode Building
      </button>

      {/* Underground Mode */}
      <button onClick={toggleUndergroundMode}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{
          background: isUndergroundMode ? "rgba(220,38,38,0.1)" : "var(--color-surface-3)",
          color: isUndergroundMode ? "#dc2626" : "var(--color-muted)",
          border: `1px solid ${isUndergroundMode ? "rgba(220,38,38,0.3)" : "var(--color-rule)"}`,
        }}
        title="Toggle underground mode">
        <ArrowDownFromLine className="w-3.5 h-3.5" />
        Underground Mode
      </button>

      <div className="w-px h-5 mx-1" style={{ background: "var(--color-border)" }} />

      {/* AI Extract */}
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed", border: "1px solid rgba(124,58,237,0.3)" }}
        title="AI building extraction (demo simulation)"
        onClick={() => alert("🤖 DEMO SIMULATION\n\nAI Building Extraction\n\nInput: Drone Orthophoto + DSM\nOutput: 6 buildings detected\n\n• Urban Tower A — 92.5% confidence\n• Residential Block B — 87.3% confidence\n• Commercial Plaza C — 78.9% confidence\n• Residential Villa D — 91.2% confidence\n• Industrial Unit E — 65.4% confidence\n• Government Office F — 95.1% confidence\n\nNote: This is a deterministic demo simulation, not a real ML model.")}>
        <Brain className="w-3.5 h-3.5" />
        AI Extract
      </button>

      {/* Conflict detect */}
      <button
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium transition-all"
        style={{ background: "rgba(220,38,38,0.08)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.25)" }}
        title="Run conflict detection"
        onClick={() => alert("⚠ CONFLICT DETECTION RESULTS\n\n1 spatial conflict detected:\n\n🔴 HIGH SEVERITY\nType: Utility/Property Intersection\nObject A: Main Sewer Line (elevation 47.5–50.5m)\nObject B: Urban Tower A — Basement 2 (47.5–50.5m)\nLocation: 25.5902°N, 85.0960°E\n\nDescription: 3D volume intersection detected. The sewer line passes through the registered property volume of Basement 2.\n\nAction Required: Surveyor review and resolution")}>
        <AlertTriangle className="w-3.5 h-3.5" />
        Detect Conflicts
      </button>

      <button onClick={zoomToDemo} className="ml-auto p-1.5 rounded transition-all" title="Reset view"
        style={{ color: "var(--color-muted)" }}>
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

