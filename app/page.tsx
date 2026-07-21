import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TickerBar } from "@/components/market/TickerBar";
import { HeroCards } from "@/components/market/HeroCards";
import { MarketSegments } from "@/components/market/MarketSegments";
import { PortfolioWidget } from "@/components/market/PortfolioWidget";
import { StocksTable } from "@/components/market/StocksTable";
import { NewsPlaceholderState } from "@/components/market/NewsPlaceholderState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getAllStocks,
  getMarketSummary,
  getNear52WeekHigh,
  getTopByEpsTTM,
  getTopByMarketCap,
} from "@/lib/stocks";

// Server component: all data is read at request time from lib/stocks.ts,
// which prefers the live API and falls back to the static snapshot if the
// backend isn't deployed/reachable. Swapping data sources requires no
// change here — only inside lib/stocks.ts and lib/api.ts.
export default async function LandingPage() {
  const stocks = await getAllStocks();
  const summary = await getMarketSummary();
  const topByMarketCap = await getTopByMarketCap();
  const topByEps = await getTopByEpsTTM();
  const near52WeekHigh = await getNear52WeekHigh();

  return (
    <div className="flex min-h-screen flex-col">
      <TickerBar stocks={stocks} />
      <Navbar stocks={stocks} />
      <main className="flex-1">
        <HeroCards
          totalListed={summary.totalListed}
          totalMarketCap={summary.totalMarketCap}
          byCapSize={summary.byCapSize}
        />

        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-0 px-3 pb-12 sm:px-5 lg:grid-cols-[1fr_340px]">
          {/* Left column */}
          <div className="min-w-0">
            <div id="market-overview">
              <SectionHeader
                eyebrow="Overview"
                title="Market & segments"
                description="Grouped by cap-size (real, complete for all 280 stocks) — sector mapping isn't connected yet, see Data Sources."
              />
              <div className="mt-3">
                <MarketSegments
                  byCapSize={summary.byCapSize}
                  marketCapByCapSize={summary.marketCapByCapSize}
                  totalMarketCap={summary.totalMarketCap}
                />
              </div>
            </div>

            <div className="mt-7">
              <SectionHeader eyebrow="Portfolio" title="My investments" />
              <div className="mt-3">
                <PortfolioWidget />
              </div>
            </div>

            <div className="mt-7">
              <SectionHeader eyebrow="Directory" title="Today's stocks" />
              <div className="mt-3">
                <StocksTable
                  topByMarketCap={topByMarketCap}
                  topByEps={topByEps}
                  near52WeekHigh={near52WeekHigh}
                />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="border-border pt-7 lg:border-l lg:pl-4 lg:pt-0">
            <div className="lg:mt-[52px]">
              <NewsPlaceholderState />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
