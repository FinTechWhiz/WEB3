import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ComingSoonSection } from "@/components/layout/ComingSoonSection";

export const metadata: Metadata = { title: "Sign Up — NepseLens" };

export default function SignupPage() {
  return (
    <PageShell>
      <ComingSoonSection
        title="Sign up is coming soon"
        description="Account creation needs the backend (backend/app/routers/auth.py) deployed and reachable — see PROJECT.md for deployment steps. The API itself is already built and tested."
      />
    </PageShell>
  );
}
