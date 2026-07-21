import { SectionHeader } from "@/components/ui/SectionHeader";

/**
 * "Latest News" and "Featured Analysis" were in the brief, but no news feed
 * is connected yet and the brief explicitly forbids fabricated content. A
 * real empty state — not a fake headline — is the correct production
 * behavior here. Wire this up to a licensed news API or RSS integration in
 * Phase 6, then replace this component's body with a real article list.
 */
export function NewsPlaceholderState() {
  return (
    <div>
      <SectionHeader eyebrow="News & Events" title="Market news" />
      <div className="mt-4 rounded-[10px] border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-xs font-button text-foreground">
          News feed not connected yet
        </p>
        <p className="mx-auto mt-2 max-w-[220px] text-[11px] leading-relaxed text-muted">
          Shown as a real empty state rather than fabricated headlines, until
          a licensed news feed is integrated.
        </p>
      </div>
    </div>
  );
}
