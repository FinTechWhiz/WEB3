import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = { title: "Sign Up — NepseLens" };

export default function SignupPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-heading text-foreground sm:text-3xl">
          You don&apos;t need an account
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm font-body leading-relaxed text-muted">
          The watchlist feature works without signing up — it saves right in
          your browser. A real account system exists in the codebase
          (<code>backend/app/routers/auth.py</code>) for a future version
          that syncs across devices, but there&apos;s nothing to sign up for
          today.
        </p>
        <Link
          href="/portfolio"
          className="mt-8 inline-flex rounded-card bg-primary px-6 py-3 text-sm font-button text-nav transition-opacity hover:opacity-90"
        >
          Go to your watchlist →
        </Link>
      </section>
    </PageShell>
  );
}
