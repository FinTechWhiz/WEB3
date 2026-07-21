"use client";

import { useState } from "react";
import Link from "next/link";
import type { Stock } from "@/lib/types";
import { CapSizeBadge } from "@/components/ui/Badge";
import { formatCompactMarketCap, formatPercent } from "@/lib/format";
import { avatarColorFor } from "@/lib/avatarColor";

interface StocksTableProps {
  topByMarketCap: Stock[];
  topByEps: Stock[];
  near52WeekHigh: Stock[];
}

type TabKey = "cap" | "eps" | "high52";

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: "cap", label: "By Market Cap", icon: "🏆" },
  { key: "eps", label: "By TTM Earnings", icon: "💵" },
  { key: "high52", label: "Near 52W High", icon: "📈" },
];

/**
 * The reference design has Gainers/Losers/Most Active tabs, which need
 * live intraday data we don't have. These tabs are real fundamentals
 * rankings instead — labeled for what they actually are, not disguised as
 * price movement.
 */
export function StocksTable({ topByMarketCap, topByEps, near52WeekHigh }: StocksTableProps) {
  const [tab, setTab] = useState<TabKey>("cap");

  const rows =
    tab === "cap" ? topByMarketCap : tab === "eps" ? topByEps : near52WeekHigh;

  return (
    <div>
      <div className="flex rounded-t-[10px] border border-b-0 border-border bg-surface">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`border-b-2 px-3.5 py-2.5 text-xs font-body transition-colors ${
              tab === t.key
                ? "border-primary font-button text-primary"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>
      <div className="max-h-[420px] overflow-y-auto rounded-b-[10px] border border-border">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-surface2">
            <tr>
              <th className="px-2.5 py-2 text-left text-[9.5px] font-button uppercase tracking-wide text-muted">
                Symbol
              </th>
              <th className="px-2.5 py-2 text-left text-[9.5px] font-button uppercase tracking-wide text-muted">
                LTP
              </th>
              <th className="px-2.5 py-2 text-left text-[9.5px] font-button uppercase tracking-wide text-muted">
                {tab === "cap" ? "Market Cap" : tab === "eps" ? "EPS (TTM)" : "From 52W High"}
              </th>
              <th className="px-2.5 py-2 text-left text-[9.5px] font-button uppercase tracking-wide text-muted">
                Segment
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((stock) => (
              <tr key={stock.symbol} className="border-b border-surface2 last:border-0 hover:bg-surface2">
                <td className="px-2.5 py-2">
                  <Link href={`/stocks/${stock.symbol}`} className="flex items-center gap-2">
                    <span
                      className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-[7px] text-[10px] font-heading text-white"
                      style={{ background: avatarColorFor(stock.symbol) }}
                      aria-hidden="true"
                    >
                      {stock.symbol.slice(0, 2)}
                    </span>
                    <span className="font-button text-xs text-primary hover:underline">
                      {stock.symbol}
                    </span>
                  </Link>
                </td>
                <td className="px-2.5 py-2 font-mono text-xs text-foreground2">
                  Rs {stock.ltp.toLocaleString("en-IN")}
                </td>
                <td className="px-2.5 py-2 font-mono text-xs text-foreground2">
                  {tab === "cap" && formatCompactMarketCap(stock.marketCap)}
                  {tab === "eps" && (stock.epsTTM?.toFixed(2) ?? "—")}
                  {tab === "high52" && formatPercent(stock.pctFrom52WeekHigh)}
                </td>
                <td className="px-2.5 py-2">
                  <CapSizeBadge capSize={stock.capSize} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
