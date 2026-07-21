import type { Stock } from "@/lib/types";

interface TickerBarProps {
  stocks: Stock[];
}

/**
 * The reference design's ticker shows live change% with up/down arrows.
 * We don't have live price-change data (see PROJECT.md), so this shows
 * symbol + LTP only — real numbers, no fabricated direction/percentage.
 * Duplicated once so the CSS animation can loop seamlessly.
 */
export function TickerBar({ stocks }: TickerBarProps) {
  // A rotating sample keeps the marquee a reasonable length; using all 280
  // would make one loop very long. Deterministic slice (not random) so
  // server and client render the same markup.
  const sample = stocks.slice(0, 40);
  const items = [...sample, ...sample];

  return (
    <div className="sticky top-0 z-50 flex h-8 items-center overflow-hidden border-b border-border bg-nav">
      <div className="flex h-full flex-shrink-0 items-center whitespace-nowrap border-r border-border px-3 text-[9px] font-button uppercase tracking-wide text-gold">
        ⬡ Fundamentals
      </div>
      <div className="h-full flex-1 overflow-hidden">
        <div
          className="flex h-full w-max animate-[ticker-scroll_90s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]"
        >
          {items.map((stock, i) => (
            <div
              key={`${stock.symbol}-${i}`}
              className="flex h-full items-center gap-1.5 border-r border-border px-3.5 font-mono text-[11px]"
            >
              <span className="font-button text-[10.5px] text-muted">
                {stock.symbol}
              </span>
              <span className="text-foreground2">
                Rs {stock.ltp.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
