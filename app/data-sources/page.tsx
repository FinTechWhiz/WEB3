import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Data Sources — NepseLens" };

export default function DataSourcesPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-heading text-foreground sm:text-3xl">
          Where this data comes from
        </h1>

        <div className="mt-8 space-y-6">
          <div>
            <h2 className="text-sm font-button uppercase tracking-wide text-primary">
              Fundamentals (what you see today)
            </h2>
            <p className="mt-2 text-sm font-body leading-relaxed text-muted">
              Market cap, LTP, EPS, book value, 52-week range, and related
              figures for all 280 NEPSE-listed companies come from a
              fundamentals snapshot supplied directly to this project and
              imported through <code>backend/scripts/seed_stocks.py</code>.
              These figures are point-in-time, not live/intraday.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-button uppercase tracking-wide text-primary">
              What&apos;s intentionally not shown yet
            </h2>
            <p className="mt-2 text-sm font-body leading-relaxed text-muted">
              Daily price change, gainers/losers rankings, sector-level
              heatmaps, and market news are not shown because no live NEPSE
              data feed or licensed news source is connected yet. Nepal
              Stock Exchange does not offer a public live-data API, so this
              requires either a broker/vendor data agreement or a
              self-run collector operated within NEPSE&apos;s terms of use.
              Rather than estimate or simulate these numbers, this site
              simply doesn&apos;t show them until a real source is in place.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-button uppercase tracking-wide text-primary">
              Sector classification
            </h2>
            <p className="mt-2 text-sm font-body leading-relaxed text-muted">
              The 13 real NEPSE sector categories are seeded
              (<code>backend/scripts/seed_sectors.py</code>), but individual
              stocks are not yet mapped to a sector — that mapping needs a
              verified symbol-to-sector source before it&apos;s published
              here.
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
