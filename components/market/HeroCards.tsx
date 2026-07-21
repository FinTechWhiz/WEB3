import Link from "next/link";
import { formatCompactMarketCap, formatNumber } from "@/lib/format";
import type { CapSize } from "@/lib/types";

interface HeroCardsProps {
  totalListed: number;
  totalMarketCap: number;
  byCapSize: Record<CapSize, number>;
}

/**
 * The reference design's hero row shows a live NEPSE index card, a Fear &
 * Greed meter, and a live market-status clock. We don't have a live index
 * feed, price-momentum history for a real Fear & Greed score, or full
 * confidence in NEPSE's current exact session hours (sources disagreed
 * when checked — see conversation), so faking any of those would be worse
 * than not showing them. These four cards show only things we can compute
 * exactly from the real dataset.
 */
export function HeroCards({ totalListed, totalMarketCap, byCapSize }: HeroCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-1.5 p-3 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
      <Link
        href="/screener"
        className="group relative overflow-hidden rounded-[10px] border border-border bg-surface px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:border-border2 hover:shadow-card-hover"
      >
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary to-purple" />
        <div className="mb-0.5 text-[9px] uppercase tracking-wide text-muted">
          📈 Listed Companies
        </div>
        <div className="font-mono text-base font-heading leading-none text-primary">
          {formatNumber(totalListed)}
        </div>
        <div className="mt-1 text-[10px] text-muted">across NEPSE, all segments</div>
      </Link>

      <div className="relative overflow-hidden rounded-[10px] border border-border bg-surface px-3 py-2.5">
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-accent to-[#16a34a]" />
        <div className="mb-0.5 text-[9px] uppercase tracking-wide text-muted">
          💰 Total Market Cap
        </div>
        <div className="font-mono text-base font-heading leading-none text-accent">
          {formatCompactMarketCap(totalMarketCap)}
        </div>
        <div className="mt-1 text-[10px] text-muted">fundamentals snapshot</div>
      </div>

      <Link
        href="/data-sources"
        className="relative flex flex-col justify-center overflow-hidden rounded-[10px] border border-border bg-surface px-3.5 py-2.5 transition-colors hover:border-border2 sm:col-span-2 lg:col-span-1"
      >
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-warning to-danger" />
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wide text-muted">
            ℹ️ About this data
          </span>
        </div>
        <p className="text-[11px] leading-snug text-foreground2">
          Fundamentals only — no live price feed connected yet.{" "}
          <span className="text-primary">See sources →</span>
        </p>
      </Link>

      <div className="relative overflow-hidden rounded-[10px] border border-border bg-surface px-3.5 py-2.5">
        <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-purple to-gold" />
        <div className="mb-1.5 text-[9px] uppercase tracking-wide text-muted">
          🏦 Market Composition
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-primary">{byCapSize["High-cap"]} High</span>
          <span className="text-accent">{byCapSize["Mid-cap"]} Mid</span>
          <span className="text-muted">{byCapSize["Small-cap"]} Small</span>
        </div>
      </div>
    </div>
  );
}
