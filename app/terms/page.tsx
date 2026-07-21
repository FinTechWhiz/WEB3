import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Terms of Service — NepseLens" };

export default function TermsPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-heading text-foreground sm:text-3xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-sm font-body leading-relaxed text-muted">
          A drafted, legally-reviewed Terms of Service is not published yet.
          Until it is, treat this as an early preview: there is no user
          account system live on this site, no data is being collected from
          visitors beyond standard hosting logs, and nothing here is
          investment advice. Do not rely on this page as a binding
          agreement — replace it with real, counsel-reviewed terms before
          taking user signups or handling money.
        </p>
      </section>
    </PageShell>
  );
}
