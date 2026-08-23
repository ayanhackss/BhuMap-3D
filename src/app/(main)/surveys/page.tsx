"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Compass, Search } from "lucide-react";

export default function SurveysPage() {
  const { data: surveys, isLoading } = useQuery({
    queryKey: ["surveys-list"],
    queryFn: async () => {
      // Assuming a surveys table exists in the database.
      // If it fails, return empty array for the prototype demo.
      const { data, error } = await supabase
        .from("surveys")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.warn("Surveys table might not exist yet:", error);
        return [];
      }
      return data ?? [];
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Compass className="w-5 h-5 text-green-400" />
            Field Surveys
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            {surveys?.length ?? 0} active or completed field surveys
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder="Search Survey ID..."
            className="pl-9 pr-4 py-1.5 rounded-md text-sm outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Survey ID</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Type</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Surveyor</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Date</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">Loading surveys...</td></tr>
            ) : surveys?.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">No field surveys found in the database.</td></tr>
            ) : (
              surveys?.map((s: Record<string, any>) => (
                <tr key={s.id} className="hover:bg-[var(--color-paper-2)] transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono-id text-green-400">{s.survey_id || s.id}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{s.type || "GNSS / Drone"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{s.surveyor_name || "Unknown"}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{new Date(s.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(s.status || 'COMPLETED')}`}>
                      {s.status || 'COMPLETED'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

