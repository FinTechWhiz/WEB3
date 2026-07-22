"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Stock } from "@/lib/types";
import { getWatchlist } from "@/lib/watchlist";

interface PortfolioWidgetProps {
  stocks: Stock[];
}

/**
 * Real preview of the localStorage-backed watchlist (see lib/watchlist.ts
 * and the full manager at /portfolio). Client-only because localStorage
 * doesn't exist during static-export server rendering.
 */
export function PortfolioWidget({ stocks }: PortfolioWidgetProps) {
  const [symbols, setSymbols] = useState<string[] | null>(null);

  useEffect(() => {
    setSymbols(getWatchlist());
  }, []);

  const watchlistStocks =
    symbols?.map((s) => stocks.find((stock) => stock.symbol === s)).filter(Boolean) ?? [];

  return (
    <div className="overflow-hidden rounded-[13px] border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="text-[13px] font-button text-foreground">Portfolio Overview</div>
        <Link href="/portfolio" className="text-[11px] text-primary hover:underline">
          Manage →
        </Link>
      </div>

      {symbols === null ? (
        <div className="px-5 py-6 text-center text-xs text-muted">Loading…</div>
      ) : watchlistStocks.length === 0 ? (
        <div className="px-5 py-6 text-center">
          <div className="mb-1.5 text-2xl">👁️</div>
          <p className="mb-2.5 text-xs leading-relaxed text-muted">
            No stocks in your watchlist yet.
            <br />
            Saved in this browser — no account needed.
          </p>
          <Link
            href="/portfolio"
            className="inline-flex rounded-lg bg-primary px-4 py-1.5 text-xs font-button text-nav transition-opacity hover:opacity-90"
          >
            Add stocks →
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {watchlistStocks.slice(0, 4).map((stock) => (
            <Link
              key={stock!.symbol}
              href={`/stocks/${stock!.symbol}`}
              className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-surface2"
            >
              <span className="font-button text-xs text-primary">{stock!.symbol}</span>
              <span className="font-mono text-xs text-foreground2">
                Rs {stock!.ltp.toLocaleString("en-IN")}
              </span>
            </Link>
          ))}
          {watchlistStocks.length > 4 && (
            <Link
              href="/portfolio"
              className="block px-4 py-2 text-center text-[11px] text-primary hover:underline"
            >
              +{watchlistStocks.length - 4} more →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
