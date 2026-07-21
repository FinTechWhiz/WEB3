/**
 * Smoke test for the data layer — runs against real data/stocks.json with
 * zero build step (via tsx), so it works even before `npm install` pulls
 * in Next.js/React. Run with: npm run verify
 *
 * This exists because a real bug was caught this way during development:
 * formatNPR/StockCard were using the "ne-NP" locale, which renders digits
 * in Devanagari numerals (e.g. "४,१६२") — inconsistent with the rest of
 * the UI. This script would have caught it immediately. Extend it whenever
 * you add a new lib/ function that shapes user-facing data.
 */
import {
  getAllStocks,
  getMarketSummary,
  getTopByMarketCap,
  getTopByEpsTTM,
  getNear52WeekHigh,
  searchStocks,
  getStockBySymbol,
} from "../lib/stocks";
import { formatNPR, formatCompactMarketCap, formatPercent, formatNumber } from "../lib/format";

let failures = 0;

function check(label: string, condition: boolean) {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    console.error(`  FAIL ${label}`);
    failures += 1;
  }
}

// Guards against Devanagari-numeral regressions like the one this script
// was written to catch — any non-ASCII digit here is a locale bug.
function hasOnlyLatinDigits(s: string): boolean {
  return !/[०-९]/.test(s);
}

async function main() {
  console.log("Data layer:");
  const stocks = await getAllStocks();
  check("loads all 280 stocks", stocks.length === 280);

  const summary = await getMarketSummary();
  check("market summary totals match stock count", summary.totalListed === stocks.length);
  check(
    "cap-size buckets sum to total",
    summary.byCapSize["Small-cap"] +
      summary.byCapSize["Mid-cap"] +
      summary.byCapSize["High-cap"] +
      summary.byCapSize["Unclassified"] ===
      stocks.length
  );

  const topCap = await getTopByMarketCap(3);
  check("top-by-market-cap returned 3 results", topCap.length === 3);
  const [firstCap, secondCap, thirdCap] = topCap;
  check(
    "top-by-market-cap is actually sorted descending",
    firstCap !== undefined &&
      secondCap !== undefined &&
      thirdCap !== undefined &&
      firstCap.marketCap >= secondCap.marketCap &&
      secondCap.marketCap >= thirdCap.marketCap
  );

  const topEps = await getTopByEpsTTM(3);
  check("top-by-EPS excludes nulls", topEps.every((s) => s.epsTTM !== null));

  const near52 = await getNear52WeekHigh(3);
  check("52-week-high leaders are all <= 0% (can't exceed their own high)", near52.every((s) => (s.pctFrom52WeekHigh ?? -1) <= 0.01));

  const nabil = await getStockBySymbol("nabil");
  check("case-insensitive symbol lookup works", nabil?.symbol === "NABIL");

  const search = await searchStocks("nab");
  check("search finds NABIL", search.some((s) => s.symbol === "NABIL"));

  console.log("\nFormatting (Devanagari-digit regression guard):");
  check("formatNPR uses Latin digits", hasOnlyLatinDigits(formatNPR(521.9)));
  check("formatCompactMarketCap uses Latin digits", hasOnlyLatinDigits(formatCompactMarketCap(166896200000)));
  check("formatNumber uses Latin digits", hasOnlyLatinDigits(formatNumber(280)));
  check("formatPercent handles null", formatPercent(null) === "—");
  check("formatPercent signs positives", formatPercent(3.2).startsWith("+"));

  console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) failed.`}`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error("Smoke test crashed:", err);
  process.exit(1);
});
