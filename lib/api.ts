import type { CapSize, Stock } from "./types";
import { API_BASE_URL } from "./config";

/** Mirrors backend/app/schemas.py::StockOut exactly — snake_case, as the API sends it. */
interface ApiStockOut {
  id: number;
  symbol: string;
  company_name: string;
  sector: string | null;
  ltp: number | null;
  market_cap: number | null;
  paid_up_capital: number | null;
  total_float: number | null;
  cap_size: string | null;
  asset_per_share: number | null;
  book_value_per_share: number | null;
  eps_reported: number | null;
  eps_ttm: number | null;
  sales_per_share_ttm: number | null;
  expected_dps: number | null;
  payout_ratio: number | null;
  week_52_high: number | null;
  week_52_low: number | null;
  updated_at: string;
}

interface ApiStockListResponse {
  items: ApiStockOut[];
  total: number;
  page: number;
  page_size: number;
}

function toCapSize(value: string | null): CapSize {
  if (value === "Small-cap" || value === "Mid-cap" || value === "High-cap") {
    return value;
  }
  return "Unclassified";
}

/** Maps one API record to the frontend's Stock shape, deriving pctFrom52WeekHigh
 *  the same way the original data pipeline did (see data pipeline notes in
 *  PROJECT.md) so leaderboards behave identically regardless of data source. */
function mapApiStockToStock(api: ApiStockOut): Stock {
  const pctFrom52WeekHigh =
    api.ltp !== null && api.week_52_high
      ? Math.round(((api.ltp - api.week_52_high) / api.week_52_high) * 10000) / 100
      : null;

  return {
    symbol: api.symbol,
    ltp: api.ltp ?? 0,
    marketCap: api.market_cap ?? 0,
    paidUpCapital: api.paid_up_capital ?? 0,
    totalFloat: api.total_float,
    capSize: toCapSize(api.cap_size),
    assetPerShare: api.asset_per_share ?? 0,
    bookValuePerShare: api.book_value_per_share ?? 0,
    epsReported: api.eps_reported,
    epsTTM: api.eps_ttm,
    salesPerShareTTM: api.sales_per_share_ttm,
    expectedDPS: api.expected_dps,
    payoutRatio: api.payout_ratio,
    week52High: api.week_52_high,
    week52Low: api.week_52_low,
    pctFrom52WeekHigh,
    sector: api.sector ?? undefined,
  };
}

/**
 * Fetches every stock from the backend, paging through the API's max
 * page_size (100) until all rows are collected. Throws on any failure —
 * callers decide whether to fall back (see lib/stocks.ts).
 *
 * NOTE on call frequency: app/page.tsx calls getAllStocks() (which calls
 * this) five separate times across the leaderboard/summary functions.
 * That's intentional and safe, not a bug — Next.js's App Router
 * automatically memoizes identical `fetch()` calls (same URL + options)
 * for the lifetime of a single render pass, so these collapse into one
 * real network round-trip per page. This relies on using the built-in
 * `fetch`, not axios or another client — don't swap it without adding
 * your own request-level caching.
 */
export async function fetchAllStocksFromApi(): Promise<Stock[]> {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  const pageSize = 100;
  let page = 1;
  const all: Stock[] = [];

  while (true) {
    const url = `${API_BASE_URL}/api/v1/stocks?page=${page}&page_size=${pageSize}`;
    // Fundamentals change infrequently (no live feed yet), so a 1-hour
    // revalidation window is safe and keeps this fast. Tighten once
    // price_history / a live feed makes the data time-sensitive.
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      throw new Error(`Stocks API returned ${res.status} for ${url}`);
    }

    const body: ApiStockListResponse = await res.json();
    all.push(...body.items.map(mapApiStockToStock));

    if (all.length >= body.total || body.items.length < pageSize) break;
    page += 1;
  }

  return all;
}
