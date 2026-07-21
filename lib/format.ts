/**
 * Formatting helpers tuned for Nepali financial data: NPR currency and the
 * Indian/Nepali numbering convention (lakh/crore-style grouping reads
 * naturally to NEPSE users).
 *
 * Locale choice matters here: "ne-NP" gives correct lakh/crore grouping but
 * renders digits in Devanagari numerals (e.g. "४,१६२") by default in
 * Node/browser ICU data, which looks broken next to the "Rs"-prefixed
 * Latin-digit numbers used elsewhere in this UI (see formatCompactMarketCap
 * and StockCard.tsx). "en-IN" gives the same grouping convention with
 * Latin digits, so we use that instead. Verified against real values from
 * data/stocks.json — see PROJECT.md changelog.
 */

const NPR_LOCALE = "en-IN";

export function formatNPR(value: number): string {
  // Manual "Rs" prefix (not Intl's currency symbol) to match the prefix
  // style used throughout the rest of the UI, e.g. formatCompactMarketCap.
  const formatted = new Intl.NumberFormat(NPR_LOCALE, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value);
  return `Rs ${formatted}`;
}

/** Compact large figures, e.g. market cap: 43202667651 -> "Rs 432.03 Arba" */
export function formatCompactMarketCap(value: number): string {
  const arba = 1_000_000_000; // 1 Arba = 100 crore = 1B
  const crore = 10_000_000;
  const lakh = 100_000;

  if (value >= arba) return `Rs ${(value / arba).toFixed(2)} Arba`;
  if (value >= crore) return `Rs ${(value / crore).toFixed(2)} Crore`;
  if (value >= lakh) return `Rs ${(value / lakh).toFixed(2)} Lakh`;
  return formatNPR(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat(NPR_LOCALE).format(value);
}
