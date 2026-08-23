"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Building2, Map as MapIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BuildingDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: building, isLoading } = useQuery({
    queryKey: ["building-detail", id],
    queryFn: async () => {
      const { data } = await supabase.from("buildings").select("*, parcels(ulpin)").eq("id", id).single();
      return data;
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <Link href="/buildings" className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Buildings
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Building2 className="w-6 h-6 text-[var(--color-accent)]" />
              Building Details
            </h2>
            {isLoading ? (
              <div className="h-5 w-48 bg-[var(--color-paper)]/10 rounded mt-2 animate-pulse" />
            ) : (
              <p className="text-sm mt-1 font-mono-id" style={{ color: "var(--color-muted)" }}>
                ID: {building?.building_code || id}
              </p>
            )}
          </div>
          {!isLoading && building && (
            <span className={`text-sm px-3 py-1 rounded-md font-medium ${getStatusBadgeClass(building.status || 'VERIFIED')}`}>
              {building.status || 'VERIFIED'}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 rounded-xl mt-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-base font-semibold text-[var(--color-ink)] mb-4">Properties</h3>
        {isLoading ? <p className="text-[var(--color-muted)] text-sm">Loading...</p> : (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div><dt className="text-[var(--color-muted)] mb-1">Name</dt><dd className="text-[var(--color-ink)] font-medium">{building?.name || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Height (m)</dt><dd className="text-[var(--color-ink)] font-medium">{building?.height_m || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Floors</dt><dd className="text-[var(--color-ink)] font-medium">{building?.num_floors || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Parcel ULPIN</dt><dd className="text-[var(--color-ink)] font-medium">{building?.parcels?.ulpin || "N/A"}</dd></div>
            </dl>
        )}
      </div>
    </div>
  );
}
