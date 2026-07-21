import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { NewsPlaceholderState } from "@/components/market/NewsPlaceholderState";

export const metadata: Metadata = { title: "News — NepseLens" };

export default function NewsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <NewsPlaceholderState />
      </div>
    </PageShell>
  );
}
