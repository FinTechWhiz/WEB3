/**
 * Server-only config. Deliberately NOT prefixed with NEXT_PUBLIC_ — this
 * fetch happens inside server components (see lib/stocks.ts), so the URL
 * never needs to reach the browser bundle. Keeping it server-only also
 * means a private backend hostname doesn't leak into client JS.
 */
export const API_BASE_URL = process.env.API_BASE_URL ?? null;
