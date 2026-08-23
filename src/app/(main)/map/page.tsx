"use client";

import { useEffect, useRef, useState } from "react";
import { useMapStore } from "@/store/mapStore";
import { supabase } from "@/lib/supabase";
import {
  Layers, ChevronLeft, ChevronRight, ArrowDownFromLine, AlertTriangle
} from "lucide-react";
import { LayerPanel } from "@/components/map/LayerPanel";
import { RightPanel } from "@/components/map/RightPanel";
import { MapStatusBar } from "@/components/map/MapStatusBar";
import { MapToolbar } from "@/components/map/MapToolbar";

// ---------------------------------------------------------------------------
// Demo property pins — these are overlaid on real buildings regardless of
// which rendering path (OSM tileset vs polygon fallback) is active.
// Coordinates correspond to actual structures visible in Patna satellite imagery.
// ---------------------------------------------------------------------------
const PROPERTY_PINS = [
  {
    name: "Urban Tower A",
    spid: "3DSPID-IN-BR-0001-F02-U001",
    lon: 85.0960, lat: 25.5912,
    type: "residential", status: "verified",
    color: "#0288d1", pinColor: "#4fc3f7",
  },
  {
    name: "Residential Block B",
    spid: "3DSPID-IN-BR-0001-F01-U002",
    lon: 85.0935, lat: 25.5902,
    type: "residential", status: "provisional",
    color: "#0097a7", pinColor: "#26c6da",
  },
  {
    name: "Commercial Plaza C",
    spid: "3DSPID-IN-BR-0001-F00-U003",
    lon: 85.0980, lat: 25.5898,
    type: "commercial", status: "verified",
    color: "#7c4dff", pinColor: "#b39ddb",
  },
  {
    name: "Industrial Unit E",
    spid: "3DSPID-IN-BR-0001-F00-U005",
    lon: 85.0950, lat: 25.5885,
    type: "industrial", status: "requires_review",
    color: "#f57c00", pinColor: "#ffb74d",
  },
  {
    name: "Government Office F",
    spid: "3DSPID-IN-BR-0001-F02-U006",
    lon: 85.0972, lat: 25.5920,
    type: "government", status: "verified",
    color: "#388e3c", pinColor: "#66bb6a",
  },
];

// ---------------------------------------------------------------------------
// Polygon footprints for the fallback (no Cesium ion token) path.
// These are approximate building outlines digitised from OpenStreetMap for
// the Patna area. Heights are in metres above WGS84 ellipsoid.
// TERRAIN_BASE ≈ 60m accounts for Patna ground elevation (~53m) + buffer.
// ---------------------------------------------------------------------------
const TERRAIN_BASE = 60;

const BUILDING_FOOTPRINTS = [
  {
    name: "Urban Tower A",
    color: "#0288d1", outline: "#4fc3f7",
    height: 180,
    // Approximate polygon for a tall residential tower
    coords: [
      [85.09575, 25.59095], [85.09625, 25.59095],
      [85.09625, 25.59145], [85.09575, 25.59145],
    ],
  },
  {
    name: "Residential Block B",
    color: "#0097a7", outline: "#26c6da",
    height: 90,
    coords: [
      [85.09320, 25.58995], [85.09380, 25.58995],
      [85.09380, 25.59045], [85.09320, 25.59045],
    ],
  },
  {
    name: "Commercial Plaza C",
    color: "#7c4dff", outline: "#b39ddb",
    height: 60,
    coords: [
      [85.09765, 25.58950], [85.09835, 25.58950],
      [85.09835, 25.58985], [85.09765, 25.58985],
    ],
  },
  {
    name: "Industrial Unit E",
    color: "#f57c00", outline: "#ffb74d",
    height: 45,
    coords: [
      [85.09460, 25.58820], [85.09540, 25.58820],
      [85.09540, 25.58880], [85.09460, 25.58880],
    ],
  },
  {
    name: "Government Office F",
    color: "#388e3c", outline: "#66bb6a",
    height: 55,
    coords: [
      [85.09690, 25.59175], [85.09750, 25.59175],
      [85.09750, 25.59225], [85.09690, 25.59225],
    ],
  },
];

// ---------------------------------------------------------------------------
  // renderEntities
  // When OSM Buildings are active (real tileset loaded):
  //   → Add cadastral property PIN markers on top of real building footprints
  // When OSM Buildings are NOT active (no token / fallback):
  //   → Extrude building footprint polygons + add pin markers
  // ---------------------------------------------------------------------------
  function renderEntities(
    Cesium: Record<string, any>,
    viewer: unknown,
    exploded: boolean,
    hasOSM: boolean,
  ) {
    const v = viewer as Record<string, unknown>;
    const entities = v.entities as { removeAll: () => void; add: (e: unknown) => void };
    entities.removeAll();

    if (!hasOSM) {
      // ── Fallback: polygon extrusion ─────────────────────────────────────
      // Uses manually-digitised footprints that closely match real building
      // outlines. extrudedHeight positions the top of the polygon above terrain.
      for (const b of BUILDING_FOOTPRINTS) {
        const bottom = TERRAIN_BASE;
        const top = TERRAIN_BASE + b.height;

        entities.add({
          name: b.name,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(
              Cesium.Cartesian3.fromDegreesArray(b.coords.flat())
            ),
            height: bottom,
            extrudedHeight: top,
            material: Cesium.Color.fromCssColorString(b.color).withAlpha(0.85),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString(b.outline),
            outlineWidth: 2,
            closeTop: true,
            closeBottom: true,
          },
        });
      }
    }

    // ── Property pin markers (always shown, on both paths) ──────────────────
    // Each pin sits at the top of its building with an informative label.
    for (const pin of PROPERTY_PINS) {
      // For OSM path: pin floats above buildings at a fixed altitude.
      // For polygon path: pin sits at building top.
      const match = BUILDING_FOOTPRINTS.find((b) => b.name === pin.name);
      const pinHeight = TERRAIN_BASE + (match ? match.height + 5 : 50);

      entities.add({
        name: pin.name,
        position: Cesium.Cartesian3.fromDegrees(pin.lon, pin.lat, pinHeight),
        point: {
          pixelSize: 10,
          color: Cesium.Color.fromCssColorString(pin.pinColor),
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(200, 1.5, 5000, 0.5),
        },
        label: {
          text: `${pin.name}\n${pin.spid}`,
          font: "bold 12px sans-serif",
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -14),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          scaleByDistance: new Cesium.NearFarScalar(200, 1.1, 3000, 0.55),
          translucencyByDistance: new Cesium.NearFarScalar(1500, 1.0, 5000, 0.0),
          backgroundColor: Cesium.Color.fromCssColorString(pin.color).withAlpha(0.75),
          showBackground: true,
          backgroundPadding: new Cesium.Cartesian2(6, 4),
        },
      });
    }

    // ── Exploded view: float a detached floor above Urban Tower A ───────────
    if (exploded) {
      const towerEntry = BUILDING_FOOTPRINTS.find((b) => b.name === "Urban Tower A");
      const towerTop = TERRAIN_BASE + (towerEntry?.height ?? 180);
      const floatOffset = 60;
      const floorH = 38;
      const floorCenter = towerTop + floatOffset + floorH / 2;

      entities.add({
        name: "Urban Tower A — Floor 10 (Exploded)",
        position: Cesium.Cartesian3.fromDegrees(85.0960, 25.5912, floorCenter),
        box: {
          dimensions: new Cesium.Cartesian3(55, 55, floorH),
          material: Cesium.Color.fromCssColorString("#7c4dff").withAlpha(0.92),
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString("#b39ddb"),
          outlineWidth: 2,
        },
        label: {
          text: "Floor 10 — Exploded",
          font: "bold 12px sans-serif",
          fillColor: Cesium.Color.fromCssColorString("#e0d7ff"),
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          showBackground: true,
          backgroundColor: Cesium.Color.fromCssColorString("#7c4dff").withAlpha(0.7),
          backgroundPadding: new Cesium.Cartesian2(6, 4),
        },
      });
    }
  }

async function loadDemoData() {
    try {
      await supabase.from("parcels").select("ulpin");
    } catch (err) {
      console.warn("[BhuMap] Demo data fetch skipped (Supabase not configured):", err);
    }
  }

export default function MapPage() {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<unknown>(null);
  const cesiumRef = useRef<unknown>(null);
  const osmBuildingsRef = useRef<unknown>(null); // tracks loaded OSM tileset
  const [cesiumLoaded, setCesiumLoaded] = useState<number>(0);
  const [cesiumError, setCesiumError] = useState<string | null>(null);
  const [osmActive, setOsmActive] = useState(false); // true once OSM buildings loaded
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const { isUndergroundMode, isExplodedView } = useMapStore();

  // ─── Main Cesium initialisation ────────────────────────────────────────────
  useEffect(() => {
    let viewer: unknown = null;
    let isMounted = true;

    async function initCesium() {
      try {
        const CDN = "https://unpkg.com/cesium@1.122.0/Build/Cesium";
        (window as Record<string, any>).CESIUM_BASE_URL = CDN;

        // Inject Cesium CSS from CDN (once)
        if (!document.querySelector("link[data-cesium-css]")) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `${CDN}/Widgets/widgets.css`;
          link.dataset.cesiumCss = "1";
          document.head.appendChild(link);
        }

        // Load Cesium via script tag from CDN
        const Cesium = await new Promise<Record<string, any>>((resolve, reject) => {
          if ((window as Record<string, any>).Cesium) return resolve((window as Record<string, any>).Cesium);
          const script = document.createElement("script");
          script.src = `${CDN}/Cesium.js`;
          script.onload = () => resolve((window as Record<string, any>).Cesium);
          script.onerror = () => reject(new Error("Failed to load Cesium from CDN"));
          document.head.appendChild(script);
        });

        const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN;
        const hasToken = !!(token && token !== "your-cesium-ion-token-from-cesium.com");
        if (hasToken) Cesium.Ion.defaultAccessToken = token;

        if (!isMounted || !cesiumContainer.current) return;
        cesiumContainer.current.innerHTML = "";

        viewer = new Cesium.Viewer(cesiumContainer.current, {
          terrainProvider: hasToken
            ? await Cesium.createWorldTerrainAsync()
            : new Cesium.EllipsoidTerrainProvider(),
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          infoBox: false,
          selectionIndicator: false,
          shadows: true,         // shadows make 3D depth obvious
          msaaSamples: 4,
        });

        if (!isMounted) {
          try { (viewer as Record<string, any>).destroy(); } catch (e) {}
          return;
        }

        const v = viewer as Record<string, unknown>;
        const scene = v.scene as Record<string, any>;

        // Visual tweaks
        scene.skyBox.show = false;
        scene.backgroundColor = { red: 0.043, green: 0.086, blue: 0.157, alpha: 1 };

        // Depth-test entities against terrain so they don't poke through ground
        scene.globe.depthTestAgainstTerrain = true;

        viewerRef.current = viewer;
        cesiumRef.current = Cesium;

        // ── Load Cesium OSM Buildings (real building footprints) ────────────
        // This is a global 3D tileset built from OpenStreetMap data.
        // It extrudes every building polygon to its real-world height,
        // giving accurate footprint alignment with satellite imagery.
        let osmLoaded = false;
        if (hasToken) {
          try {
            const osmTileset = await Cesium.createOsmBuildingsAsync({
              style: new Cesium.Cesium3DTileStyle({
                // Colour buildings by their OSM usage tag
                color: {
                  conditions: [
                    [
                      "${feature['building']} === 'apartments' || ${feature['building']} === 'residential' || ${feature['building']} === 'house'",
                      "color('#0288d1', 0.82)"
                    ],
                    [
                      "${feature['building']} === 'commercial' || ${feature['building']} === 'retail' || ${feature['building']} === 'shop' || ${feature['building']} === 'supermarket'",
                      "color('#7c4dff', 0.82)"
                    ],
                    [
                      "${feature['building']} === 'office' || ${feature['building']} === 'government' || ${feature['building']} === 'public'",
                      "color('#388e3c', 0.82)"
                    ],
                    [
                      "${feature['building']} === 'industrial' || ${feature['building']} === 'warehouse' || ${feature['building']} === 'factory'",
                      "color('#f57c00', 0.82)"
                    ],
                    [
                      "${feature['building']} === 'hospital' || ${feature['building']} === 'school' || ${feature['building']} === 'university'",
                      "color('#e91e63', 0.82)"
                    ],
                    ["true", "color('#0097a7', 0.75)"],
                  ],
                },
              }),
            });

            if (isMounted) {
              scene.primitives.add(osmTileset);
              osmBuildingsRef.current = osmTileset;
              osmLoaded = true;
            } else {
              try { osmTileset.destroy(); } catch (e) {}
            }
          } catch (e) {
            console.warn("[BhuMap] OSM Buildings tileset failed to load:", e);
          }
        }

        if (isMounted) setOsmActive(osmLoaded);

        // ── Camera: fly to Patna demo site ──────────────────────────────────
        (v.camera as { flyTo: (opts: unknown) => void }).flyTo({
          destination: Cesium.Cartesian3.fromDegrees(85.0940, 25.5870, 500),
          orientation: {
            heading: Cesium.Math.toRadians(30),
            pitch: Cesium.Math.toRadians(-25),
            roll: 0,
          },
          duration: 2,
        });

        await loadDemoData();

        if (isMounted) setCesiumLoaded(Date.now());
      } catch (err) {
        console.error("Cesium init error:", err);
        if (isMounted) {
          setCesiumError("3D viewer failed to initialise. Check your Cesium Ion token.");
          setCesiumLoaded(Date.now());
        }
      }
    }

    initCesium();

    return () => {
      isMounted = false;
      if (viewer && (viewer as Record<string, unknown>).destroy) {
        try { ((viewer as Record<string, unknown>).destroy as () => void)(); } catch (e) {}
      }
      viewerRef.current = null;
      cesiumRef.current = null;
      osmBuildingsRef.current = null;
    };
  }, []);

  // ─── Re-render entities when exploded view changes ─────────────────────────
  useEffect(() => {
    if (!cesiumLoaded || !viewerRef.current || !cesiumRef.current) return;
    renderEntities(cesiumRef.current, viewerRef.current, isExplodedView, osmActive);
  }, [isExplodedView, cesiumLoaded, osmActive]);

  // ─── Underground mode: toggle globe transparency ────────────────────────────
  useEffect(() => {
    if (!viewerRef.current) return;
    const scene = (viewerRef.current as any).scene;
    if (!scene) return;
    scene.globe.translucency.enabled = isUndergroundMode;
    scene.globe.translucency.frontFaceAlpha = isUndergroundMode ? 0.3 : 1.0;
  }, [isUndergroundMode]);

  return (
    <div className="flex h-full overflow-hidden relative bg-[var(--color-paper)]">
      {/* Left sidebar */}
      <div className="flex-shrink-0 flex transition-all duration-200"
        style={{ width: leftOpen ? 268 : 0, overflow: "hidden" }}>
        <LayerPanel />
      </div>
      <button onClick={() => setLeftOpen(!leftOpen)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-r-md bg-[var(--color-paper-2)] border border-l-0 border-[var(--color-rule)]"
        style={{ left: leftOpen ? 268 : 0 }}>
        {leftOpen
          ? <ChevronLeft className="w-3 h-3" style={{ color: "var(--color-muted)" }} />
          : <ChevronRight className="w-3 h-3" style={{ color: "var(--color-muted)" }} />}
      </button>

      {/* Main map area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <MapToolbar viewerRef={viewerRef} />

        <div className="flex-1 relative overflow-hidden">
          <div ref={cesiumContainer} id="cesium-container" className="w-full h-full" />

          {/* Loading overlay */}
          {!cesiumLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-paper)]">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
              <div className="text-[var(--color-ink)] font-medium">Loading 3D Buildings...</div>
              <div className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
                {osmActive ? "OSM Buildings loaded ✓" : "Initialising Cesium viewer"}
              </div>
            </div>
          )}

          {/* OSM buildings status badge */}
          {cesiumLoaded > 0 && (
            <div className="absolute top-3 right-3 z-20">
              <div className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
                style={{
                  background: osmActive ? "rgba(56,142,60,0.2)" : "rgba(245,127,23,0.15)",
                  border: `1px solid ${osmActive ? "rgba(102,187,106,0.4)" : "rgba(245,127,23,0.3)"}`,
                  color: osmActive ? "#66bb6a" : "#ffa726",
                }}>
                <div className={`w-1.5 h-1.5 rounded-full ${osmActive ? "bg-green-400" : "bg-orange-400"}`} />
                {osmActive ? "OSM 3D Buildings Active" : "Polygon Fallback Mode — Add Ion token for real buildings"}
              </div>
            </div>
          )}

          {/* Cesium error fallback */}
          {cesiumError && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-md">
              <div className="px-4 py-3 rounded-lg text-sm flex items-start gap-2"
                style={{ background: "rgba(245,127,23,0.15)", border: "1px solid rgba(245,127,23,0.3)", color: "#ffa726" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">Cesium Error</div>
                  <div className="text-xs mt-0.5 opacity-80">{cesiumError}</div>
                </div>
              </div>
            </div>
          )}

          {/* Mode indicators — stacked so they never overlap */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
            {isUndergroundMode && (
              <div className="px-4 py-2 rounded-full text-sm flex items-center gap-2 whitespace-nowrap"
                style={{ background: "rgba(183,28,28,0.8)", color: "#ffcdd2", border: "1px solid rgba(239,83,80,0.5)" }}>
                <ArrowDownFromLine className="w-4 h-4" />
                Underground Mode — Globe is transparent
              </div>
            )}
            {isExplodedView && (
              <div className="px-4 py-2 rounded-full text-sm flex items-center gap-2 whitespace-nowrap"
                style={{ background: "rgba(21,101,192,0.8)", color: "#bbdefb", border: "1px solid rgba(33,150,243,0.5)" }}>
                <Layers className="w-4 h-4" />
                Exploded View — Floor 10 separated
              </div>
            )}
          </div>
        </div>

        <MapStatusBar />
      </div>

      {/* Right sidebar */}
      <button onClick={() => setRightOpen(!rightOpen)}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 rounded-l-md bg-[var(--color-paper-2)] border border-r-0 border-[var(--color-rule)]"
        style={{ right: rightOpen ? 308 : 0 }}>
        {rightOpen
          ? <ChevronRight className="w-3 h-3" style={{ color: "var(--color-muted)" }} />
          : <ChevronLeft className="w-3 h-3" style={{ color: "var(--color-muted)" }} />}
      </button>
      <div className="flex-shrink-0 transition-all duration-200"
        style={{ width: rightOpen ? 308 : 0, overflow: "hidden" }}>
        <RightPanel />
      </div>
    </div>
  );
}


