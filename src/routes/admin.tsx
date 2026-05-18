import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
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

const ADMIN_STATUS_ORDER: AdminStatus[] = [
  "Needs Review",
  "Missing Info",
  "Duplicate Risk",
  "Ready to Publish",
  "Approved",
  "Rejected",
];

function AdminPage() {
  const initialAdminStatuses = useMemo<Record<string, AdminStatus>>(
    () => Object.fromEntries(ADMIN_LEADS.map((lead) => [lead.id, lead.adminStatus])),
    [],
  );
  const [adminStatuses, setAdminStatuses] = useState<Record<string, AdminStatus>>(initialAdminStatuses);
  const [selected, setSelected] = useState<Provider | null>(ADMIN_LEADS[0] ?? null);

  const selectedStatus = selected ? adminStatuses[selected.id] : "Needs Review";

  const counts = useMemo(() => {
    const initial: Record<AdminStatus, number> = {
      "Needs Review": 0,
      "Missing Info": 0,
      "Duplicate Risk": 0,
      "Ready to Publish": 0,
      Approved: 0,
      Rejected: 0,
    };

    return ADMIN_LEADS.reduce((totals, lead) => {
      const status = adminStatuses[lead.id];
      totals[status] += 1;
      return totals;
    }, initial);
  }, [adminStatuses]);

  const setStatus = (id: string, status: AdminStatus) => {
    setAdminStatuses((previous) => ({ ...previous, [id]: status }));
  };

  const mockOnly = () => undefined;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">
        <div className="flex flex-col gap-6 mb-8 sm:mb-10">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Admin Portal · Manual lead queue
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight break-words">
              Review provider leads before publishing.
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl">
              Static MVP control center for checking manual provider leads. Human review is required
              before a lead can appear in public parent search.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3">
            <Stat label="Total Leads" value={ADMIN_LEADS.length} />
            {ADMIN_STATUS_ORDER.map((status) => (
              <Stat key={status} label={status} value={counts[status]} tone={statTone(status)} />
            ))}
          </div>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_430px] gap-6 lg:gap-8">
          <div className="bg-card ring-1 ring-black/5 rounded-3xl overflow-hidden shadow-lg min-w-0">
            <div className="px-4 sm:px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest">Review queue</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes ADMIN_LEADS only; public search uses PUBLIC_PROVIDERS.
                </p>
              </div>
              <button
                type="button"
                onClick={mockOnly}
                className="text-xs font-mono uppercase font-bold inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw className="size-3" /> Refresh
              </button>
            </div>

            <table className="hidden lg:table w-full text-sm table-fixed">
              <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 text-left font-bold w-[28%]">Business</th>
                  <th className="px-3 py-3 text-left font-bold w-[17%]">City</th>
                  <th className="px-3 py-3 text-left font-bold w-[23%]">Sports / Needs</th>
                  <th className="px-3 py-3 text-left font-bold w-[20%]">Statuses</th>
                  <th className="px-6 py-3 text-right font-bold w-[12%]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ADMIN_LEADS.map((lead) => {
                  const status = adminStatuses[lead.id];
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-secondary/30 ${selected?.id === lead.id ? "bg-secondary/40" : ""}`}
                    >
                      <td className="px-6 py-4 align-top">
                        <button type="button" onClick={() => setSelected(lead)} className="text-left">
                          <div className="font-bold break-words">{lead.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 break-words">
                            {lead.tagline}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <SourceBadge source={lead.sourceStatus} />
                            <ProfileBadge status={lead.profileStatus} />
                          </div>
                        </button>
                      </td>
                      <td className="px-3 py-4 align-top text-muted-foreground break-words">
                        {lead.city}
                      </td>
                      <td className="px-3 py-4 align-top">
                        <QueueList label="Sports" items={lead.sports} />
                        <QueueList label="Needs" items={lead.needs.map((need) => NEED_LABELS[need].label)} />
                      </td>
                      <td className="px-3 py-4 align-top">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          <StatusBadge status={status} />
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Profile: {formatProfileStatus(lead.profileStatus)}</div>
                          <div>Source: {formatSourceStatus(lead.sourceStatus)}</div>
                          {lead.confidence !== undefined && <Confidence value={lead.confidence} />}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-right">
                        <div className="inline-flex flex-wrap justify-end gap-1.5">
                          <MockAction
                            icon={<Eye className="size-3.5" />}
                            onClick={() => setSelected(lead)}
                            label="Review"
                          />
                          <MockAction
                            icon={<Check className="size-3.5" />}
                            onClick={() => setStatus(lead.id, "Approved")}
                            label="Approve"
                            tone="success"
                            disabled={status === "Approved"}
                          />
                          <MockAction
                            icon={<X className="size-3.5" />}
                            onClick={() => setStatus(lead.id, "Rejected")}
                            label="Reject"
                            tone="destructive"
                            disabled={status === "Rejected"}
                          />
                          <MockAction
                            icon={<Flag className="size-3.5" />}
                            onClick={() => setStatus(lead.id, "Duplicate Risk")}
                            label="Flag Duplicate"
                            disabled={status === "Duplicate Risk"}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="lg:hidden divide-y divide-border">
              {ADMIN_LEADS.map((lead) => {
                const status = adminStatuses[lead.id];
                return (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    status={status}
                    isSelected={selected?.id === lead.id}
                    onSelect={() => setSelected(lead)}
                    onStatus={setStatus}
                  />
                );
              })}
            </div>
          </div>

          <aside className="xl:sticky xl:top-24 self-start min-w-0">
            {selected && (
              <div className="bg-primary text-primary-foreground rounded-3xl p-4 sm:p-6 shadow-xl min-w-0 overflow-hidden">
                <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">
                  Lead details
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <SourceBadge source={selected.sourceStatus} inverse />
                  <StatusBadge status={selectedStatus} inverse />
                  <ProfileBadge status={selected.profileStatus} inverse />
                </div>
                <h3 className="text-2xl font-extrabold mb-1 break-words">{selected.name}</h3>
                <p className="text-sm opacity-80 mb-3 break-words">{selected.tagline}</p>
                <p className="text-sm opacity-80 mb-6 break-words">{selected.description}</p>

                <div className="space-y-4 text-sm">
                  <DetailRow label="City">{selected.city}</DetailRow>
                  <DetailRow label="Neighborhood">{selected.neighborhood}</DetailRow>
                  <DetailRow label="Sports">{selected.sports.join(", ")}</DetailRow>
                  <DetailRow label="Ages">{selected.ages.join(", ")}</DetailRow>
                  <DetailRow label="Needs">
                    {selected.needs.map((need) => NEED_LABELS[need].label).join(", ")}
                  </DetailRow>
                  <DetailRow label="Services">{selected.services.join(", ")}</DetailRow>
                  <DetailRow label="Profile status">
                    {formatProfileStatus(selected.profileStatus)}
                  </DetailRow>
                  <DetailRow label="Source status">
                    {formatSourceStatus(selected.sourceStatus)}
                  </DetailRow>
                  <DetailRow label="Admin status">{selectedStatus}</DetailRow>
                  {selected.confidence !== undefined && (
                    <DetailRow label="Confidence">{formatConfidence(selected.confidence)}</DetailRow>
                  )}
                  {selected.sourceUrl && (
                    <DetailRow label="Source URL">
                      <a
                        href={selected.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline decoration-white/40 underline-offset-4 break-all"
                      >
                        {selected.sourceUrl}
                      </a>
                    </DetailRow>
                  )}
                  {selected.adminNotes && (
                    <DetailRow label="Admin notes">{selected.adminNotes}</DetailRow>
                  )}
                  {selected.website && <DetailRow label="Website">{selected.website}</DetailRow>}
                  {selected.phone && <DetailRow label="Phone">{selected.phone}</DetailRow>}
                  {selected.email && <DetailRow label="Email">{selected.email}</DetailRow>}
                </div>

                <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-3 text-xs leading-relaxed opacity-90">
                  Static MVP: update provider status in providers.ts to publish or change status.
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                  <DetailAction icon={<Eye className="size-3.5" />} label="Review" onClick={mockOnly} />
                  <DetailAction icon={<Edit3 className="size-3.5" />} label="Edit" onClick={mockOnly} />
                  <DetailAction
                    icon={<Check className="size-3.5" />}
                    label="Approve"
                    onClick={() => setStatus(selected.id, "Approved")}
                  />
                  <DetailAction
                    icon={<X className="size-3.5" />}
                    label="Reject"
                    onClick={() => setStatus(selected.id, "Rejected")}
                  />
                  <DetailAction
                    icon={<Flag className="size-3.5" />}
                    label="Flag Duplicate"
                    onClick={() => setStatus(selected.id, "Duplicate Risk")}
                  />
                  <DetailAction
                    icon={<UserCheck className="size-3.5" />}
                    label="Mark Claimed"
                    onClick={mockOnly}
                  />
                  <DetailAction
                    icon={<ShieldCheck className="size-3.5" />}
                    label="Mark Reviewed"
                    onClick={mockOnly}
                  />
                  <DetailAction
                    icon={<ShieldCheck className="size-3.5" />}
                    label="Mark Verified"
                    onClick={mockOnly}
                  />
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function LeadCard({
  lead,
  status,
  isSelected,
  onSelect,
  onStatus,
}: {
  lead: Provider;
  status: AdminStatus;
  isSelected: boolean;
  onSelect: () => void;
  onStatus: (id: string, status: AdminStatus) => void;
}) {
  return (
    <div className={`p-4 space-y-4 min-w-0 ${isSelected ? "bg-secondary/40" : ""}`}>
      <button type="button" onClick={onSelect} className="w-full text-left min-w-0">
        <div className="font-bold break-words">{lead.name}</div>
        <div className="text-xs text-muted-foreground mt-1 break-words">{lead.city}</div>
      </button>
      <div className="flex flex-wrap gap-1.5">
        <SourceBadge source={lead.sourceStatus} />
        <StatusBadge status={status} />
        <ProfileBadge status={lead.profileStatus} />
      </div>
      <div className="grid gap-3 text-xs text-muted-foreground">
        <QueueList label="Sports" items={lead.sports} />
        <QueueList label="Needs" items={lead.needs.map((need) => NEED_LABELS[need].label)} />
        <div>Profile status: {formatProfileStatus(lead.profileStatus)}</div>
        <div>Source status: {formatSourceStatus(lead.sourceStatus)}</div>
        <div>Admin status: {status}</div>
        {lead.confidence !== undefined && <Confidence value={lead.confidence} />}
      </div>
      <div className="flex flex-wrap gap-2">
        <ActionBtn onClick={onSelect} label="Review" />
        <ActionBtn onClick={() => onStatus(lead.id, "Approved")} label="Approve" tone="success" />
        <ActionBtn onClick={() => onStatus(lead.id, "Rejected")} label="Reject" tone="destructive" />
        <ActionBtn onClick={() => onStatus(lead.id, "Duplicate Risk")} label="Flag Duplicate" />
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" | "success" | "danger" }) {
  const toneClass =
    tone === "warn"
      ? "bg-warn/20 text-warn-foreground"
      : tone === "success"
        ? "bg-success/15 text-success-foreground"
        : tone === "danger"
          ? "bg-destructive/10 text-destructive"
          : "bg-card text-foreground ring-1 ring-black/5";
  return (
    <div className={`${toneClass} rounded-xl px-3 sm:px-4 py-3 min-w-0 text-center`}>
      <div className="text-xl sm:text-2xl font-extrabold leading-none">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-70 break-words">
        {label}
      </div>
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
  return <Badge className={map[status]}>{status}</Badge>;
}

function SourceBadge({ source, inverse = false }: { source: Provider["sourceStatus"]; inverse?: boolean }) {
  const label = formatSourceStatus(source);
  const className = inverse ? "bg-white/15 text-white" : "bg-secondary text-muted-foreground";
  return <Badge className={className}>{label}</Badge>;
}

function ProfileBadge({ status, inverse = false }: { status: Provider["profileStatus"]; inverse?: boolean }) {
  const className = inverse ? "bg-white/15 text-white" : "bg-secondary text-muted-foreground";
  return <Badge className={className}>{formatProfileStatus(status)}</Badge>;
}

function Badge({ children, className }: { children: ReactNode; className: string }) {
  return (
    <span className={`${className} text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter`}>
      {children}
    </span>
  );
}

function Confidence({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden flex-shrink-0">
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
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
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
      title={label}
      className={`inline-flex size-8 items-center justify-center rounded-lg border border-border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${toneClass}`}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

function DetailAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold hover:bg-white/15"
    >
      {icon}
      {label}
    </button>
  );
}

function QueueList({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xs font-medium break-words">{items.join(", ")}</div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-white/10 pb-2 min-w-0">
      <span className="opacity-60 text-xs uppercase tracking-wider font-mono flex-shrink-0">{label}</span>
      <span className="font-bold sm:text-right break-words min-w-0">{children}</span>
    </div>
  );
}

function ActionBtn({
  onClick,
  label,
  tone,
}: {
  onClick: () => void;
  label: string;
  tone?: "success" | "destructive";
}) {
  const toneClass =
    tone === "success"
      ? "bg-success/15 text-success-foreground"
      : tone === "destructive"
        ? "bg-destructive/10 text-destructive"
        : "bg-secondary text-foreground";
  return (
    <button type="button" onClick={onClick} className={`${toneClass} min-h-10 rounded-xl px-4 text-xs font-bold`}>
      {label}
    </button>
  );
}

function formatSourceStatus(source: Provider["sourceStatus"]) {
  const labels: Record<Provider["sourceStatus"], string> = {
    verified: "Verified Source",
    "ai-discovered": "AI Discovered",
    "user-submitted": "User Submitted",
    "manual-lead": "Manual Lead",
  };
  return labels[source];
}

function formatProfileStatus(status: Provider["profileStatus"]) {
  return status === "claimed" ? "Claimed" : "Unclaimed";
}

function formatConfidence(value: number) {
  return `${Math.round(value * 100)}%`;
}

function statTone(status: AdminStatus) {
  if (status === "Needs Review" || status === "Missing Info" || status === "Duplicate Risk") {
    return "warn" as const;
  }
  if (status === "Approved") {
    return "success" as const;
  }
  if (status === "Rejected") {
    return "danger" as const;
  }
  return undefined;
}
