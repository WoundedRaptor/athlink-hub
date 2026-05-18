import { Link } from "@tanstack/react-router";
import { Star, Phone, MapPin } from "lucide-react";
import type { Provider } from "@/data/providers";
import { useSaved } from "@/hooks/use-saved";

export function ProviderImage({ provider, className = "" }: { provider: Provider; className?: string }) {
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
  const isAi = provider.sourceStatus === "ai-discovered";

  return (
    <div
      className={`group bg-card p-6 rounded-3xl ring-1 ring-black/5 flex flex-col md:flex-row gap-6 hover:shadow-xl transition-shadow ${
        isAi ? "border-l-4 border-warn/40" : ""
      }`}
    >
      <Link
        to="/providers/$id"
        params={{ id: provider.id }}
        className="w-full md:w-48 aspect-square rounded-2xl overflow-hidden flex-shrink-0"
      >
        <ProviderImage provider={provider} className="w-full h-full" />
      </Link>
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {provider.profileStatus === "claimed" ? (
                <span className="bg-success/15 text-success-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  Verified Provider
                </span>
              ) : (
                <span className="bg-warn/20 text-warn-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  AI Discovered
                </span>
              )}
              <span className="text-xs font-mono text-muted-foreground uppercase">
                {provider.profileStatus}
              </span>
            </div>
            <Link to="/providers/$id" params={{ id: provider.id }}>
              <h3 className="text-2xl font-bold tracking-tight hover:underline">
                {provider.name}
              </h3>
            </Link>
            <p className="text-sm text-muted-foreground mt-1 font-medium">
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
            className={`size-10 grid place-items-center rounded-full border border-border transition-colors ${
              saved ? "bg-primary text-primary-foreground" : "bg-background hover:bg-black/5"
            }`}
          >
            <Star className="size-4" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="mt-auto pt-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-xs font-mono text-muted-foreground uppercase flex items-center gap-1.5">
            <MapPin className="size-3" />
            {provider.distanceMi} mi • {provider.neighborhood}
            {provider.rating > 0 && (
              <span className="ml-3 inline-flex items-center gap-1 normal-case">
                <Star className="size-3 fill-current text-accent" /> {provider.rating}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {isAi ? (
              <Link
                to="/claim/$id"
                params={{ id: provider.id }}
                className="text-sm font-bold px-4 py-2 bg-accent text-accent-foreground rounded-xl hover:opacity-90 transition-opacity"
              >
                Claim Listing
              </Link>
            ) : (
              <>
                <a
                  href={`tel:${provider.phone}`}
                  className="text-sm font-bold px-4 py-2 border border-border rounded-xl hover:bg-black/5 transition-colors inline-flex items-center gap-1.5"
                >
                  <Phone className="size-3.5" /> Contact
                </a>
                <Link
                  to="/providers/$id"
                  params={{ id: provider.id }}
                  className="text-sm font-bold px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:-translate-y-px transition-transform"
                >
                  Book Session
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
