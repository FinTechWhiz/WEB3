import Link from "next/link";

interface ComingSoonSectionProps {
  title: string;
  description: string;
}

/**
 * Used for routes that are linked from the nav/footer but not built yet
 * (news, about, contact). A real, honest "not built yet" page — not a
 * fabricated feature — so these links are functional (no 404) without
 * pretending the feature exists. Swap each usage out for real content as
 * that page gets built. (Screener and Portfolio moved off this component
 * once they became genuinely functional — see Screener.tsx and
 * WatchlistManager.tsx.)
 */
export function ComingSoonSection({ title, description }: ComingSoonSectionProps) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <h1 className="text-2xl font-heading text-foreground sm:text-3xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-md text-sm font-body text-muted">
        {description}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-card bg-primary px-6 py-3 text-sm font-button text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </section>
  );
}
