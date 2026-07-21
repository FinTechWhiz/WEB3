import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Screener", href: "/screener" },
      { label: "Portfolio", href: "/portfolio" },
      { label: "Market Overview", href: "/#market-overview" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Data Sources", href: "/data-sources" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-nav">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="bg-gradient-to-r from-gold via-gold2 to-primary bg-clip-text text-sm font-heading text-transparent">
              NEPSELENS
            </p>
            <p className="mt-2 text-xs text-muted">
              Independent research for the Nepal Stock Exchange.
            </p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] font-button uppercase tracking-wide text-muted">
                {column.title}
              </p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-foreground2 hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-border pt-5 text-[11px] text-muted">
          NepseLens is an independent research tool and is not affiliated
          with the Nepal Stock Exchange (NEPSE). Data shown is fundamentals
          information; it is not investment advice.
        </div>
      </div>
    </footer>
  );
}
