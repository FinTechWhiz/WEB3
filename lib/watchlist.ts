const STORAGE_KEY = "nepselens-watchlist";

/**
 * The whole "backend" for the watchlist feature is the browser's own
 * localStorage — genuinely functional (add/remove persists across
 * visits), just scoped to one browser instead of a server-backed account.
 * That's an honest tradeoff, not a fake feature: no login exists, so
 * nothing here pretends otherwise.
 */
function readWatchlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function writeWatchlist(symbols: string[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(symbols));
}

export function getWatchlist(): string[] {
  return readWatchlist();
}

export function isInWatchlist(symbol: string): boolean {
  return readWatchlist().includes(symbol.toUpperCase());
}

export function addToWatchlist(symbol: string): string[] {
  const upper = symbol.toUpperCase();
  const current = readWatchlist();
  if (current.includes(upper)) return current;
  const next = [...current, upper];
  writeWatchlist(next);
  return next;
}

export function removeFromWatchlist(symbol: string): string[] {
  const upper = symbol.toUpperCase();
  const next = readWatchlist().filter((s) => s !== upper);
  writeWatchlist(next);
  return next;
}
