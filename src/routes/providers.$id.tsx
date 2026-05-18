import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ProviderImage } from "@/components/provider-card";
import { getProvider, NEED_LABELS, type Provider } from "@/data/providers";
import { Phone, Mail, Globe, MapPin, Star, ExternalLink, Shield } from "lucide-react";

export const Route = createFileRoute("/providers/$id")({
  loader: ({ params }) => {
    const provider = getProvider(params.id);
    if (!provider) throw notFound();
    return { provider };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.provider.name} — AthLink Hub` },
          { name: "description", content: loaderData.provider.tagline },
          { property: "og:title", content: loaderData.provider.name },
          { property: "og:description", content: loaderData.provider.tagline },
        ]
      : [],
  }),
  component: ProviderPage,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Provider not found</h1>
        <Link to="/search" className="text-primary underline mt-4 inline-block">
          Back to search
        </Link>
      </div>
    </div>
  ),
});

function ProviderPage() {
  const { provider } = Route.useLoaderData() as { provider: Provider };
  const showClaimOnlyActions =
    provider.profileStatus !== "claimed" &&
    (provider.sourceStatus === "ai-discovered" || provider.sourceStatus === "manual-lead");
  const sourceLabel =
    provider.sourceStatus === "manual-lead"
      ? "Manual Lead"
      : provider.sourceStatus === "user-submitted"
        ? "User Submitted"
        : "AI Discovered";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <article className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-16 sm:pb-20">
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-4">
          <Link to="/search" className="hover:underline">
            ← Back to search
          </Link>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_400px] gap-8 lg:gap-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {provider.profileStatus === "claimed" ? (
                <span className="bg-success/15 text-success-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter inline-flex items-center gap-1">
                  <Shield className="size-3" /> Verified Provider
                </span>
              ) : (
                <span className="bg-warn/20 text-warn-foreground text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter">
                  {sourceLabel}
                </span>
              )}
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {provider.profileStatus} · source: {provider.sourceStatus}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 break-words">
              {provider.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 break-words">
              {provider.tagline}
            </p>

            <div className="aspect-[16/9] rounded-3xl overflow-hidden mb-8 ring-1 ring-black/5">
              <ProviderImage provider={provider} className="w-full h-full" />
            </div>

            <p className="text-base leading-relaxed mb-10">{provider.description}</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              <Block label="Sports served">
                <div className="flex flex-wrap gap-1.5">
                  {provider.sports.map((s) => (
                    <Tag key={s}>{s}</Tag>
                  ))}
                </div>
              </Block>
              <Block label="Age groups">
                <div className="flex flex-wrap gap-1.5">
                  {provider.ages.map((a) => (
                    <Tag key={a}>{a}</Tag>
                  ))}
                </div>
              </Block>
              <Block label="Needs covered">
                <div className="flex flex-wrap gap-1.5">
                  {provider.needs.map((n) => (
                    <Tag key={n}>{NEED_LABELS[n].label}</Tag>
                  ))}
                </div>
              </Block>
              <Block label="Price range">
                <span className="font-mono font-bold">{provider.priceRange}</span>
              </Block>
            </div>

            <Block label="Services">
              <ul className="grid sm:grid-cols-2 gap-2">
                {provider.services.map((s) => (
                  <li
                    key={s}
                    className="bg-card ring-1 ring-black/5 rounded-xl px-4 py-3 text-sm font-medium"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="bg-card ring-1 ring-black/5 rounded-3xl p-4 sm:p-6 shadow-lg min-w-0">
              {provider.rating > 0 && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border flex-wrap">
                  <Star className="size-4 fill-current text-accent" />
                  <span className="font-bold">{provider.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({provider.reviews} parent reviews)
                  </span>
                </div>
              )}
              <div className="space-y-3 text-sm mb-6">
                <InfoRow icon={<MapPin className="size-4" />}>
                  {provider.neighborhood} · {provider.city} ({provider.distanceMi} mi)
                </InfoRow>
                <InfoRow icon={<Phone className="size-4" />}>
                  <a href={`tel:${provider.phone}`} className="hover:underline">
                    {provider.phone}
                  </a>
                </InfoRow>
                <InfoRow icon={<Mail className="size-4" />}>
                  <a href={`mailto:${provider.email}`} className="hover:underline">
                    {provider.email}
                  </a>
                </InfoRow>
                <InfoRow icon={<Globe className="size-4" />}>{provider.website}</InfoRow>
              </div>

              {showClaimOnlyActions ? (
                <Link
                  to="/claim/$id"
                  params={{ id: provider.id }}
                  className="block text-center w-full py-3 bg-accent text-accent-foreground font-bold rounded-xl text-sm"
                >
                  Claim this listing
                </Link>
              ) : (
                <div className="space-y-2">
                  <a
                    href={`https://${provider.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="size-4" /> Book Now
                  </a>
                  <a
                    href={`tel:${provider.phone}`}
                    className="block text-center w-full py-3 border border-border font-bold rounded-xl text-sm"
                  >
                    Contact provider
                  </a>
                </div>
              )}
            </div>

            {showClaimOnlyActions && (
              <div className="bg-stone-900 text-white rounded-3xl p-6">
                <h4 className="font-bold mb-1">Is this you?</h4>
                <p className="text-sm opacity-70 mb-4">
                  Claim your listing to update services, hours, and share external booking or contact
                  links.
                </p>
                <Link
                  to="/claim/$id"
                  params={{ id: provider.id }}
                  className="text-xs font-bold underline"
                >
                  Start claim →
                </Link>
              </div>
            )}
          </aside>
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </div>
      {children}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold">{children}</span>
  );
}

function InfoRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 min-w-0">
      <span className="text-muted-foreground mt-0.5 flex-shrink-0">{icon}</span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}
