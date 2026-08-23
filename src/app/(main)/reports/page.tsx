"use client";
import { BarChart2, Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[var(--color-accent)]" />
            Cadastral Reports
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Generate and download official PDF reports
          </p>
        </div>
      </div>
      <div className="p-16 text-center rounded-xl" style={{ border: "1px dashed var(--color-border)", background: "var(--color-paper)" }}>
        <Download className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-medium text-[var(--color-ink)] mb-2">Report Generation Module</h3>
        <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto mb-6">
          The PDF generation engine is currently running in simulated mode. Select a property from the 3D Map or Properties list to generate a localized cadastral report.
        </p>
      </div>
    </div>
  );
}

