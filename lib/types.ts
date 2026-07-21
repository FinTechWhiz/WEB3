/**
 * Domain types for the NEPSE analytics platform.
 *
 * These mirror the columns available in the source fundamentals workbook.
 * Fields that require a live market feed (change%, sector, OHLC) are
 * intentionally typed as optional/nullable rather than given fake defaults —
 * see PROJECT.md "Open Decisions" for the data-sourcing plan.
 */

export type CapSize = "Small-cap" | "Mid-cap" | "High-cap" | "Unclassified";

export interface Stock {
  symbol: string;
  ltp: number;
  marketCap: number;
  paidUpCapital: number;
  totalFloat: number | null;
  capSize: CapSize;
  assetPerShare: number;
  bookValuePerShare: number;
  epsReported: number | null;
  epsTTM: number | null;
  salesPerShareTTM: number | null;
  expectedDPS: number | null;
  payoutRatio: number | null;
  week52High: number | null;
  week52Low: number | null;
  /** Derived: how far LTP sits below its 52-week high, in percent (negative = below high). */
  pctFrom52WeekHigh: number | null;

  // --- Fields reserved for a future live-data integration. Left undefined
  // rather than 0/null-with-meaning so the UI can distinguish "no live feed
  // connected yet" from "flat/zero movement". ---
  changePercentToday?: number;
  sector?: string;
}

export interface MarketIndex {
  name: string;
  value: number;
  /** Same caveat as Stock.changePercentToday — requires a live feed. */
  changePercent?: number;
}
