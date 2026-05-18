import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ProviderCard } from "@/components/provider-card";
import { PUBLIC_PROVIDERS } from "@/data/providers";
import { useSaved } from "@/hooks/use-saved";

export const Route = createFileRoute("/saved")({
  component: SavedPage,
  head: () => ({ meta: [{ title: "Saved providers — AthLink Hub" }] }),
});

function SavedPage() {
  const { ids } = useSaved();
  const saved = PUBLIC_PROVIDERS.filter((p) => ids.includes(p.id));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          Your shortlist
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-8">
          Saved providers ({saved.length})
        </h1>

        {saved.length === 0 ? (
          <div className="bg-card ring-1 ring-black/5 rounded-3xl p-12 text-center max-w-2xl">
            <h2 className="text-xl font-bold mb-2">Nothing saved yet.</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Tap the star on any provider to add them to your shortlist.
            </p>
            <Link
              to="/search"
              className="inline-block px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm"
            >
              Browse providers
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {saved.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
