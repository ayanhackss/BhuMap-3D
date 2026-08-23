"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: prop, isLoading } = useQuery({
    queryKey: ["property-detail", id],
    queryFn: async () => {
      const { data } = await supabase.from("properties").select("*, buildings(name), floors(floor_name)").eq("id", id).single();
      return data;
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <Link href="/properties" className="inline-flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Home className="w-6 h-6 text-teal-400" />
              Property Details
            </h2>
            {isLoading ? (
              <div className="h-5 w-48 bg-[var(--color-paper)]/10 rounded mt-2 animate-pulse" />
            ) : (
              <p className="text-sm mt-1 font-mono-id" style={{ color: "var(--color-muted)" }}>
                3DSPID: {prop?.spid_3d || id}
              </p>
            )}
          </div>
          {!isLoading && prop && (
            <span className={`text-sm px-3 py-1 rounded-md font-medium ${getStatusBadgeClass(prop.approval_status || 'VERIFIED')}`}>
              {prop.approval_status?.replace(/_/g, " ") || 'VERIFIED'}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 rounded-xl mt-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
        {isLoading ? <p className="text-[var(--color-muted)] text-sm">Loading...</p> : (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div><dt className="text-[var(--color-muted)] mb-1">Building</dt><dd className="text-[var(--color-ink)] font-medium">{prop?.buildings?.name || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Floor</dt><dd className="text-[var(--color-ink)] font-medium">{prop?.floors?.floor_name || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Unit Number</dt><dd className="text-[var(--color-ink)] font-medium">{prop?.unit_number || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Parent ULPIN</dt><dd className="text-[var(--color-ink)] font-medium">{prop?.parent_ulpin || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Area (sqm)</dt><dd className="text-[var(--color-ink)] font-medium">{prop?.area_sqm || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Volume (m³)</dt><dd className="text-[var(--color-ink)] font-medium">{prop?.volume_m3 || "N/A"}</dd></div>
            </dl>
        )}
      </div>
    </div>
  );
}
