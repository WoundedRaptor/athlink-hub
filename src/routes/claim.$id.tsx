import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { getProvider, type Provider } from "@/data/providers";
import { Check, Shield } from "lucide-react";

export const Route = createFileRoute("/claim/$id")({
  loader: ({ params }) => {
    const provider = getProvider(params.id);
    if (!provider) throw notFound();
    return { provider };
  },
  component: ClaimPage,
  head: ({ loaderData }) => ({
    meta: [{ title: `Claim ${loaderData?.provider.name ?? "listing"} — AthLink Hub` }],
  }),
});

const STEPS = ["Verify", "Owner details", "Confirm"];

function ClaimPage() {
  const { provider } = Route.useLoaderData() as { provider: Provider };
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <section className="max-w-2xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="size-16 bg-success/15 text-success-foreground rounded-2xl grid place-items-center mx-auto mb-6">
            <Check className="size-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Claim submitted.</h1>
          <p className="text-muted-foreground mb-8">
            We're reviewing your claim for <strong>{provider.name}</strong>. Claim requests are reviewed manually before changes are published.
          </p>
          <Link
            to="/providers/$id"
            params={{ id: provider.id }}
            className="inline-block px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm"
          >
            Back to listing
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          Step {step + 1} of {STEPS.length} · {STEPS[step]}
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
          Claim {provider.name}
        </h1>
        <p className="text-muted-foreground mb-8">
          {provider.tagline} · {provider.neighborhood}
        </p>

        <div className="flex gap-2 mb-10">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
            />
          ))}
        </div>

        <div className="bg-card ring-1 ring-black/5 rounded-3xl p-8 shadow-xl space-y-6">
          {step === 0 && (
            <>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="size-5 text-primary" /> Verify you own this business
              </h2>
              <p className="text-sm text-muted-foreground">
                Claim requests are reviewed manually before changes are published. We may verify
                requests using your business website, email domain, public contact information,
                or follow-up outreach.
              </p>
              <div className="space-y-2">
                <Option label={`Business email on file — ${provider.email}`} defaultChecked />
                <Option label={`Business phone on file — ${provider.phone}`} />
                <Option label="Business website or public contact listing" />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold">Owner details</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <TextField label="Your name" placeholder="Jamie Rivera" />
                <TextField label="Your role" placeholder="Owner / Director" />
                <TextField label="Email" placeholder="you@business.com" type="email" />
                <TextField label="Phone" placeholder="(709) 555-0100" type="tel" />
              </div>
              <TextField
                label="Anything we should know?"
                placeholder="Optional — let us know about ownership history"
              />
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold">Confirm and submit</h2>
              <ul className="space-y-3 text-sm">
                <ConfirmRow label="Business">{provider.name}</ConfirmRow>
                <ConfirmRow label="Review path">Manual review and follow-up outreach</ConfirmRow>
                <ConfirmRow label="Source">{provider.sourceStatus}</ConfirmRow>
              </ul>
              <p className="text-xs text-muted-foreground">
                By submitting, you certify you're authorized to represent this business. For now, this is a static MVP. Submissions are not saved yet.
              </p>
            </>
          )}

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2 font-bold text-sm disabled:opacity-30"
            >
              ← Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setDone(true)}
                className="px-6 py-3 bg-accent text-accent-foreground font-bold rounded-xl text-sm"
              >
                Submit claim
              </button>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function Option({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 p-4 rounded-xl border border-border cursor-pointer hover:bg-secondary/50">
      <input
        type="radio"
        name="verify"
        defaultChecked={defaultChecked}
        className="accent-primary"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

function TextField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function ConfirmRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex justify-between border-b border-border pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{children}</span>
    </li>
  );
}
