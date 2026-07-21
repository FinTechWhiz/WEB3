import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonSection } from "@/components/layout/ComingSoonSection";

export const metadata: Metadata = { title: "Portfolio — NepseLens" };

export default function PortfolioPage() {
  return (
    <PageShell>
      <ComingSoonSection
        title="Portfolio tracking is coming soon"
        description="Track your holdings and watchlists across NEPSE. Requires the accounts system in backend/app/routers/auth.py and watchlists.py, which is built — this page just isn't wired to it yet."
      />
    </PageShell>
  );
}
