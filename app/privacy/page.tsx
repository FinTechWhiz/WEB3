import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Privacy Policy — NepseLens" };

export default function PrivacyPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-heading text-foreground sm:text-3xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-sm font-body leading-relaxed text-muted">
          A drafted, legally-reviewed Privacy Policy is not published yet.
          Today this site is a static export with no accounts, no cookies
          beyond what GitHub Pages itself sets, and no analytics configured.
          That will change once the backend (accounts, watchlists) is
          deployed and connected — a real policy describing exactly what is
          collected and why must be published before that happens, not
          after.
        </p>
      </section>
    </PageShell>
  );
}
