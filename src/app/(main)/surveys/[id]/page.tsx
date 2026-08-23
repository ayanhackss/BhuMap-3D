"use client";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { getStatusBadgeClass } from "@/lib/utils";
import { Compass, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SurveyDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: survey, isLoading } = useQuery({
    queryKey: ["survey-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("surveys").select("*").eq("id", id).single();
      if (error) return null;
      return data;
    },
  });

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <Link href="/surveys" className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Surveys
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-ink)] flex items-center gap-2">
              <Compass className="w-6 h-6 text-green-400" />
              Survey Details
            </h2>
            {isLoading ? (
              <div className="h-5 w-48 bg-[var(--color-paper)]/10 rounded mt-2 animate-pulse" />
            ) : (
              <p className="text-sm mt-1 font-mono-id" style={{ color: "var(--color-muted)" }}>
                ID: {survey?.survey_id || id}
              </p>
            )}
          </div>
          {!isLoading && survey && (
            <span className={`text-sm px-3 py-1 rounded-md font-medium ${getStatusBadgeClass(survey.status || 'COMPLETED')}`}>
              {survey.status || 'COMPLETED'}
            </span>
          )}
        </div>
      </div>
      <div className="p-5 rounded-xl mt-6" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
        {isLoading ? <p className="text-[var(--color-muted)] text-sm">Loading...</p> : (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <div><dt className="text-[var(--color-muted)] mb-1">Type</dt><dd className="text-[var(--color-ink)] font-medium">{survey?.type || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Surveyor</dt><dd className="text-[var(--color-ink)] font-medium">{survey?.surveyor_name || "N/A"}</dd></div>
                <div><dt className="text-[var(--color-muted)] mb-1">Date</dt><dd className="text-[var(--color-ink)] font-medium">{survey?.created_at ? new Date(survey.created_at).toLocaleString() : "N/A"}</dd></div>
            </dl>
        )}
      </div>
    </div>
  );
}
