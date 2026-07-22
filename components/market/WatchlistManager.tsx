"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Stock } from "@/lib/types";
import { CapSizeBadge } from "@/components/ui/Badge";
import { formatCompactMarketCap } from "@/lib/format";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "@/lib/watchlist";

interface WatchlistManagerProps {
  stocks: Stock[];
}

export function WatchlistManager({ stocks }: WatchlistManagerProps) {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Read localStorage only after mount — it doesn't exist during server
  // rendering, so reading it during render would mismatch the static
  // export's pre-rendered HTML.
  useEffect(() => {
    setSymbols(getWatchlist());
    setLoaded(true);
  }, []);

  const watchlistStocks = useMemo(
    () => stocks.filter((s) => symbols.includes(s.symbol)),
    [stocks, symbols]
  );

  const searchResults = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    return stocks
      .filter((s) => s.symbol.includes(q) && !symbols.includes(s.symbol))
      .slice(0, 6);
  }, [query, stocks, symbols]);

  function handleAdd(symbol: string) {
    setSymbols(addToWatchlist(symbol));
    setQuery("");
  }

  function handleRemove(symbol: string) {
    setSymbols(removeFromWatchlist(symbol));
  }

  if (!loaded) {
    return <div className="text-sm text-muted">Loading your watchlist…</div>;
  }

  return (
    <div>
      <div className="relative max-w-sm">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol to add…"
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
        {searchResults.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-[10px] border border-border bg-surface shadow-card-hover">
            {searchResults.map((stock) => (
              <li key={stock.symbol}>
                <button
                  onClick={() => handleAdd(stock.symbol)}
                  className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-surface2"
                >
                  <span className="font-button text-primary">{stock.symbol}</span>
                  <span className="text-muted">Rs {stock.ltp.toLocaleString("en-IN")}</span>
                  <span className="text-accent">+ Add</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {watchlistStocks.length === 0 ? (
        <div className="mt-6 rounded-[10px] border border-dashed border-border bg-surface p-8 text-center">
          <div className="mb-2 text-2xl">👁️</div>
          <p className="text-xs text-muted">
            Your watchlist is empty. Search above to add stocks — saved right
            in this browser, no account needed.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {watchlistStocks.map((stock) => (
            <div
              key={stock.symbol}
              className="rounded-[10px] border border-border bg-surface p-3.5"
            >
              <div className="flex items-start justify-between">
                <Link href={`/stocks/${stock.symbol}`} className="min-w-0">
                  <p className="font-button text-sm text-primary hover:underline">
                    {stock.symbol}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Rs {stock.ltp.toLocaleString("en-IN")}
                  </p>
                </Link>
                <button
                  onClick={() => handleRemove(stock.symbol)}
                  aria-label={`Remove ${stock.symbol} from watchlist`}
                  className="flex-shrink-0 rounded-md px-1.5 py-0.5 text-xs text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                >
                  ✕
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-muted">
                  {formatCompactMarketCap(stock.marketCap)}
                </span>
                <CapSizeBadge capSize={stock.capSize} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
