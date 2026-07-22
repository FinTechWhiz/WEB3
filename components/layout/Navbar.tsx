"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Stock } from "@/lib/types";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavbarProps {
  stocks: Stock[];
}

const NAV_LINKS = [
  { label: "Screener", href: "/screener" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "News", href: "/news" },
  { label: "Data Sources", href: "/data-sources" },
];

/**
 * Client component: the search box filters the already-loaded stock list
 * in-memory — fine for ~280 symbols. Sticky below TickerBar (top-8 = the
 * ticker's own height), matching the reference design's stacked sticky bars.
 */
export function Navbar({ stocks }: NavbarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return [];
    return stocks.filter((s) => s.symbol.includes(q)).slice(0, 8);
  }, [query, stocks]);

  return (
    <header className="sticky top-8 z-40 flex h-14 items-center gap-3.5 border-b border-border bg-nav px-3 sm:px-5">
      <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border-[1.5px] border-gold bg-gradient-to-br from-[#1a2e50] to-[#0a1a30] text-lg font-heading text-gold"
          aria-hidden="true"
        >
          N
        </span>
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="bg-gradient-to-r from-gold via-gold2 to-primary bg-clip-text text-sm font-heading tracking-wide text-transparent">
            NEPSELENS
          </span>
          <span className="text-[8.5px] uppercase tracking-widest text-muted">
            NEPSE Analytics Platform
          </span>
        </span>
      </Link>

      <div className="relative max-w-[340px] flex-1">
        <label htmlFor="stock-search" className="sr-only">
          Search stocks by symbol
        </label>
        <span
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[13px] text-muted"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          id="stock-search"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 120)}
          placeholder="Search symbol…"
          className="w-full rounded-lg border border-border bg-bg py-1.5 pl-8 pr-3 font-sans text-xs text-foreground outline-none transition-colors focus:border-primary"
        />
        {isOpen && results.length > 0 && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 max-h-72 overflow-y-auto rounded-[10px] border border-border bg-surface shadow-card-hover"
          >
            {results.map((stock) => (
              <li key={stock.symbol} className="border-b border-border last:border-0">
                <Link
                  href={`/stocks/${stock.symbol}`}
                  className="flex items-center justify-between gap-2.5 px-3.5 py-2 text-xs transition-colors hover:bg-surface2"
                >
                  <span className="font-button text-primary">{stock.symbol}</span>
                  <span className="font-mono text-foreground2">
                    Rs {stock.ltp.toLocaleString("en-IN")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <span className="hidden flex-shrink-0 whitespace-nowrap rounded-[4px] bg-cyan2 px-2.5 py-0.5 font-mono text-[11px] text-cyan md:inline">
        {stocks.length} stocks
      </span>

      <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Main">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap rounded-[7px] px-2.5 py-1.5 text-xs font-body text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/portfolio"
          className="ml-1 whitespace-nowrap rounded-[7px] bg-primary px-3 py-1.5 text-xs font-button text-nav transition-opacity hover:opacity-90"
        >
          ★ Watchlist
        </Link>
      </nav>

      <ThemeToggle />
    </header>
  );
}
