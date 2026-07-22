import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { WatchlistManager } from "@/components/market/WatchlistManager";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllStocks } from "@/lib/stocks";

export const metadata: Metadata = { title: "Portfolio — NepseLens" };

export default async function PortfolioPage() {
  const stocks = await getAllStocks();

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Portfolio"
          title="Your watchlist"
          description="Saved in this browser — no account needed. Won't follow you to another device or browser."
        />
        <div className="mt-4">
          <WatchlistManager stocks={stocks} />
        </div>
      </div>
    </PageShell>
  );
}
