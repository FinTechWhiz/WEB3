import Link from "next/link";
import type { CapSize } from "@/lib/types";
import { formatCompactMarketCap } from "@/lib/format";

interface MarketSegmentsProps {
  byCapSize: Record<CapSize, number>;
  marketCapByCapSize: Record<CapSize, number>;
  totalMarketCap: number;
}

const SEGMENTS: { key: CapSize; label: string; icon: string }[] = [
  { key: "High-cap", label: "High-cap", icon: "🏛️" },
  { key: "Mid-cap", label: "Mid-cap", icon: "🏢" },
  { key: "Small-cap", label: "Small-cap", icon: "🏬" },
];

/**
 * The reference design groups stocks by NEPSE sector (Commercial Banks,
 * Hydropower, etc.) with a live % change per sector. We don't have
 * per-stock sector mapping yet (taxonomy is seeded in the backend, but
 * unmapped — see PROJECT.md), so this groups by cap-size instead, which
 * is real and complete for all 280 stocks. The percentage shown is each
 * segment's real share of total market cap — not a price change — so it's
 * shown in neutral gold, not green/red, to avoid implying movement.
 */
export function MarketSegments({
  byCapSize,
  marketCapByCapSize,
  totalMarketCap,
}: MarketSegmentsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {SEGMENTS.map((segment) => {
        const share =
          totalMarketCap > 0
            ? (marketCapByCapSize[segment.key] / totalMarketCap) * 100
            : 0;
        return (
          <Link
            key={segment.key}
            href={`/screener?cap=${segment.key}`}
            className="rounded-[10px] border border-border bg-surface p-3 transition-all hover:-translate-y-0.5 hover:border-border2 hover:bg-surface2 hover:shadow-card-hover"
          >
            <div className="mb-1 text-base">{segment.icon}</div>
            <div className="mb-0.5 truncate text-[11px] font-button text-foreground2">
              {segment.label}
            </div>
            <div className="mb-1.5 text-[9.5px] text-muted">
              {byCapSize[segment.key]} stocks
            </div>
            <div className="text-[11.5px] font-button text-gold">
              {share.toFixed(1)}% of market cap
            </div>
            <div className="mt-1 text-[9px] text-muted">
              {formatCompactMarketCap(marketCapByCapSize[segment.key])}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
