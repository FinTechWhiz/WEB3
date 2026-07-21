import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NepseLens — Nepal Stock Market Research",
  description:
    "Fundamentals, market overview, and research tools for the Nepal Stock Exchange (NEPSE).",
};

// Runs before first paint (via next/script beforeInteractive-equivalent:
// inline in <head>) so a returning visitor's saved theme applies
// immediately instead of flashing dark → light. Safe for static export —
// this is plain client JS, no server dependency.
const noFlashThemeScript = `
  (function() {
    try {
      var stored = window.localStorage.getItem("nepselens-theme");
      if (stored === "light") {
        document.documentElement.setAttribute("data-theme", "light");
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
