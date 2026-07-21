"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title="Toggle dark/light mode"
      aria-label="Toggle dark or light theme"
      className="flex flex-shrink-0 items-center gap-1 rounded-lg border border-border px-2 py-1 text-sm text-foreground transition-colors hover:bg-surface"
    >
      <span aria-hidden="true">{theme === "dark" ? "🌙" : "☀️"}</span>
      <span className="hidden text-[10px] font-button sm:inline">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
    </button>
  );
}
