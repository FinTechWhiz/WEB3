interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-1 text-[10px] font-button uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="text-sm font-heading text-foreground">{title}</h2>
        {description && (
          <p className="mt-1 text-xs font-body text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
