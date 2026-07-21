import type { CapSize, Stock } from "./types";
import rawStocks from "@/data/stocks.json";
import { fetchAllStocksFromApi } from "./api";
import { API_BASE_URL } from "./config";

/**
 * Single source of truth for stock data.
 *
 * Prefers the live backend (backend/app/routers/stocks.py) when
 * API_BASE_URL is configured; falls back to the static fundamentals
 * snapshot in data/stocks.json otherwise (no backend deployed yet, or the
 * backend is temporarily unreachable). The fallback is real data — the
 * same 280-row snapshot the API is seeded from — never fabricated values,
 * so the site degrades gracefully instead of breaking or lying.
 */
export async function getAllStocks(): Promise<Stock[]> {
  if (!API_BASE_URL) {
    return rawStocks as Stock[];
  }

  try {
    return await fetchAllStocksFromApi();
  } catch (error) {
    console.error(
      "Failed to fetch stocks from API, falling back to static snapshot:",
      error
    );
    return rawStocks as Stock[];
  }
}

export async function getStockBySymbol(symbol: string): Promise<Stock | undefined> {
  const stocks = await getAllStocks();
  return stocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
}

export async function getMarketSummary() {
  const stocks = await getAllStocks();
  const totalMarketCap = stocks.reduce((sum, s) => sum + s.marketCap, 0);
  const byCapSize = stocks.reduce<Record<CapSize, number>>(
    (acc, s) => {
      acc[s.capSize] = (acc[s.capSize] ?? 0) + 1;
      return acc;
    },
    { "Small-cap": 0, "Mid-cap": 0, "High-cap": 0, Unclassified: 0 }
  );
  const marketCapByCapSize = stocks.reduce<Record<CapSize, number>>(
    (acc, s) => {
      acc[s.capSize] = (acc[s.capSize] ?? 0) + s.marketCap;
      return acc;
    },
    { "Small-cap": 0, "Mid-cap": 0, "High-cap": 0, Unclassified: 0 }
  );

  return {
    totalListed: stocks.length,
    totalMarketCap,
    byCapSize,
    marketCapByCapSize,
  };
}

/**
 * Fundamentals-based leaderboards. These are the honest substitute for
 * "Top Gainers / Top Losers" on the landing page until a live intraday
 * price feed is connected (see PROJECT.md). Every number here is a real,
 * derivable fact from the source data — nothing is simulated.
 */
export async function getTopByMarketCap(limit = 6): Promise<Stock[]> {
  const stocks = await getAllStocks();
  return [...stocks].sort((a, b) => b.marketCap - a.marketCap).slice(0, limit);
}

export async function getTopByEpsTTM(limit = 6): Promise<Stock[]> {
  const stocks = await getAllStocks();
  return [...stocks]
    .filter((s) => s.epsTTM !== null)
    .sort((a, b) => (b.epsTTM ?? 0) - (a.epsTTM ?? 0))
    .slice(0, limit);
}

/** Stocks currently trading closest to their 52-week high (momentum proxy). */
export async function getNear52WeekHigh(limit = 6): Promise<Stock[]> {
  const stocks = await getAllStocks();
  return [...stocks]
    .filter((s) => s.pctFrom52WeekHigh !== null)
    .sort(
      (a, b) => (b.pctFrom52WeekHigh ?? -100) - (a.pctFrom52WeekHigh ?? -100)
    )
    .slice(0, limit);
}

export async function searchStocks(query: string): Promise<Stock[]> {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  const stocks = await getAllStocks();
  return stocks.filter((s) => s.symbol.toUpperCase().includes(q));
}
