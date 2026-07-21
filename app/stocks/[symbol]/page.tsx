import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { CapSizeBadge } from "@/components/ui/Badge";
import { getAllStocks, getStockBySymbol } from "@/lib/stocks";
import { formatCompactMarketCap, formatNPR, formatPercent } from "@/lib/format";

interface StockPageProps {
  params: Promise<{ symbol: string }>;
}

/**
 * Static export (output: "export" in next.config.ts) requires every
 * dynamic route to be enumerable at build time — there's no server to
 * render new ones on demand. This generates one static page per real
 * symbol in the dataset (280 today), so nothing here is templated
 * against fake/example data.
 */
export async function generateStaticParams() {
  const stocks = await getAllStocks();
  return stocks.map((stock) => ({ symbol: stock.symbol }));
}

export async function generateMetadata({
  params,
}: StockPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const stock = await getStockBySymbol(symbol);
  if (!stock) return { title: "Stock not found — NepseLens" };
  return { title: `${stock.symbol} — NepseLens` };
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border last:border-0">
      <td className="py-2 text-sm font-body text-muted">{label}</td>
      <td className="py-2 text-right text-sm font-button text-foreground">
        {value}
      </td>
    </tr>
  );
}

export default async function StockDetailPage({ params }: StockPageProps) {
  const { symbol } = await params;
  const stock = await getStockBySymbol(symbol);

  if (!stock) {
    notFound();
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-heading text-foreground">{stock.symbol}</h1>
            <p className="mt-1 text-lg font-body text-muted">{formatNPR(stock.ltp)}</p>
          </div>
          <CapSizeBadge capSize={stock.capSize} />
        </div>

        <div className="mt-8 rounded-card border border-border bg-surface p-6 shadow-card">
          <h2 className="mb-2 text-sm font-button uppercase tracking-wide text-muted">
            Valuation
          </h2>
          <table className="w-full">
            <tbody>
              <StatRow label="Market capitalization" value={formatCompactMarketCap(stock.marketCap)} />
              <StatRow label="Paid-up capital" value={formatCompactMarketCap(stock.paidUpCapital)} />
              <StatRow
                label="Total float"
                value={stock.totalFloat !== null ? `${(stock.totalFloat * 100).toFixed(2)}%` : "—"}
              />
              <StatRow label="Book value per share" value={formatNPR(stock.bookValuePerShare)} />
              <StatRow label="Asset per share" value={formatNPR(stock.assetPerShare)} />
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-card">
          <h2 className="mb-2 text-sm font-button uppercase tracking-wide text-muted">
            Earnings
          </h2>
          <table className="w-full">
            <tbody>
              <StatRow label="EPS (reported)" value={stock.epsReported?.toFixed(2) ?? "—"} />
              <StatRow label="EPS (TTM)" value={stock.epsTTM?.toFixed(2) ?? "—"} />
              <StatRow label="Sales per share (TTM)" value={stock.salesPerShareTTM?.toFixed(2) ?? "—"} />
              <StatRow label="Expected DPS" value={stock.expectedDPS?.toFixed(2) ?? "—"} />
              <StatRow
                label="Payout ratio"
                value={stock.payoutRatio !== null ? `${(stock.payoutRatio * 100).toFixed(2)}%` : "—"}
              />
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-card">
          <h2 className="mb-2 text-sm font-button uppercase tracking-wide text-muted">
            52-week range
          </h2>
          <table className="w-full">
            <tbody>
              <StatRow label="52-week high" value={stock.week52High !== null ? formatNPR(stock.week52High) : "—"} />
              <StatRow label="52-week low" value={stock.week52Low !== null ? formatNPR(stock.week52Low) : "—"} />
              <StatRow label="Distance from 52-week high" value={formatPercent(stock.pctFrom52WeekHigh)} />
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-xs font-body text-muted">
          Fundamentals snapshot, not live pricing. See{" "}
          <Link href="/data-sources" className="text-primary hover:underline">
            data sources
          </Link>{" "}
          for details.
        </p>
      </div>
    </PageShell>
  );
}
