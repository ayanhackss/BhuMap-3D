"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { FileText, Search } from "lucide-react";

export default function ParcelsPage() {
  const { data: parcels, isLoading } = useQuery({
    queryKey: ["parcels-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("parcels")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        console.warn("Error fetching parcels:", error);
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
            <FileText className="w-5 h-5 text-[var(--color-accent)]" />
            Cadastral Parcels
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            {parcels?.length ?? 0} physical land parcels registered
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder="Search ULPIN..."
            className="pl-9 pr-4 py-1.5 rounded-md text-sm outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)", color: "white" }}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>ULPIN</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Village / Tehsil</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Area (mÂ²)</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Survey No.</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">Loading parcels...</td></tr>
            ) : parcels?.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">No parcels found.</td></tr>
            ) : (
              parcels?.map((p: Record<string, any>) => (
                <tr key={p.id} className="hover:bg-[var(--color-paper-2)] transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono-id text-[var(--color-accent)]">{p.ulpin}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{p.village || "Unknown"}, {p.tehsil || "Unknown"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{p.area_sqm}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{p.survey_number}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(p.status || 'VERIFIED')}`}>
                      {p.status || 'VERIFIED'}
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

