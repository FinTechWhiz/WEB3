import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "About — NepseLens" };

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-heading text-foreground sm:text-3xl">
          About NepseLens
        </h1>
        <p className="mt-4 text-sm font-body leading-relaxed text-muted">
          NepseLens is an independent research tool for the Nepal Stock
          Exchange (NEPSE). It currently covers fundamentals — market cap,
          EPS, book value, and 52-week range — for all 280 companies listed
          on NEPSE. It is not affiliated with, endorsed by, or operated by
          NEPSE. Nothing on this site is investment advice.
        </p>
        <p className="mt-4 text-sm font-body leading-relaxed text-muted">
          See the{" "}
          <Link href="/data-sources" className="text-primary hover:underline">
            data sources
          </Link>{" "}
          page for exactly where the numbers on this site come from.
        </p>
      </section>
    </PageShell>
  );
}
