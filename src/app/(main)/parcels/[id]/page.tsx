"use client";

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { FileText, Map as MapIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ParcelDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: parcel, isLoading } = useQuery({
    queryKey: ["parcel-detail", id],
    queryFn: async () => {
      const { data } = await supabase.from("parcels").select("*").eq("id", id).single();
      return data;
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <Link href="/parcels" className="inline-flex items-center gap-1 text-sm text-[var(--color-accent)] hover:text-blue-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Parcels
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[var(--color-accent)]" />
              Parcel Details
            </h2>
            {isLoading ? (
              <div className="h-5 w-48 bg-[var(--color-paper)]/10 rounded mt-2 animate-pulse" />
            ) : (
              <p className="text-sm mt-1 font-mono-id" style={{ color: "var(--color-muted)" }}>
                ULPIN: {parcel?.ulpin || id}
              </p>
            )}
          </div>
          {!isLoading && parcel && (
            <span className={`text-sm px-3 py-1 rounded-md font-medium ${getStatusBadgeClass(parcel.status || 'VERIFIED')}`}>
              {parcel.status || 'VERIFIED'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Main Info */}
          <div className="p-5 rounded-xl" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-base font-semibold text-[var(--color-ink)] mb-4">Spatial Metadata</h3>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-[var(--color-paper)]/10 rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-[var(--color-paper)]/10 rounded w-1/2 animate-pulse" />
              </div>
            ) : (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div>
                  <dt className="text-[var(--color-muted)] mb-1">Survey Number</dt>
                  <dd className="text-[var(--color-ink)] font-medium">{parcel?.survey_number || "N/A"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted)] mb-1">Area (sqm)</dt>
                  <dd className="text-[var(--color-ink)] font-medium">{parcel?.area_sqm || "0"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted)] mb-1">Village</dt>
                  <dd className="text-[var(--color-ink)] font-medium">{parcel?.village || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted)] mb-1">Tehsil</dt>
                  <dd className="text-[var(--color-ink)] font-medium">{parcel?.tehsil || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-[var(--color-muted)] mb-1">District</dt>
                  <dd className="text-[var(--color-ink)] font-medium">{parcel?.district || "Unknown"}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Actions */}
          <div className="p-5 rounded-xl" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-base font-semibold text-[var(--color-ink)] mb-4">Actions</h3>
            <div className="space-y-3">
              <Link href={`/map?ulpin=${parcel?.ulpin || id}`} className="w-full flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors"
                style={{ background: "var(--color-primary)", color: "white" }}>
                <MapIcon className="w-4 h-4" />
                View on 3D Map
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
