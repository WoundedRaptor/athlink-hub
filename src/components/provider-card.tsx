import { Link } from "@tanstack/react-router";
import { Star, Phone, MapPin } from "lucide-react";
import type { Provider } from "@/data/providers";
import { useSaved } from "@/hooks/use-saved";

export function ProviderImage({
  provider,
  className = "",
}: {
  provider: Provider;
  className?: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${provider.imageHue} grid place-items-center relative overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 mix-blend-overlay opacity-40 bg-[radial-gradient(circle_at_30%_30%,white,transparent_60%)]" />
      <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 relative">
        {provider.sports[0]}
      </span>
    </div>
  );
}

export function ProviderCard({ provider }: { provider: Provider }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(provider.id);
  const isClaimed = provider.profileStatus === "claimed";
  const sourceLabel =
    provider.sourceStatus === "manual-lead"
      ? "Manual Lead"
      : provider.sourceStatus === "user-submitted"
        ? "User Submitted"
        : "AI Discovered";
  const showClaimOnlyActions =
    provider.profileStatus !== "claimed" &&
    (provider.sourceStatus === "ai-discovered" || provider.sourceStatus === "manual-lead");

  return (
    <div
      className={`group bg-card p-4 sm:p-6 rounded-3xl ring-1 ring-black/5 flex flex-col md:flex-row gap-4 sm:gap-6 hover:shadow-xl transition-shadow min-w-0 ${
        showClaimOnlyActions ? "border-l-4 border-warn/40" : ""
      }`}
    >
      <Link
        to="/providers/$id"
        params={{ id: provider.id }}
        className="w-full md:w-48 aspect-[16/10] md:aspect-square rounded-2xl overflow-hidden flex-shrink-0"
      >
        <ProviderImage provider={provider} className="w-full h-full" />
      </Link>
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex justify-between items-start gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {isClaimed ? (
                <span className="bg-success/15 text-success-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  Verified Provider
                </span>
              ) : (
                <span className="bg-warn/20 text-warn-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  {sourceLabel}
                </span>
              )}
              <span className="text-xs font-mono text-muted-foreground uppercase">
                {provider.profileStatus}
              </span>
            </div>
            <Link to="/providers/$id" params={{ id: provider.id }}>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight hover:underline break-words">
                {provider.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 font-medium break-words">
              {provider.tagline} • {provider.ages.join(", ")}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {provider.services.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggle(provider.id)}
            aria-label={saved ? "Remove from saved" : "Save provider"}
            className={`size-10 grid place-items-center rounded-full border border-border transition-colors flex-shrink-0 ${
              saved ? "bg-primary text-primary-foreground" : "bg-background hover:bg-black/5"
            }`}
          >
            <Star className="size-4" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5 flex-wrap min-w-0 break-words">
            <MapPin className="size-3" />
            {provider.distanceMi} mi • {provider.neighborhood}
            {provider.rating > 0 && (
              <span className="ml-3 inline-flex items-center gap-1 normal-case">
                <Star className="size-3 fill-current text-accent" /> {provider.rating}
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {showClaimOnlyActions ? (
              <Link
                to="/claim/$id"
                params={{ id: provider.id }}
                className="text-sm font-bold px-4 py-2 bg-accent text-accent-foreground rounded-xl hover:opacity-90 transition-opacity text-center"
              >
                Claim Listing
              </Link>
            ) : (
              <>
                <a
                  href={`tel:${provider.phone}`}
                  className="text-sm font-bold px-4 py-2 border border-border rounded-xl hover:bg-black/5 transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Phone className="size-3.5" /> Contact
                </a>
                <a
                  href={`https://${provider.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-bold px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-px transition-transform text-center"
                >
                  Book Now
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
