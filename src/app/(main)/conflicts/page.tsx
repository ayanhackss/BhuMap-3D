"use client";
import { AlertTriangle, Map } from "lucide-react";
import Link from "next/link";

const MOCK_CONFLICTS = [
  { id: "CF-882", objA: "Underground Sewer Line S-90", objB: "Basement Parking B2", type: "Utility/Property Intersection", severity: "CRITICAL", status: "OPEN" },
  { id: "CF-881", objA: "Property 3DSPID-U402", objB: "Property 3DSPID-U403", type: "3D Volume Overlap", severity: "HIGH", status: "OPEN" },
  { id: "CF-880", objA: "Building BLDG-992", objB: "Parcel Boundary IN-BR-0012", type: "Geometry Gap", severity: "LOW", status: "RESOLVED" }
];

export default function ConflictsPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Conflict Detection Engine
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Review spatial and volumetric intersections
          </p>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Conflict ID</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Type</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Involved Objects</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Severity</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {MOCK_CONFLICTS.map((c) => (
              <tr key={c.id} className="hover:bg-[var(--color-paper-2)] transition-colors">
                <td className="px-4 py-3 font-mono-id text-red-400">{c.id}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">{c.type}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">
                    <div className="flex flex-col gap-1">
                        <span className="bg-[var(--color-paper)]/5 px-2 py-0.5 rounded text-xs">{c.objA}</span>
                        <span className="bg-[var(--color-paper)]/5 px-2 py-0.5 rounded text-xs">{c.objB}</span>
                    </div>
                </td>
                <td className="px-4 py-3">
                    {c.severity === 'CRITICAL' && <span className="text-xs font-bold text-red-500">CRITICAL</span>}
                    {c.severity === 'HIGH' && <span className="text-xs font-bold text-orange-400">HIGH</span>}
                    {c.severity === 'LOW' && <span className="text-xs font-bold text-yellow-500">LOW</span>}
                </td>
                <td className="px-4 py-3">
                    <Link href="/map" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-[var(--color-ink)] text-xs rounded transition-colors">
                        <Map className="w-3.5 h-3.5" /> View on Map
                    </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

