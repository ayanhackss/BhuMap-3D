"use client";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--color-muted)]" />
            System Settings
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Configure global parameters and integrations
          </p>
        </div>
      </div>
      <div className="p-8 rounded-xl max-w-2xl" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-medium text-[var(--color-ink)] mb-2">Default Coordinate Reference System (CRS)</h3>
                <select className="w-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded px-3 py-2 text-sm text-[var(--color-ink)]">
                    <option>EPSG:4326 (WGS 84)</option>
                    <option>EPSG:3857 (Web Mercator)</option>
                    <option>EPSG:32644 (UTM Zone 44N)</option>
                </select>
            </div>
            <div>
                <h3 className="text-sm font-medium text-[var(--color-ink)] mb-2">Cesium Ion Access Token</h3>
                <input type="password" value="************************" readOnly className="w-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded px-3 py-2 text-sm text-[var(--color-ink)] opacity-70" />
                <p className="text-xs text-[var(--color-muted)] mt-1">Configured via environment variables.</p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-[var(--color-ink)] mb-2">AI Processing Backend</h3>
                <select className="w-full bg-[var(--color-paper-2)] border border-[var(--color-rule)] rounded px-3 py-2 text-sm text-[var(--color-ink)]">
                    <option>Local Mock Engine (SIH Demo)</option>
                    <option disabled>FastAPI Remote (Unavailable)</option>
                </select>
            </div>
        </div>
      </div>
    </div>
  );
}

