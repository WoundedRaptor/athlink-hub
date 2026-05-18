import { Link } from "@tanstack/react-router";
import { useSaved } from "@/hooks/use-saved";

export function SiteHeader() {
  const { ids } = useSaved();
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-extrabold text-xl tracking-tighter uppercase">
            AthLink<span className="text-primary">Hub</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link
              to="/search"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              Find Training
            </Link>
            <Link
              to="/search"
              search={{ need: "camps" }}
              className="hover:text-foreground transition-colors"
            >
              Camps &amp; Clinics
            </Link>
            <Link
              to="/saved"
              className="hover:text-foreground transition-colors"
              activeProps={{ className: "text-foreground" }}
            >
              Saved {ids.length > 0 && <span className="text-foreground">({ids.length})</span>}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="text-sm font-medium px-4 py-2 hover:bg-black/5 rounded-full transition-colors hidden sm:inline-block"
          >
            Admin Portal
          </Link>
          <Link
            to="/add-business"
            className="bg-primary text-primary-foreground text-sm font-bold px-5 py-2 rounded-full hover:bg-primary/90 transition-colors"
          >
            Add Business
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="px-6 py-20 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <span className="font-extrabold text-xl tracking-tighter uppercase mb-4 block">
            AthLink<span className="text-primary">Hub</span>
          </span>
          <p className="text-sm text-muted-foreground">
            Connecting the modern parent with high-performance resources for the youth athletes
            of tomorrow.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Search
            </h5>
            <ul className="text-sm space-y-2 font-medium">
              <li><Link to="/search" className="hover:underline">By Sport</Link></li>
              <li><Link to="/search" className="hover:underline">By Location</Link></li>
              <li><Link to="/search" className="hover:underline">By Age Group</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Company
            </h5>
            <ul className="text-sm space-y-2 font-medium">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Business
            </h5>
            <ul className="text-sm space-y-2 font-medium">
              <li><Link to="/add-business" className="hover:underline">Add Business</Link></li>
              <li><Link to="/admin" className="hover:underline">Admin Portal</Link></li>
              <li><a href="#" className="hover:underline">Contact Support</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border flex justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <span>© 2026 AthLink Hub</span>
        <span>Built for performance</span>
      </div>
    </footer>
  );
}
