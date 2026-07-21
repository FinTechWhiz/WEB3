import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TickerBar } from "@/components/market/TickerBar";
import { getAllStocks } from "@/lib/stocks";

/**
 * Shared chrome for every non-landing page. Fetches stocks once (same
 * fetch-memoization note as app/page.tsx applies) so the navbar search
 * and ticker work consistently across the whole site, not just "/".
 */
export async function PageShell({ children }: { children: React.ReactNode }) {
  const stocks = await getAllStocks();

  return (
    <div className="flex min-h-screen flex-col">
      <TickerBar stocks={stocks} />
      <Navbar stocks={stocks} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
