"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Home, Search } from "lucide-react";

export default function PropertiesPage() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, buildings(name), floors(floor_name)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Home className="w-5 h-5 text-teal-400" />
            3D Properties
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            {properties?.length ?? 0} vertical units registered
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder="Search 3DSPID..."
            className="pl-9 pr-4 py-1.5 rounded-md text-sm outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>3DSPID</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Building / Floor</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Unit</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Parent ULPIN</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">Loading properties...</td></tr>
            ) : properties?.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">No properties found.</td></tr>
            ) : (
              properties?.map((p: Record<string, any>) => (
                <tr key={p.id} className="hover:bg-[var(--color-paper-2)] transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono-id text-teal-400">{p.spid_3d}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">
                    {p.buildings?.name || "N/A"} - {p.floors?.floor_name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">Unit {p.unit_number}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{p.parent_ulpin}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(p.approval_status)}`}>
                      {p.approval_status?.replace(/_/g, " ")}
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

