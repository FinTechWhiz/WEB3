import type { CapSize } from "@/lib/types";

const CAP_SIZE_STYLES: Record<CapSize, string> = {
  "High-cap": "bg-cyan2 text-cyan border-primary/30",
  "Mid-cap": "bg-accent/10 text-accent border-accent/30",
  "Small-cap": "bg-surface2 text-foreground2 border-border2",
  Unclassified: "bg-surface2 text-muted border-border",
};

interface BadgeProps {
  capSize: CapSize;
}

export function CapSizeBadge({ capSize }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-button ${CAP_SIZE_STYLES[capSize]}`}
    >
      {capSize}
    </span>
  );
}
