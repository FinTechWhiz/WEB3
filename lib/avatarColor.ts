// A small fixed palette (not random per-render, so server/client markup
// matches) picked by a simple hash of the symbol — purely cosmetic, no
// meaning attached to which color a stock gets.
const PALETTE = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#a78bfa",
  "#ef4444",
  "#06b6d4",
  "#d4a843",
  "#84cc16",
];

export function avatarColorFor(symbol: string): string {
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = (hash * 31 + symbol.charCodeAt(i)) >>> 0;
  }
  // Non-null assertion is safe: PALETTE is a fixed, non-empty literal, and
  // the modulo guarantees an in-range index. noUncheckedIndexedAccess
  // can't know that statically, so it flags this without the assertion.
  return PALETTE[hash % PALETTE.length] ?? PALETTE[0]!;
}
