"use client";
import { ScrollText, Search } from "lucide-react";

const MOCK_AUDIT = [
  { id: "LOG-5510", user: "surveyor@bhumap.gov.in", action: "UPDATE_GEOMETRY", entity: "Property", entityId: "3DSPID-U402", time: "10 mins ago" },
  { id: "LOG-5509", user: "authority@bhumap.gov.in", action: "APPROVE_RECORD", entity: "Building", entityId: "BLDG-992", time: "1 hour ago" },
  { id: "LOG-5508", user: "system_ai", action: "CREATE_CONFLICT", entity: "Conflict", entityId: "CF-882", time: "2 hours ago" },
];

export default function AuditPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--color-ink)] flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-[var(--color-muted)]" />
            System Audit Log
          </h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted)" }}>
            Immutable record of all system actions
          </p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted)" }} />
          <input
            type="text"
            placeholder="Search logs..."
            className="pl-9 pr-4 py-1.5 rounded-md text-sm outline-none"
            style={{ background: "var(--color-paper)", border: "1px solid var(--color-border)", color: "white" }}
          />
        </div>
      </div>
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-border)", background: "var(--color-paper)" }}>
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--color-paper-2)", borderBottom: "1px solid var(--color-border)" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Log ID</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>User</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Action</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Entity</th>
              <th className="px-4 py-3 font-medium text-xs uppercase" style={{ color: "var(--color-muted)" }}>Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-rule)]">
            {MOCK_AUDIT.map((a) => (
              <tr key={a.id} className="hover:bg-[var(--color-paper-2)] transition-colors">
                <td className="px-4 py-3 font-mono-id text-[var(--color-muted)]">{a.id}</td>
                <td className="px-4 py-3 text-[var(--color-ink)]">{a.user}</td>
                <td className="px-4 py-3 text-[var(--color-ink)] font-mono text-xs">{a.action}</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{a.entity} ({a.entityId})</td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{a.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

