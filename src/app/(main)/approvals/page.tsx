"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuthStore, hasPermission } from "@/store/authStore";
import { getStatusBadgeClass, formatTimestamp } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function ApprovalsPage() {
  const { user } = useAuthStore();
  const qc = useQueryClient();
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  const canApprove = user && hasPermission(user.role, "approve");

  const { data: pending, isLoading } = useQuery({
    queryKey: ["approvals-pending"],
    queryFn: async () => {
      const { data } = await supabase
        .from("properties")
        .select("*, buildings(name), floors(floor_name)")
        .in("approval_status", ["provisional", "requires_review"])
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  async function handleApprove(id: string) {
    setProcessing(id);
    await supabase.from("properties").update({ approval_status: "verified" }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["approvals-pending"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    setProcessing(null);
  }

  async function handleReject(id: string) {
    const reason = rejectReason[id] || "Rejected by authority";
    setProcessing(id);
    await supabase.from("properties").update({ approval_status: "rejected", rejection_reason: reason }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["approvals-pending"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    setProcessing(null);
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[var(--color-ink)]">Approval Workflow</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
          {pending?.length ?? 0} items pending · Government Authority review
        </p>
      </div>

      {!canApprove && (
        <div className="p-4 rounded-xl mb-4 flex items-center gap-3"
          style={{ background: "rgba(245,127,23,0.1)", border: "1px solid rgba(245,127,23,0.3)" }}>
          <AlertTriangle className="w-5 h-5" style={{ color: "#ffa726" }} />
          <div className="text-sm" style={{ color: "#ffa726" }}>
            You need <strong>Government Authority</strong> role to approve records. Login as authority@bhumap.gov.in.
          </div>
        </div>
      )}

      {/* Status workflow diagram */}
      <div className="flex items-center gap-2 mb-6 p-4 rounded-xl overflow-x-auto"
        style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
        {["DRAFT", "PROCESSING", "PROVISIONAL", "REQUIRES_REVIEW", "VERIFIED / REJECTED"].map((status, i, arr) => (
          <div key={status} className="flex items-center gap-2 flex-shrink-0">
            <div className="px-3 py-1.5 rounded text-xs font-medium"
              style={{ background: "var(--color-paper-2)", color: "var(--color-muted)", border: "1px solid var(--color-rule)" }}>
              {status}
            </div>
            {i < arr.length - 1 && <span style={{ color: "var(--color-muted)" }}>→</span>}
          </div>
        ))}
      </div>

      {/* Pending items */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-xl" />)
        ) : pending?.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--color-muted)" }}>
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
            No items pending approval
          </div>
        ) : pending?.map(prop => (
          <div key={prop.id} className="p-4 rounded-xl" style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)" }}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono-id text-xs" style={{ color: "#90caf9" }}>{prop.spid_3d}</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusBadgeClass(prop.approval_status)}`}>
                    {prop.approval_status?.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-sm text-[var(--color-ink)] mb-0.5">
                  {(prop.buildings as { name?: string })?.name} · {(prop.floors as { floor_name?: string })?.floor_name} · Unit {prop.unit_number}
                </div>
                <div className="text-xs" style={{ color: "var(--color-muted)" }}>
                  ULPIN: {prop.parent_ulpin} · Area: {prop.area_sqm}m² · AI Conf: {prop.ai_confidence?.toFixed(1)}%
                </div>

                {/* Reject reason input */}
                {canApprove && (
                  <input
                    placeholder="Rejection reason (required for rejection)..."
                    value={rejectReason[prop.id] || ""}
                    onChange={e => setRejectReason(prev => ({ ...prev, [prop.id]: e.target.value }))}
                    className="mt-2 w-full px-3 py-1.5 rounded text-xs outline-none"
                    style={{ background: "var(--color-paper-2)", border: "1px solid var(--color-rule)", color: "var(--color-ink)" }}
                  />
                )}
              </div>

              {canApprove && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleApprove(prop.id)}
                    disabled={processing === prop.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{ background: "rgba(46,125,50,0.3)", color: "#66bb6a", border: "1px solid rgba(46,125,50,0.4)" }}>
                    <CheckCircle className="w-3.5 h-3.5" />
                    {processing === prop.id ? "Processing..." : "Approve"}
                  </button>
                  <button onClick={() => handleReject(prop.id)}
                    disabled={processing === prop.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all"
                    style={{ background: "rgba(183,28,28,0.3)", color: "#ef5350", border: "1px solid rgba(183,28,28,0.4)" }}>
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


