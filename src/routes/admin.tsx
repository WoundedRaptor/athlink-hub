import { useState } from "react";
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
    meta: [
      { title: "Admin lead review — AthLink Hub" },
      { name: "robots", content: "noindex" },
    ],
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
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-20">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Admin · Manual lead queue
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Review businesses before publishing.
            </h1>
            <p className="text-muted-foreground mt-2 max-w-3xl">
              ADMIN_LEADS are manual lead records for AthLink Hub. They stay out of public search
              until a human reviews the source, edits missing information, and explicitly approves
              them for publishing.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Stat label="Needs Review" value={needsReview.length} tone="warn" />
            <Stat label="Duplicate Risk" value={duplicateRisk.length} />
            <Stat label="Approved" value={approved.length} tone="success" />
            <Stat label="Rejected" value={rejected.length} />
          </div>
        </div>

        <div className="mb-8 rounded-3xl bg-warn/15 text-warn-foreground ring-1 ring-warn/20 p-5">
          <h2 className="font-extrabold">Static review prototype</h2>
          <p className="mt-1 text-sm opacity-80">
            Buttons below are mock admin actions only. No database, auth, publishing workflow, or
            persistent backend changes are connected in this demo.
          </p>
        </div>

        <div className="grid xl:grid-cols-[minmax(0,1fr)_440px] gap-8">
          <div className="bg-card ring-1 ring-black/5 rounded-3xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-sm uppercase tracking-widest">
                  Businesses to approve ({ADMIN_LEADS.length})
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manual leads default to Needs Review and are not verified listings.
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-mono uppercase font-bold inline-flex items-center gap-1.5 text-muted-foreground cursor-not-allowed"
                disabled
              >
                <RefreshCw className="size-3" /> Mock refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[920px] text-sm">
                <thead className="bg-secondary/50 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 text-left font-bold">Lead</th>
                    <th className="px-2 py-3 text-left font-bold">Location</th>
                    <th className="px-2 py-3 text-left font-bold">Source</th>
                    <th className="px-2 py-3 text-left font-bold">Profile</th>
                    <th className="px-2 py-3 text-left font-bold">Admin status</th>
                    <th className="px-2 py-3 text-left font-bold">Confidence</th>
                    <th className="px-6 py-3 text-right font-bold">Mock actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ADMIN_LEADS.map((lead) => {
                    const status = adminStatuses[lead.id];
                    const location = splitLocation(lead.city);
                    return (
                      <tr
                        key={lead.id}
                        className={`hover:bg-secondary/30 align-top ${
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
                            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {lead.services.join(" · ")}
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {lead.sports.slice(0, 3).map((sport) => (
                                <MiniPill key={sport}>{sport}</MiniPill>
                              ))}
                            </div>
                          </button>
                        </td>
                        <td className="px-2 py-4 text-xs">
                          <div className="font-bold">{location.city}</div>
                          <div className="text-muted-foreground">{location.province}</div>
                        </td>
                        <td className="px-2 py-4">
                          <SourceBadge source={lead.sourceStatus} />
                        </td>
                        <td className="px-2 py-4">
                          <ProfileBadge provider={lead} />
                        </td>
                        <td className="px-2 py-4">
                          <StatusBadge status={status} />
                        </td>
                        <td className="px-2 py-4">
                          <Confidence value={lead.confidence ?? 0} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ActionBar lead={lead} onSelect={setSelected} onStatus={set} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="xl:sticky xl:top-24 self-start">
            {selected && (
              <LeadDetail
                lead={selected}
                status={adminStatuses[selected.id]}
                onStatus={set}
                onSelect={setSelected}
              />
            )}
          </aside>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function LeadDetail({
  lead,
  status,
  onStatus,
  onSelect,
}: {
  lead: Provider;
  status: AdminStatus;
  onStatus: (id: string, status: AdminStatus) => void;
  onSelect: (lead: Provider) => void;
}) {
  const location = splitLocation(lead.city);
  const isVerified = lead.sourceStatus === "verified";

  return (
    <div className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-xl">
      <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">
        Manual lead detail · source record
      </div>
      <h3 className="text-2xl font-extrabold mb-2">{lead.name}</h3>
      <p className="text-sm opacity-80 mb-5">{lead.description}</p>

      <div className="flex flex-wrap gap-2 mb-6">
        <StatusBadge status={status} inverse />
        <span className="bg-white/10 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
          {isVerified ? "Verified" : "Not verified"}
        </span>
        <span className="bg-white/10 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
          {lead.profileStatus}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <DetailRow label="sourceStatus">{lead.sourceStatus}</DetailRow>
        <DetailRow label="adminStatus">{status}</DetailRow>
        <DetailRow label="profileStatus">{lead.profileStatus}</DetailRow>
        <DetailRow label="confidence">{((lead.confidence ?? 0) * 100).toFixed(0)}%</DetailRow>
        <DetailRow label="sourceUrl">
          {lead.sourceUrl ? (
            <a href={lead.sourceUrl} target="_blank" rel="noreferrer" className="underline">
              {lead.sourceUrl.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            "Not provided"
          )}
        </DetailRow>
        <DetailRow label="city">{location.city}</DetailRow>
        <DetailRow label="province">{location.province}</DetailRow>
        <DetailRow label="sports">{lead.sports.join(", ")}</DetailRow>
        <DetailRow label="needs">
          {lead.needs.map((need) => NEED_LABELS[need].label).join(", ")}
        </DetailRow>
        <DetailRow label="services">{lead.services.join(", ")}</DetailRow>
        <DetailRow label="adminNotes">{lead.adminNotes ?? "No notes yet."}</DetailRow>
      </div>

      <div className="mt-6 rounded-2xl bg-white/10 p-4 text-xs opacity-90">
        Human review required before publishing. Mark Reviewed and Mark Verified are visible as
        planned workflow steps, but they do not change this static record yet.
      </div>

      <div className="mt-6">
        <ActionBar lead={lead} onSelect={onSelect} onStatus={onStatus} full />
      </div>
    </div>
  );
}

function ActionBar({
  lead,
  onSelect,
  onStatus,
  full = false,
}: {
  lead: Provider;
  onSelect: (lead: Provider) => void;
  onStatus: (id: string, status: AdminStatus) => void;
  full?: boolean;
}) {
  return (
    <div
      className={full ? "grid grid-cols-2 gap-2" : "inline-flex gap-1 flex-wrap justify-end"}
    >
      <MockAction
        onClick={() => onSelect(lead)}
        label="Review"
        icon={<Eye className="size-3.5" />}
        full={full}
      />
      <MockAction
        label="Edit"
        icon={<Edit3 className="size-3.5" />}
        full={full}
        disabled
      />
      <MockAction
        onClick={() => onStatus(lead.id, "Approved")}
        label="Approve"
        icon={<Check className="size-3.5" />}
        tone="success"
        full={full}
      />
      <MockAction
        onClick={() => onStatus(lead.id, "Rejected")}
        label="Reject"
        icon={<X className="size-3.5" />}
        tone="destructive"
        full={full}
      />
      <MockAction
        onClick={() => onStatus(lead.id, "Duplicate Risk")}
        label="Flag Duplicate"
        icon={<Flag className="size-3.5" />}
        full={full}
      />
      <MockAction
        label="Mark Claimed"
        icon={<UserCheck className="size-3.5" />}
        full={full}
        disabled
      />
      <MockAction
        label="Mark Reviewed"
        icon={<Check className="size-3.5" />}
        full={full}
        disabled
      />
      <MockAction
        label="Mark Verified"
        icon={<ShieldCheck className="size-3.5" />}
        full={full}
        disabled
      />
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
    <div className="border-b border-white/10 pb-2">
      <div className="opacity-60 text-[10px] uppercase tracking-wider font-mono mb-1">
        {label}
      </div>
      <div className="font-bold break-words">{children}</div>
    </div>
  );
}

function splitLocation(location: string) {
  const [city, province] = location.split(",").map((part) => part.trim());
  return { city: city || location, province: province || "Province not listed" };
}
