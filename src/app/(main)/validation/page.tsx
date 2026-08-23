"use client";
import { CheckSquare, Play } from "lucide-react";

const MOCK_TASKS = [
  { id: "VAL-001", target: "Parcel IN-BR-0012", type: "Closed Polygon Check", result: "PASS", timestamp: "Just now" },
  { id: "VAL-002", target: "Building BLDG-992", type: "Footprint within Parcel", result: "PASS", timestamp: "5m ago" },
  { id: "VAL-003", target: "Floor 4 (Urban Tower)", type: "Vertical Bounds Overlap", result: "FAIL", timestamp: "12m ago" },
  { id: "VAL-004", target: "Property 3DSPID-U402", type: "Volume Intersection", result: "PENDING", timestamp: "-" }
];

export default function ValidationPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-pink-400" />
            Topology Validation
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Spatial integrity and geometry checks
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-[var(--color-ink)] text-sm font-medium rounded transition-colors">
            <Play className="w-4 h-4" /> Run Validation Suite
        </button>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Task ID</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Target Object</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Rule Executed</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Timestamp</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {MOCK_TASKS.map((t) => (
              <tr key={t.id} className="hover:bg-[var(--color-paper-2)] transition-colors">
                <td className="px-4 py-3 font-mono-id text-pink-400">{t.id}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">{t.target}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">{t.type}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{t.timestamp}</td>
                <td className="px-4 py-3">
                    {t.result === 'PASS' && <span className="text-xs px-2 py-0.5 rounded font-medium bg-green-900/40 text-green-400 border border-green-800/50">PASS</span>}
                    {t.result === 'FAIL' && <span className="text-xs px-2 py-0.5 rounded font-medium bg-red-900/40 text-red-400 border border-red-800/50">FAIL</span>}
                    {t.result === 'PENDING' && <span className="text-xs px-2 py-0.5 rounded font-medium bg-[var(--color-ink)] text-[var(--color-muted)] border border-[var(--color-rule)]">PENDING</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

