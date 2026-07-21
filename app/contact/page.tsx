import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonSection } from "@/components/layout/ComingSoonSection";

export const metadata: Metadata = { title: "Contact — NepseLens" };

export default function ContactPage() {
  return (
    <PageShell>
      <ComingSoonSection
        title="Contact details coming soon"
        description="A real contact channel (support email or form) isn't set up yet. Update this page with real contact info once one exists — see app/contact/page.tsx."
      />
    </PageShell>
  );
}
