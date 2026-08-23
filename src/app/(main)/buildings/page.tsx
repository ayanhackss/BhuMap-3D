"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Building2, Search } from "lucide-react";

export default function BuildingsPage() {
  const { data: buildings, isLoading } = useQuery({
    queryKey: ["buildings-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("buildings")
        .select("*, parcels(ulpin)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[var(--color-accent)]" />
            Buildings
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            {buildings?.length ?? 0} total buildings registered
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder="Search Building ID..."
            className="pl-9 pr-4 py-1.5 rounded-md text-sm outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)", color: "var(--color-ink)" }}
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Building Code</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Name</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Parcel ULPIN</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Height / Floors</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">Loading buildings...</td></tr>
            ) : buildings?.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--color-muted)]">No buildings found.</td></tr>
            ) : (
              buildings?.map(b => (
                <tr key={b.id} className="hover:bg-[var(--color-paper-2)] transition-colors cursor-pointer">
                  <td className="px-4 py-3 font-mono-id text-[var(--color-accent)]">{b.building_code}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{b.name || "Unnamed Building"}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{b.parcels?.ulpin || "N/A"}</td>
                  <td className="px-4 py-3 text-[var(--color-ink)]">{b.height_m}m / {b.num_floors} floors</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(b.status || 'VERIFIED')}`}>
                      {b.status || 'VERIFIED'}
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

