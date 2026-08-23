"use client";
import { Cpu } from "lucide-react";
import { getStatusBadgeClass } from "@/lib/utils";

const MOCK_JOBS = [
  { id: "JOB-9102", type: "AI Building Extraction", dataset: "Drone_Imagery_Zone4", status: "PROCESSING", progress: 68, time: "2m 14s" },
  { id: "JOB-9101", type: "Floor Segmentation", dataset: "Urban_Tower_A_LiDAR", status: "COMPLETED", progress: 100, time: "5m 22s" },
  { id: "JOB-9100", type: "Orthophoto Alignment", dataset: "Survey_Aug2026", status: "COMPLETED", progress: 100, time: "12m 05s" },
  { id: "JOB-9099", type: "3D Volumetric Mesh", dataset: "CityGML_BlockB", status: "FAILED", progress: 42, time: "1m 30s" }
];

export default function ProcessingPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--color-accent)]" />
            AI Processing Queue
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Monitor and manage background processing jobs
          </p>
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Job ID</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Task Type</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Target Dataset</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Progress</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {MOCK_JOBS.map((j) => (
              <tr key={j.id} className="hover:bg-[var(--color-paper-2)] transition-colors">
                <td className="px-4 py-3 font-mono-id text-[var(--color-accent)]">{j.id}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">{j.type}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">{j.dataset}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden w-24">
                      <div className="h-full bg-purple-500" style={{ width: `${j.progress}%` }} />
                    </div>
                    <span className="text-xs text-[var(--color-muted)]">{j.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(j.status)}`}>{j.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

