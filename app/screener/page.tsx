import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonSection } from "@/components/layout/ComingSoonSection";

export const metadata: Metadata = { title: "Screener — NepseLens" };

export default function ScreenerPage() {
  return (
    <PageShell>
      <ComingSoonSection
        title="Screener is coming soon"
        description="Filter all 280 NEPSE-listed companies by sector, market cap, EPS, and valuation ratios. In development."
      />
    </PageShell>
  );
}
