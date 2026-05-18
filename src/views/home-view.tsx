import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ProviderCard } from "@/components/provider-card";
import {
  AGE_GROUPS,
  NEED_LABELS,
  PROVIDERS,
  SPORTS,
  type AgeGroup,
  type Need,
} from "@/data/providers";

const NEEDS: Need[] = ["skills", "strength", "recovery", "gear", "camps", "facility"];

export function HomeView() {
  const navigate = useNavigate();
  const [sport, setSport] = useState<string>(SPORTS[0]);
  const [age, setAge] = useState<AgeGroup>("U12");
  const [location, setLocation] = useState("Austin, TX");

  const featured = PROVIDERS.slice(0, 2);

  const onSearch = () => {
    navigate({
      to: "/search",
      search: { sport, age, location, need: undefined },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-7xl mx-auto">
        <div className="max-w-3xl animate-reveal">
          <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Local · Vetted · Parent-first
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-balance mb-8">
            Elite local training for the{" "}
            <span className="text-primary">next generation.</span>
          </h1>

          <div className="bg-card ring-1 ring-black/5 shadow-2xl rounded-3xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex-1 p-4 md:border-r border-border">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Sport
              </label>
              <select
                className="w-full font-semibold bg-transparent focus:outline-none"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 p-4 md:border-r border-border">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Age Group
              </label>
              <div className="flex gap-1.5 mt-1 flex-wrap">
                {AGE_GROUPS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAge(a)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      a === age
                        ? "bg-primary text-primary-foreground"
                        : "bg-black/5 hover:bg-black/10"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-[1.5] p-4">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter Zip or City"
                className="w-full font-semibold bg-transparent focus:outline-none"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onSearch}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all inline-flex items-center justify-center gap-2"
            >
              <Search className="size-4" /> Find Providers
            </button>
          </div>
        </div>

        {/* Need tiles */}
        <div className="mt-16">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Start with a need
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 animate-reveal [animation-delay:100ms]">
            {NEEDS.map((n) => (
              <Link
                key={n}
                to="/search"
                search={{ need: n }}
                className="group cursor-pointer p-6 bg-card ring-1 ring-black/5 rounded-2xl hover:ring-primary/30 hover:shadow-lg transition-all"
              >
                <div className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">
                  {NEED_LABELS[n].label}
                </div>
                <div className="text-xs text-muted-foreground">{NEED_LABELS[n].sub}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="px-6 py-16 bg-card/50 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                Featured in {`Austin, TX`}
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Trusted by local sports families.
              </h2>
            </div>
            <Link
              to="/search"
              className="text-xs font-mono font-bold underline hidden sm:inline"
            >
              See all providers →
            </Link>
          </div>
          <div className="grid gap-6">
            {featured.map((p) => (
              <ProviderCard key={p.id} provider={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Business CTA */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto bg-stone-900 text-white rounded-3xl p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-60 mb-4">
              For local businesses
            </div>
            <h3 className="text-3xl font-extrabold mb-3">
              Run a youth-sports business? Get in front of active families.
            </h3>
            <p className="text-sm opacity-70 mb-8">
              Add or claim your listing to manage sports served, age groups, services, and
              booking links — and reach parents searching nearby.
            </p>
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/add-business"
                className="px-5 py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-white/90"
              >
                Add Listing
              </Link>
              <Link
                to="/search"
                className="px-5 py-3 border border-white/20 font-bold rounded-xl text-sm hover:bg-white/5"
              >
                See how it looks
              </Link>
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 size-72 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute right-20 top-8 size-32 bg-accent/30 rounded-full blur-3xl" />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
