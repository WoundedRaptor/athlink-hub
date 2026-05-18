import { useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { ProviderCard } from "@/components/provider-card";
import {
  AGE_GROUPS,
  NEED_LABELS,
  PUBLIC_PROVIDERS,
  SPORTS,
  type AgeGroup,
  type Need,
} from "@/data/providers";
import { getRouteApi } from "@tanstack/react-router";

const routeApi = getRouteApi("/search");
const NEEDS: Need[] = ["skills", "strength", "recovery", "gear", "camps", "facility"];

function getSortDistance(provider: (typeof PUBLIC_PROVIDERS)[number]) {
  const isPlaceholderDistance =
    provider.distanceMi === 0 &&
    provider.profileStatus !== "claimed" &&
    (provider.sourceStatus === "manual-lead" || provider.sourceStatus === "ai-discovered");

  if (isPlaceholderDistance) return Number.POSITIVE_INFINITY;
  return provider.distanceMi > 0 ? provider.distanceMi : Number.POSITIVE_INFINITY;
}

export function SearchView() {
  const search = routeApi.useSearch();
  const navigate = useNavigate({ from: "/search" });

  const update = (patch: Partial<typeof search>) =>
    navigate({ search: (prev: typeof search) => ({ ...prev, ...patch }) });

  const locationQuery = (search.location ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    return PUBLIC_PROVIDERS.filter((p) => {
      if (search.sport && !p.sports.includes(search.sport)) return false;
      if (search.age && search.age !== "All" && !p.ages.includes(search.age as AgeGroup)) {
        return false;
      }
      if (search.need && !p.needs.includes(search.need)) return false;

      if (locationQuery) {
        const searchable = [
          p.name,
          p.city,
          p.neighborhood,
          ...p.sports,
          ...p.services,
          ...p.needs.map((need) => NEED_LABELS[need].label),
          ...p.needs.map((need) => NEED_LABELS[need].sub),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(locationQuery)) return false;
      }

      return true;
    }).sort((a, b) => {
      const distanceDiff = getSortDistance(a) - getSortDistance(b);
      if (distanceDiff !== 0) return distanceDiff;
      return a.name.localeCompare(b.name);
    });
  }, [search.sport, search.age, search.need, locationQuery]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      {/* Search composer */}
      <section className="px-4 sm:px-6 pt-8 sm:pt-12 pb-6 max-w-7xl mx-auto">
        <div className="bg-card ring-1 ring-black/5 shadow-xl rounded-3xl p-2 flex flex-col md:flex-row gap-2 animate-reveal min-w-0">
          <div className="flex-1 p-4 md:border-r border-border">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              Sport
            </label>
            <select
              className="w-full font-semibold bg-transparent focus:outline-none"
              value={search.sport}
              onChange={(e) => update({ sport: e.target.value })}
            >
              <option value="">All sports</option>
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
                  onClick={() => update({ age: a })}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                    a === search.age
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
              Search or location
            </label>
            <input
              type="text"
              placeholder="Name, sport, city, neighbourhood, or service"
              className="w-full font-semibold bg-transparent focus:outline-none"
              value={search.location}
              onChange={(e) => update({ location: e.target.value })}
            />
          </div>
        </div>

        {/* Need chips */}
        <div className="flex gap-2 flex-wrap mt-6">
          <button
            type="button"
            onClick={() => update({ need: undefined })}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              !search.need
                ? "bg-foreground text-background"
                : "bg-card border border-border hover:bg-black/5"
            }`}
          >
            All needs
          </button>
          {NEEDS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update({ need: n })}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                search.need === n
                  ? "bg-foreground text-background"
                  : "bg-card border border-border hover:bg-black/5"
              }`}
            >
              {NEED_LABELS[n].label}
            </button>
          ))}
        </div>
      </section>

      {/* Results */}
      <section className="px-4 sm:px-6 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1 space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground break-words">
                {results.length} result{results.length === 1 ? "" : "s"} in Atlantic Canada
              </h2>
              <span className="text-xs font-mono font-bold uppercase text-muted-foreground">
                Sort: Distance
              </span>
            </div>
            {(locationQuery || search.sport || (search.age && search.age !== "All") || search.need) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-bold uppercase tracking-wider">Active:</span>
                {locationQuery && <span className="rounded-full bg-card px-3 py-1 ring-1 ring-border">Search: {search.location}</span>}
                {search.sport && <span className="rounded-full bg-card px-3 py-1 ring-1 ring-border">Sport: {search.sport}</span>}
                {search.age && search.age !== "All" && <span className="rounded-full bg-card px-3 py-1 ring-1 ring-border">Age: {search.age}</span>}
                {search.need && <span className="rounded-full bg-card px-3 py-1 ring-1 ring-border">Need: {NEED_LABELS[search.need].label}</span>}
              </div>
            )}

            {results.length === 0 ? (
              <div className="bg-card ring-1 ring-black/5 rounded-3xl p-6 sm:p-12 text-center">
                <h3 className="text-xl font-bold mb-2">No providers matched your search.</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Try clearing filters, broadening your search terms, or searching a nearby community.
                </p>
                <Link
                  to="/search"
                  search={{ sport: "", age: "All", location: search.location, need: undefined }}
                  className="inline-block px-5 py-2 bg-primary text-primary-foreground font-bold rounded-xl text-sm"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              results.map((p) => <ProviderCard key={p.id} provider={p} />)
            )}
          </div>

          <aside className="w-full lg:w-80 space-y-6 min-w-0">
            <div className="bg-primary p-6 rounded-3xl text-primary-foreground shadow-xl">
              <h3 className="font-bold mb-2">Don't see your provider?</h3>
              <p className="text-sm opacity-80 mb-5">
                We add new local businesses every week. Suggest one and we'll vet it.
              </p>
              <Link
                to="/add-business"
                className="inline-block w-full text-center py-3 bg-white text-primary font-bold rounded-xl text-sm"
              >
                Add or claim a business
              </Link>
            </div>
            <div className="bg-card ring-1 ring-black/5 rounded-3xl p-6">
              <h4 className="font-bold mb-3">Quick start</h4>
              <ul className="space-y-2 text-sm">
                {NEEDS.slice(0, 5).map((n) => (
                  <li key={n}>
                    <Link
                      to="/search"
                      search={{ need: n }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      → {NEED_LABELS[n].label} providers
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
