import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-heading text-foreground">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm font-body text-muted">
        That page doesn&apos;t exist, or the symbol you searched for isn&apos;t
        one of the 280 stocks currently tracked.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-card bg-primary px-6 py-3 text-sm font-button text-white transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </div>
  );
}
