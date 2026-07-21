import Link from "next/link";

/**
 * Real empty state, not a fabricated portfolio — accounts/watchlists exist
 * as a working backend (backend/app/routers/watchlists.py) but aren't
 * connected to this frontend yet, so there's genuinely nothing to show.
 */
export function PortfolioWidget() {
  return (
    <div className="overflow-hidden rounded-[13px] border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="text-[13px] font-button text-foreground">Portfolio Overview</div>
      </div>
      <div className="px-5 py-6 text-center">
        <div className="mb-1.5 text-2xl">💼</div>
        <p className="mb-2.5 text-xs leading-relaxed text-muted">
          Sign in and add holdings to see them here.
          <br />
          The account system is built — just not wired into this page yet.
        </p>
        <Link
          href="/signup"
          className="inline-flex rounded-lg bg-primary px-4 py-1.5 text-xs font-button text-nav transition-opacity hover:opacity-90"
        >
          Sign Up →
        </Link>
      </div>
    </div>
  );
}
