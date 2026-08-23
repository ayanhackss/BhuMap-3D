"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Database, Upload, Download, RefreshCw } from "lucide-react";

export default function DatasetsPage() {
  const { data: datasets, isLoading } = useQuery({
    queryKey: ["datasets"],
    queryFn: async () => {
      const { data } = await supabase.from("datasets").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  const FORMAT_COLORS: Record<string, string> = {
    geotiff: "#ff9800", las: "#4caf50", laz: "#4caf50",
    geojson: "#2196f3", shapefile: "#9c27b0", geopackage: "#607d8b",
    las_cloud: "#4caf50", csv: "#607d8b", citygml: "#e91e63",
    glb: "#ff5722", ifc: "#795548",
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)]">Datasets</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            {datasets?.length ?? 0} imported datasets · GeoTIFF, LAS, GeoJSON, Shapefile
          </p>
        </div>
        <button
          onClick={() => alert("DEMO: In production, this would open the data import wizard.\n\nSupported formats:\n• GeoTIFF (orthophoto, DEM, DSM)\n• LAZ/LAS (LiDAR point cloud)\n• GeoJSON / Shapefile / GeoPackage\n• IFC / CityGML (BIM data)\n• CSV (tabular with coordinates)\n• DXF (CAD drawings)")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-ink)]"
          style={{ background: "var(--color-primary)" }}>
          <Upload className="w-4 h-4" />
          Import Dataset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-xl" />
          ))
        ) : datasets?.map(dataset => (
          <div key={dataset.id} className="p-4 rounded-xl" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="text-xs px-2 py-0.5 rounded font-mono font-medium uppercase"
                  style={{ background: `${FORMAT_COLORS[dataset.format] ?? "#607d8b"}22`, color: FORMAT_COLORS[dataset.format] ?? "#607d8b", border: `1px solid ${FORMAT_COLORS[dataset.format] ?? "#607d8b"}44` }}>
                  {dataset.format}
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(dataset.status)}`}>
                {dataset.status}
              </span>
            </div>
            <div className="font-medium text-[var(--color-ink)] text-sm mb-1">{dataset.name}</div>
            <div className="space-y-1 text-xs" style={{ color: "var(--color-muted)" }}>
              <div>Size: {dataset.file_size_bytes ? formatFileSize(dataset.file_size_bytes) : "—"}</div>
              {dataset.crs && <div>CRS: {dataset.crs}</div>}
              {dataset.feature_count && <div>Features: {dataset.feature_count.toLocaleString()}</div>}
              {dataset.metadata?.resolution_cm && <div>Resolution: {dataset.metadata.resolution_cm}cm/px</div>}
              {dataset.metadata?.capture_date && <div>Captured: {dataset.metadata.capture_date}</div>}
              {dataset.metadata?.sensor && <div>Sensor: {dataset.metadata.sensor}</div>}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-all item-hover"
                style={{ background: "var(--color-paper-2)", color: "var(--color-muted)" }}>
                <Download className="w-3 h-3" /> Export
              </button>
              <button className="flex items-center gap-1 text-xs px-2 py-1 rounded transition-all item-hover"
                style={{ background: "var(--color-paper-2)", color: "var(--color-muted)" }}>
                <RefreshCw className="w-3 h-3" /> Reprocess
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


