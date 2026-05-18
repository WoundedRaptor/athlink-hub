import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { SPORTS, NEED_LABELS, AGE_GROUPS, type Need } from "@/data/providers";
import { Check } from "lucide-react";

export const Route = createFileRoute("/add-business")({
  component: AddBusinessPage,
  head: () => ({ meta: [{ title: "Add your business — AthLink Hub" }] }),
});

const NEEDS: Need[] = ["skills", "strength", "recovery", "gear", "camps", "facility"];

function AddBusinessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedNeeds, setSelectedNeeds] = useState<Need[]>([]);
  const [selectedAges, setSelectedAges] = useState<string[]>([]);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <section className="max-w-2xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="size-16 bg-success/15 text-success-foreground rounded-2xl grid place-items-center mx-auto mb-6">
            <Check className="size-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Listing submitted for review.
          </h1>
          <p className="text-muted-foreground mb-8">
            Our team verifies every new provider. You'll hear back within 2 business days at the
            email you provided.
          </p>
          <Link
            to="/search"
            className="inline-block px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm"
          >
            Browse the directory
          </Link>
        </section>
        <SiteFooter />
      </div>
    );
  }

  const toggleNeed = (n: Need) =>
    setSelectedNeeds((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));
  const toggleAge = (a: string) =>
    setSelectedAges((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-20">
        <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-3">
          For local businesses
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
          Add your business.
        </h1>
        <p className="text-muted-foreground mb-10 max-w-xl">
          Reach parents searching nearby for the exact service you offer. Listings are free —
          claimed profiles get verified badges and booking integration.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="bg-card ring-1 ring-black/5 rounded-3xl p-8 space-y-6 shadow-xl"
        >
          <Field label="Business name" required>
            <input
              type="text"
              required
              placeholder="e.g. Apex Soccer Academy"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="Contact email" required>
              <input
                type="email"
                required
                placeholder="you@business.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
            <Field label="Phone" required>
              <input
                type="tel"
                required
                placeholder="(512) 555-0100"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Field label="City" required>
              <input
                type="text"
                required
                placeholder="St. John’s, NL"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </Field>
            <Field label="Primary sport" required>
              <select
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SPORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Age groups served">
            <div className="flex flex-wrap gap-2">
              {AGE_GROUPS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAge(a)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                    selectedAges.includes(a)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-black/10"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Needs you serve">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {NEEDS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => toggleNeed(n)}
                  className={`px-4 py-3 rounded-xl text-sm font-bold text-left transition-colors ${
                    selectedNeeds.includes(n)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-black/10"
                  }`}
                >
                  {NEED_LABELS[n].label}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Tell parents about your business">
            <textarea
              rows={4}
              placeholder="What makes your program different?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </Field>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground max-w-xs">
              By submitting you agree to AthLink Hub's listing terms.
            </p>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl"
            >
              Submit for review
            </button>
          </div>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </span>
      {children}
    </label>
  );
}
