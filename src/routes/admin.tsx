import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ADMIN_LEADS, type Provider } from "@/data/providers";
import { Check, X, Eye, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin lead review — AthLink Hub" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

type Status = "pending" | "approved" | "dismissed";

function AdminPage() {
  const [statuses, setStatuses] = useState<Record<string, Status>>(
    Object.fromEntries(ADMIN_LEADS.map((l) => [l.id, "pending" as Status])),
  );
  const [selected, setSelected] = useState<Provider | null>(ADMIN_LEADS[0] ?? null);

  const set = (id: string, s: Status) => setStatuses((p) => ({ ...p, [id]: s }));

  const pending = ADMIN_LEADS.filter((l) => statuses[l.id] === "pending");
  const reviewed = ADMIN_LEADS.filter((l) => statuses[l.id] !== "pending");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Admin · AI lead queue
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Review discovered providers.
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Our crawler surfaces local youth-sports businesses from public sources. Approve,
              edit, or dismiss before they appear in parent search.
            </p>
          </div>
          <div className="flex gap-2">
            <Stat label="Pending" value={pending.length} tone="warn" />
            <Stat label="Approved" value={reviewed.filter((r) => statuses[r.id] === "approved").length} tone="success" />
            <Stat label="Dismissed" value={reviewed.filter((r) => statuses[r.id] === "dismissed").length} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Queue table */}
          <div className="bg-card ring-1 ring-black/5 rounded-3xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-sm uppercase tracking-widest">Queue ({pending.length})</h2>
              <button className="text-xs font-mono uppercase font-bold inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="size-3" /> Refresh
              </button>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-bold">Business</th>
                  <th className="px-2 py-3 text-left font-bold">Confidence</th>
                  <th className="px-2 py-3 text-left font-bold">Status</th>
                  <th className="px-6 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ADMIN_LEADS.map((lead) => {
                  const s = statuses[lead.id];
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-secondary/30 ${
                        selected?.id === lead.id ? "bg-secondary/40" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelected(lead)}
                          className="text-left"
                        >
                          <div className="font-bold">{lead.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {lead.tagline} · {lead.neighborhood}
                          </div>
                        </button>
                      </td>
                      <td className="px-2 py-4">
                        <Confidence value={lead.confidence ?? 0} />
                      </td>
                      <td className="px-2 py-4">
                        <StatusBadge status={s} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-1">
                          <IconBtn
                            onClick={() => setSelected(lead)}
                            label="View"
                          >
                            <Eye className="size-3.5" />
                          </IconBtn>
                          <IconBtn
                            onClick={() => set(lead.id, "approved")}
                            label="Approve"
                            tone="success"
                            disabled={s === "approved"}
                          >
                            <Check className="size-3.5" />
                          </IconBtn>
                          <IconBtn
                            onClick={() => set(lead.id, "dismissed")}
                            label="Dismiss"
                            tone="destructive"
                            disabled={s === "dismissed"}
                          >
                            <X className="size-3.5" />
                          </IconBtn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          <aside className="lg:sticky lg:top-24 self-start">
            {selected && (
              <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl">
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">
                  Lead detail
                </div>
                <h3 className="text-xl font-extrabold mb-1">{selected.name}</h3>
                <div className="text-xs opacity-70 font-mono mb-6">
                  Source: {selected.sourceStatus} · {selected.detectedAt?.slice(0, 10)}
                </div>

                <div className="space-y-4 text-sm">
                  <DetailRow label="Sports">{selected.sports.join(", ")}</DetailRow>
                  <DetailRow label="Ages">{selected.ages.join(", ")}</DetailRow>
                  <DetailRow label="Needs">{selected.needs.join(", ")}</DetailRow>
                  <DetailRow label="Location">
                    {selected.neighborhood}, {selected.city}
                  </DetailRow>
                  <DetailRow label="Website">{selected.website}</DetailRow>
                  <DetailRow label="Phone">{selected.phone}</DetailRow>
                  <DetailRow label="Confidence">
                    {((selected.confidence ?? 0) * 100).toFixed(0)}%
                  </DetailRow>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => set(selected.id, "approved")}
                    className="py-2.5 bg-white text-primary text-xs font-bold rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => set(selected.id, "dismissed")}
                    className="py-2.5 border border-white/20 text-xs font-bold rounded-lg hover:bg-white/5"
                  >
                    Dismiss
                  </button>
                </div>
                <Link
                  to="/providers/$id"
                  params={{ id: selected.id }}
                  className="block text-center w-full py-2.5 mt-2 border border-white/10 text-xs font-bold rounded-lg hover:bg-white/5"
                >
                  Open public profile →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "warn" | "success";
}) {
  const toneClass =
    tone === "warn"
      ? "bg-warn/20 text-warn-foreground"
      : tone === "success"
      ? "bg-success/15 text-success-foreground"
      : "bg-secondary text-foreground";
  return (
    <div className={`${toneClass} rounded-xl px-4 py-3 min-w-24 text-center`}>
      <div className="text-2xl font-extrabold leading-none">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">
        {label}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    pending: "bg-warn/20 text-warn-foreground",
    approved: "bg-success/15 text-success-foreground",
    dismissed: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`${map[status]} text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter`}
    >
      {status}
    </span>
  );
}

function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${pct > 80 ? "bg-success" : pct > 60 ? "bg-accent" : "bg-warn"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-xs font-bold">{pct}%</span>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  label,
  tone,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  tone?: "success" | "destructive";
  disabled?: boolean;
}) {
  const toneClass =
    tone === "success"
      ? "hover:bg-success/15 hover:text-success-foreground"
      : tone === "destructive"
      ? "hover:bg-destructive/10 hover:text-destructive"
      : "hover:bg-secondary";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`size-8 grid place-items-center rounded-lg border border-border transition-colors disabled:opacity-30 ${toneClass}`}
    >
      {children}
    </button>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-2">
      <span className="opacity-60 text-xs uppercase tracking-wider font-mono">{label}</span>
      <span className="font-bold text-right">{children}</span>
    </div>
  );
}
