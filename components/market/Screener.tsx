"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { CapSize, Stock } from "@/lib/types";
import { CapSizeBadge } from "@/components/ui/Badge";
import { formatCompactMarketCap } from "@/lib/format";
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from "@/lib/watchlist";

interface ScreenerProps {
  stocks: Stock[];
}

type SortKey = "symbol" | "ltp" | "marketCap" | "epsTTM";

const CAP_OPTIONS: (CapSize | "All")[] = ["All", "High-cap", "Mid-cap", "Small-cap"];

export function Screener({ stocks }: ScreenerProps) {
  const [query, setQuery] = useState("");
  const [capFilter, setCapFilter] = useState<CapSize | "All">("All");
  const [minMarketCap, setMinMarketCap] = useState("");
  const [minEps, setMinEps] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDesc, setSortDesc] = useState(true);
  const [watchlistVersion, setWatchlistVersion] = useState(0);

  // Pick up ?cap=High-cap style links from the homepage's segment cards.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cap = params.get("cap");
    if (cap === "High-cap" || cap === "Mid-cap" || cap === "Small-cap") {
      setCapFilter(cap);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    const minCap = minMarketCap ? Number(minMarketCap) * 10_000_000 : 0; // input in Crore
    const minEpsNum = minEps ? Number(minEps) : -Infinity;

    let result = stocks.filter((s) => {
      if (q && !s.symbol.includes(q)) return false;
      if (capFilter !== "All" && s.capSize !== capFilter) return false;
      if (s.marketCap < minCap) return false;
      if ((s.epsTTM ?? -Infinity) < minEpsNum) return false;
      return true;
    });

    result = [...result].sort((a, b) => {
      let diff = 0;
      if (sortKey === "symbol") diff = a.symbol.localeCompare(b.symbol);
      else if (sortKey === "ltp") diff = a.ltp - b.ltp;
      else if (sortKey === "marketCap") diff = a.marketCap - b.marketCap;
      else diff = (a.epsTTM ?? -Infinity) - (b.epsTTM ?? -Infinity);
      return sortDesc ? -diff : diff;
    });

    return result;
  }, [stocks, query, capFilter, minMarketCap, minEps, sortKey, sortDesc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDesc((d) => !d);
    else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  function toggleWatchlist(symbol: string) {
    if (isInWatchlist(symbol)) removeFromWatchlist(symbol);
    else addToWatchlist(symbol);
    setWatchlistVersion((v) => v + 1);
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-[10px] border border-border bg-surface p-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Symbol…"
          className="w-32 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
        />
        {CAP_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => setCapFilter(opt)}
            className={`rounded-md border px-2.5 py-1.5 text-xs transition-colors ${
              capFilter === opt
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
        <input
          type="number"
          value={minMarketCap}
          onChange={(e) => setMinMarketCap(e.target.value)}
          placeholder="Min mkt cap (Crore)"
          className="w-36 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
        />
        <input
          type="number"
          value={minEps}
          onChange={(e) => setMinEps(e.target.value)}
          placeholder="Min EPS (TTM)"
          className="w-28 rounded-md border border-border bg-bg px-2.5 py-1.5 text-xs text-foreground outline-none focus:border-primary"
        />
        <span className="ml-auto text-xs text-muted">{filtered.length} results</span>
      </div>

      <div className="mt-3 max-h-[560px] overflow-y-auto rounded-[10px] border border-border">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-surface2">
            <tr>
              <th className="w-8 px-2 py-2"></th>
              {(
                [
                  ["symbol", "Symbol"],
                  ["ltp", "LTP"],
                  ["marketCap", "Market Cap"],
                  ["epsTTM", "EPS (TTM)"],
                ] as [SortKey, string][]
              ).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key)}
                  className="cursor-pointer select-none px-2.5 py-2 text-left text-[9.5px] font-button uppercase tracking-wide text-muted hover:text-foreground"
                >
                  {label} {sortKey === key && (sortDesc ? "▼" : "▲")}
                </th>
              ))}
              <th className="px-2.5 py-2 text-left text-[9.5px] font-button uppercase tracking-wide text-muted">
                Segment
              </th>
            </tr>
          </thead>
          <tbody key={watchlistVersion}>
            {filtered.map((stock) => (
              <tr key={stock.symbol} className="border-b border-surface2 last:border-0 hover:bg-surface2">
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() => toggleWatchlist(stock.symbol)}
                    aria-label={`Toggle ${stock.symbol} in watchlist`}
                    className={isInWatchlist(stock.symbol) ? "text-gold" : "text-muted hover:text-gold"}
                  >
                    {isInWatchlist(stock.symbol) ? "★" : "☆"}
                  </button>
                </td>
                <td className="px-2.5 py-2">
                  <Link href={`/stocks/${stock.symbol}`} className="font-button text-xs text-primary hover:underline">
                    {stock.symbol}
                  </Link>
                </td>
                <td className="px-2.5 py-2 font-mono text-xs text-foreground2">
                  Rs {stock.ltp.toLocaleString("en-IN")}
                </td>
                <td className="px-2.5 py-2 font-mono text-xs text-foreground2">
                  {formatCompactMarketCap(stock.marketCap)}
                </td>
                <td className="px-2.5 py-2 font-mono text-xs text-foreground2">
                  {stock.epsTTM?.toFixed(2) ?? "—"}
                </td>
                <td className="px-2.5 py-2">
                  <CapSizeBadge capSize={stock.capSize} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-xs text-muted">
                  No stocks match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
