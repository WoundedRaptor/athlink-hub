import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import {
  ADMIN_LEADS,
  NEED_LABELS,
  type AdminStatus,
  type Provider,
} from "@/data/providers";
import {
  Check,
  Edit3,
  Eye,
  Flag,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [{ title: "Admin lead review — AthLink Hub" }, { name: "robots", content: "noindex" }],
  }),
});

function AdminPage() {
  const [adminStatuses, setAdminStatuses] = useState<Record<string, AdminStatus>>(
    Object.fromEntries(ADMIN_LEADS.map((l) => [l.id, l.adminStatus ?? "Needs Review"])),
  );
  const [selected, setSelected] = useState<Provider | null>(ADMIN_LEADS[0] ?? null);

  const set = (id: string, status: AdminStatus) =>
    setAdminStatuses((previous) => ({ ...previous, [id]: status }));

  const needsReview = ADMIN_LEADS.filter((lead) => adminStatuses[lead.id] === "Needs Review");
  const approved = ADMIN_LEADS.filter((lead) => adminStatuses[lead.id] === "Approved");
  const rejected = ADMIN_LEADS.filter((lead) => adminStatuses[lead.id] === "Rejected");
  const duplicateRisk = ADMIN_LEADS.filter(
    (lead) => adminStatuses[lead.id] === "Duplicate Risk",
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Admin · Manual lead queue
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Review businesses before publishing.
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Our crawler surfaces local youth-sports businesses from public sources. Approve, edit,
              or dismiss before they appear in parent search.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Stat label="Pending" value={needsReview.length} tone="warn" />
            <Stat
              label="Approved"
              value={approved.length}
              tone="success"
            />
            <Stat label="Rejected" value={rejected.length} />
            <Stat label="Duplicate" value={duplicateRisk.length} />
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8">
          {/* Queue table */}
          <div className="bg-card ring-1 ring-black/5 rounded-3xl overflow-hidden shadow-lg min-w-0">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-sm uppercase tracking-widest">
                Queue ({ADMIN_LEADS.length})
              </h2>
              <button className="text-xs font-mono uppercase font-bold inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                <RefreshCw className="size-3" /> Refresh
              </button>
            </div>
            <table className="hidden md:table w-full text-sm">
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
                  const s = adminStatuses[lead.id] ?? lead.adminStatus ?? "Needs Review";
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
                          <MockAction
                            icon={<Eye className="size-3.5" />}
                            onClick={() => setSelected(lead)}
                            label="View"
                          />
                          <MockAction
                            icon={<Check className="size-3.5" />}
                            onClick={() => set(lead.id, "Approved")}
                            label="Approve"
                            tone="success"
                            disabled={s === "Approved"}
                          />
                          <MockAction
                            icon={<X className="size-3.5" />}
                            onClick={() => set(lead.id, "Rejected")}
                            label="Reject"
                            tone="destructive"
                            disabled={s === "Rejected"}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="md:hidden divide-y divide-border">
              {ADMIN_LEADS.map((lead) => {
                const s = adminStatuses[lead.id] ?? lead.adminStatus ?? "Needs Review";
                return (
                  <div
                    key={lead.id}
                    className={`p-4 space-y-4 ${selected?.id === lead.id ? "bg-secondary/40" : ""}`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelected(lead)}
                      className="w-full text-left"
                    >
                      <div className="font-bold break-words">{lead.name}</div>
                      <div className="text-xs text-muted-foreground font-mono break-words">
                        {lead.tagline} · {lead.neighborhood}
                      </div>
                    </button>
                    <div className="flex flex-wrap items-center gap-3">
                      <Confidence value={lead.confidence ?? 0} />
                      <StatusBadge status={s} />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <ActionBtn onClick={() => setSelected(lead)} label="View" />
                      <ActionBtn
                        onClick={() => set(lead.id, "Approved")}
                        label="Approve"
                        tone="success"
                        disabled={s === "Approved"}
                      />
                      <ActionBtn
                        onClick={() => set(lead.id, "Rejected")}
                        label="Reject"
                        tone="destructive"
                        disabled={s === "Rejected"}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className="xl:sticky xl:top-24 self-start">
            {selected && (
              <div className="bg-primary text-primary-foreground rounded-3xl p-4 sm:p-6 shadow-xl min-w-0">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6">
                  <button
                    type="button"
                    onClick={() => set(selected.id, "Approved")}
                    className="py-2.5 bg-white text-primary text-xs font-bold rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => set(selected.id, "Rejected")}
                    className="py-2.5 border border-white/20 text-xs font-bold rounded-lg hover:bg-white/5"
                  >
                    Reject
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

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" | "success" }) {
  const toneClass =
    tone === "warn"
      ? "bg-warn/20 text-warn-foreground"
      : tone === "success"
        ? "bg-success/15 text-success-foreground"
        : "bg-secondary text-foreground";
  return (
    <div className={`${toneClass} rounded-xl px-3 sm:px-4 py-3 min-w-20 sm:min-w-24 text-center`}>
      <div className="text-xl sm:text-2xl font-extrabold leading-none">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70">{label}</div>
    </div>
  );
}

function StatusBadge({ status, inverse = false }: { status: AdminStatus; inverse?: boolean }) {
  const map: Record<AdminStatus, string> = {
    "Needs Review": inverse ? "bg-white/15 text-white" : "bg-warn/20 text-warn-foreground",
    "Duplicate Risk": inverse ? "bg-white/15 text-white" : "bg-accent/20 text-accent-foreground",
    "Missing Info": inverse ? "bg-white/15 text-white" : "bg-muted text-muted-foreground",
    "Ready to Publish": inverse ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
    Approved: inverse ? "bg-white text-primary" : "bg-success/15 text-success-foreground",
    Rejected: inverse ? "bg-white/15 text-white" : "bg-destructive/10 text-destructive",
  };
  return (
    <span
      className={`${map[status]} text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter`}
    >
      {status}
    </span>
  );
}

function SourceBadge({ source }: { source: Provider["sourceStatus"] }) {
  return (
    <span className="bg-secondary text-muted-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
      {source}
    </span>
  );
}

function ProfileBadge({ provider }: { provider: Provider }) {
  const verified = provider.sourceStatus === "verified";
  return (
    <div className="space-y-1">
      <span className="bg-secondary text-muted-foreground text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter inline-block">
        {provider.profileStatus}
      </span>
      <div className="text-[10px] font-mono text-muted-foreground">
        {verified ? "verified" : "not verified"}
      </div>
    </div>
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

function MockAction({
  icon,
  label,
  onClick,
  tone,
  disabled = false,
  full = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  tone?: "success" | "destructive";
  disabled?: boolean;
  full?: boolean;
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
      title={disabled ? `${label} is a static mock action` : label}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg border border-border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toneClass} ${
        full ? "px-3 py-2 text-xs font-bold" : "size-8"
      }`}
    >
      {icon}
      {full && <span>{label}</span>}
    </button>
  );
}

function MiniPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/10 pb-2">
      <span className="opacity-60 text-xs uppercase tracking-wider font-mono">{label}</span>
      <span className="font-bold sm:text-right break-words">{children}</span>
    </div>
  );
}

function ActionBtn({
  onClick,
  label,
  tone,
  disabled,
}: {
  onClick: () => void;
  label: string;
  tone?: "success" | "destructive";
  disabled?: boolean;
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/15 text-success-foreground"
      : tone === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-secondary text-foreground";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${toneClass} min-h-10 rounded-xl px-4 text-xs font-bold disabled:opacity-30`}
    >
      {label}
    </button>
  );
}
