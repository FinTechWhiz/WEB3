import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { Screener } from "@/components/market/Screener";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getAllStocks } from "@/lib/stocks";

export const metadata: Metadata = { title: "Screener — NepseLens" };

export default async function ScreenerPage() {
  const stocks = await getAllStocks();

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Screener"
          title="Filter all 280 NEPSE stocks"
          description="By cap-size, market cap, and trailing EPS — real fundamentals, filtered client-side."
        />
        <div className="mt-4">
          <Screener stocks={stocks} />
        </div>
      </div>
    </PageShell>
  );
}
