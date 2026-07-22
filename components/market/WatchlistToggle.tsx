"use client";

import { useEffect, useState } from "react";
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from "@/lib/watchlist";

export function WatchlistToggle({ symbol }: { symbol: string }) {
  const [inList, setInList] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setInList(isInWatchlist(symbol));
    setMounted(true);
  }, [symbol]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => {
        if (inList) removeFromWatchlist(symbol);
        else addToWatchlist(symbol);
        setInList(!inList);
      }}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-button transition-colors ${
        inList
          ? "border-gold bg-gold/10 text-gold"
          : "border-border text-muted hover:border-gold hover:text-gold"
      }`}
    >
      <span aria-hidden="true">{inList ? "★" : "☆"}</span>
      {inList ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
