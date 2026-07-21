# NEPSE Analytics Platform — PROJECT.md

## Project Vision
A TickerTape-style stock research platform for the Nepal Stock Exchange (NEPSE).
Clean data-dense UI, real fundamentals, portfolio tracking, and (later) live
market data. Nepal-specific: NPR currency formatting, NPT timezone, NEPSE
sector taxonomy, no assumptions carried over from Indian/US market structure.

## Current Features (built)
- **Redesigned to match the user's preferred reference design** (a dark
  dashboard-style layout: sticky ticker bar, dark navbar with gold/blue
  brand gradient, hero stat cards, market-segments grid, portfolio widget,
  tabbed stocks table, right-column news panel). Real dark/light theme
  toggle (`components/theme/ThemeProvider.tsx`), dark by default, persisted
  via localStorage, no flash-of-wrong-theme on load. Colors are CSS custom
  properties (`app/globals.css`, `[data-theme]`), not fixed hex, so the
  same Tailwind classes work in both themes.
- **Deliberately did NOT copy from the reference design**: a live NEPSE
  index card, Fear & Greed meter, live ticker price-change%, and a
  live market-open/closed clock. All four need data or facts we don't have
  confidently — see the comment in `HeroCards.tsx` and `TickerBar.tsx` for
  specifics (checked current NEPSE trading-hours sources mid-session; they
  actively disagreed on the current Friday schedule, so a "live" status
  badge could be confidently wrong).
- Sector grid replaced with a cap-size grid (`MarketSegments.tsx`) — same
  reasoning as before, sector mapping isn't done yet.
- Gainers/Losers/Most Active tabs replaced with honestly-labeled
  fundamentals tabs (`StocksTable.tsx`): By Market Cap / By TTM Earnings /
  Near 52W High.
- **Configured for GitHub Pages** (`next.config.ts`: `output: "export"`,
  parameterized `basePath`; `.github/workflows/deploy-pages.yml`): pushing
  to `main` automatically builds a fully static site and deploys it to
  `https://<you>.github.io/<repo-name>/` — no server, no separate hosting
  account needed. Verified the two things that make static export actually
  work here: `generateStaticParams()` against the real dataset produces 280
  unique, URL-safe symbols (see below), and every internal link uses
  `next/link` instead of plain `<a>` (plain anchors don't get the
  GitHub Pages repo-name prefix applied automatically — this was a real bug
  caught and fixed across Navbar, Footer, HeroSection, StockCard, and
  StockDirectory).
- **Real per-stock pages**: `app/stocks/[symbol]/page.tsx`, statically
  generated for all 280 real symbols — full fundamentals (valuation,
  earnings, 52-week range), not templated dummy data.
- **Every linked route now resolves to a real page**, not a 404: screener,
  portfolio, news, signup, about, contact, terms, privacy, data-sources.
  Most are honest "not built yet" states (see `ComingSoonSection.tsx`) —
  not fabricated features — except About and Data Sources, which have real
  content, and News, which reuses the existing honest empty state.
- **`npm run verify` actually runs** (`scripts/verify-data-layer.ts`, via `tsx`,
  zero build step) — 13 checks against the real 280-stock dataset, all
  passing. This is the one part of the stack genuinely executed in every
  session, not just reviewed, because it needs no external dependencies.
  It caught a real bug: `formatNPR` and `StockCard`'s price display were
  using the `"ne-NP"` locale, which renders digits in Devanagari numerals
  (e.g. "४,१६२") instead of the Latin digits used everywhere else in the
  UI. Fixed in `lib/format.ts` and `components/market/StockCard.tsx` —
  both now use `"en-IN"`, which gives the same lakh/crore grouping with
  Latin digits.
- Landing page: navbar, hero, market overview cards, fundamentals leaderboards,
  stock directory grid — all backed by real data from `data/stocks.json`.
- 280 real NEPSE symbols with fundamentals (LTP, market cap, EPS, book value,
  52-week range, payout ratio, etc.), parsed from the user-provided workbook.
- Backend API (FastAPI + SQLAlchemy 2.0 + PostgreSQL): stocks list/detail,
  market overview, JWT auth (register/login/refresh, argon2 hashing),
  per-user watchlists with ownership checks (404-not-403 on cross-user access),
  rate limiting, uniform validation error shape.
- Alembic migration for the full schema (`0001_initial`).
- Seed scripts: real NEPSE sector taxonomy (`seed_sectors.py`) and the 280-row
  fundamentals snapshot (`seed_stocks.py`, upserts by symbol, safe to re-run).
- Pytest suite (18 tests: stocks, market overview, auth, watchlist isolation)
  against an in-memory SQLite DB — written and syntax-verified
  (`python -m py_compile` clean); not executed end-to-end here since this
  sandbox has no network to `pip install`. Run `pytest -v --cov=app` as your
  first step after installing dependencies.
- `docker-compose.yml` (Postgres + Redis + API) and a GitHub Actions CI
  workflow that lints/typechecks the frontend and lints/tests the backend.
- Frontend now calls the live API when `API_BASE_URL` is set (`lib/api.ts`,
  `lib/config.ts`), with automatic fallback to `data/stocks.json` if the
  env var is unset or the backend is unreachable — the site never breaks
  or shows fake data, it just degrades to the static snapshot. Backend's
  `StockOut` schema was extended to expose the full fundamentals set the
  frontend needs (was previously missing several fields).

## Explicitly NOT built yet (and why)
- **Top Gainers / Top Losers / Heatmap by sector** — the source workbook has no
  daily change% or sector classification. `price_history` table exists
  (empty) and `GET /api/v1/market/overview` deliberately omits an index/
  change field — see "Open Decisions" below. There's a regression test
  (`test_market_overview_has_no_fabricated_index_field`) guarding against
  accidentally adding a fake one later.
- **Per-stock sector assignment** — the sector *taxonomy* is seeded (13 real
  NEPSE sectors), but no stock is mapped to one yet; `stocks.sector_id` is
  null for all 280 rows until a verified symbol→sector source is connected.
- **News & Featured Analysis** — no licensed news feed connected. Landing page
  ships a real, empty state for this section rather than fake headlines.
- **Celery / background jobs** — not needed yet with no live feed to poll;
  add when a scheduled EOD import job exists.
- **Deployment** (Vercel/Railway/Cloudflare) — needs real accounts/secrets
  this sandbox doesn't have. `docker-compose.yml` + `Dockerfile` are
  deploy-ready; only environment-specific config remains.

## Open Decisions (need your input before Phase 4+)
1. **Live price/change data source.** Options: (a) NEPSE's official TMS feed
   (requires broker/API agreement), (b) a licensed data vendor (e.g. an
   agreement with ShareSansar/Merolagani), (c) self-run scraper — only if you
   have the legal right to do so (check ToS). This blocks Gainers/Losers/Heatmap.
2. **Sector taxonomy.** NEPSE sectors (Commercial Banks, Hydropower, Life
   Insurance, etc.) aren't in the current dataset. Needs either a lookup table
   you provide or an official NEPSE sector list to map each symbol.
3. **Auth provider.** Roll-your-own JWT vs. a managed auth provider (Clerk,
   Auth0)? Affects Phase 5 scope significantly.
4. **Hosting budget/region.** Vercel (frontend) is fine globally; Railway/Render
   (Postgres/FastAPI) — confirm a region with acceptable latency to Nepal.

## Folder Structure
```
nepse-platform/
├── app/                     # Next.js frontend
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── layout/{Navbar,Footer}.tsx
│   ├── market/{HeroSection,MarketOverview,FundamentalLeaders,
│   │            StockDirectory,StockCard,NewsPlaceholderState}.tsx
│   └── ui/{Badge,SectionHeader}.tsx
├── lib/{types,stocks,format}.ts
├── data/stocks.json         # 280 real NEPSE fundamentals (from stocks.xlsx)
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py          # app factory, CORS, rate limiting, routers
│   │   ├── database.py      # engine/session, declarative Base
│   │   ├── models.py        # SQLAlchemy ORM: Stock, Sector, PriceHistory,
│   │   │                    #   User, Watchlist, WatchlistItem
│   │   ├── schemas.py       # Pydantic request/response contracts
│   │   ├── core/
│   │   │   ├── config.py    # env-driven settings (pydantic-settings)
│   │   │   ├── security.py  # argon2 hashing, JWT issue/verify
│   │   │   ├── deps.py      # get_current_user auth dependency
│   │   │   └── types.py     # cross-dialect GUID column type
│   │   └── routers/{stocks,market,auth,watchlists}.py
│   ├── alembic/              # migrations (0001_initial = full schema)
│   ├── scripts/{seed_sectors,seed_stocks}.py
│   ├── tests/                # pytest, in-memory SQLite
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
├── .github/workflows/ci.yml  # lint+typecheck frontend, lint+test backend
├── docker-compose.yml         # postgres + redis + api
├── PROJECT.md
├── package.json / tsconfig.json / tailwind.config.ts / next.config.ts
└── .eslintrc.json / .prettierrc
```

## Database Schema (implemented — see `backend/alembic/versions/0001_initial.py`)
```sql
CREATE TABLE sectors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE stocks (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(20) UNIQUE NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  sector_id INT REFERENCES sectors(id),        -- NULL until Open Decision #2
  ltp NUMERIC(14,2), market_cap NUMERIC(18,2), paid_up_capital NUMERIC(18,2),
  total_float NUMERIC(6,4), cap_size VARCHAR(20),
  asset_per_share NUMERIC(14,2), book_value_per_share NUMERIC(14,2),
  eps_reported NUMERIC(14,2), eps_ttm NUMERIC(14,2), sales_per_share_ttm NUMERIC(14,2),
  expected_dps NUMERIC(14,4), payout_ratio NUMERIC(14,4),
  week_52_high NUMERIC(14,2), week_52_low NUMERIC(14,2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE price_history (               -- empty until a live/EOD feed exists
  id BIGSERIAL PRIMARY KEY,
  stock_id INT NOT NULL REFERENCES stocks(id),
  trade_date DATE NOT NULL,
  open NUMERIC(14,2), high NUMERIC(14,2), low NUMERIC(14,2), close NUMERIC(14,2),
  volume BIGINT,
  UNIQUE(stock_id, trade_date)
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE watchlists (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE watchlist_items (
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  stock_id INT REFERENCES stocks(id),
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (watchlist_id, stock_id)
);
```

## API List (implemented — see `backend/app/routers/`)
- `GET /health`
- `GET /api/v1/stocks` — paginated, filter by `cap_size`, `sector`, `symbol_contains`
- `GET /api/v1/stocks/{symbol}` — case-insensitive lookup, 404 if unknown
- `GET /api/v1/market/overview` — total listed, total market cap, cap-size breakdown
  (no index/change% field — see Open Decision #1)
- `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `POST /api/v1/auth/refresh`
- `GET/POST /api/v1/watchlists`, `POST/DELETE /api/v1/watchlists/{id}/stocks/{symbol}`,
  `DELETE /api/v1/watchlists/{id}` — all auth-required, ownership-scoped (404 not 403
  on cross-user access attempts)

**Not yet added:** `GET /api/v1/market/movers?type=gainers|losers` — blocked on
Open Decision #1 (live price feed).

## Design System
- Primary `#1A5FFF` · Secondary `#101828` · Accent `#00C853` · Background `#FFFFFF` · Text `#111827`
- Font: Inter — Bold (headings), Medium (body), SemiBold (buttons/CTAs)
- Spacing/typography scale: see `tailwind.config.ts`

## Coding Rules
- TypeScript strict mode, no `any` without justification comment
- No inline styles — Tailwind utility classes only, tokens from config
- Server components by default; `"use client"` only where interactivity requires it
- Every data-shaping function lives in `lib/`, pure, unit-testable, commented
- No fabricated data anywhere — empty/loading states instead of fake content

## Dependencies
next@15, react@19, typescript@5, tailwindcss@3, eslint, prettier — see `package.json`

## Completed Tasks
- [x] Phase 1: Architecture & data audit
- [x] Phase 2: Folder structure
- [x] Phase 3 (partial): Landing page UI with real fundamentals data
- [x] Phase 4: FastAPI backend - models, Alembic migration, stocks/market/auth/watchlists
      routers, JWT auth, rate limiting, seed scripts (real fundamentals + real sector
      taxonomy, no fabricated stock-to-sector mapping). See backend/README.md.
- [x] Phase 5: Auth - register/login/refresh with argon2 password hashing, JWT
      access + refresh tokens, per-user resource ownership enforced on watchlists.
- [x] Phase 7 (partial): pytest suite for stocks/market/auth endpoints, written
      against an in-memory SQLite DB. Not executed in this environment - no
      network access to pip install. Run pytest -v locally as the first
      verification step.
- [x] Phase 8 (partial): docker-compose.yml (postgres+redis+api) and
      .github/workflows/ci.yml - lints/typechecks/builds the frontend and
      lints/tests the backend on every push and PR to main.

## Pending Tasks
- [ ] Run the backend test suite for real (this sandbox has no network access)
- [ ] Sector taxonomy to per-stock mapping (taxonomy itself is seeded; see Open Decisions)
- [ ] Live price feed integration decision
- [ ] Run `npm install` once locally and commit the resulting
      package-lock.json (unblocks switching CI from `npm install` to `npm ci`)
- [ ] Phase 6: finish public API (currently stocks/market/auth/watchlists - add
      price-history and screener/filter endpoints once live data exists)
- [ ] Phase 7: frontend tests (Vitest + Playwright)
- [ ] Phase 8: Vercel + Railway/Render deployment, Cloudflare, environment secrets

## Known Bugs
- None currently known. Caught and fixed during this build: postgresql.UUID
  columns didn't compile against the SQLite test database - replaced with a
  portable GUID type (backend/app/core/types.py) that uses native UUID on
  Postgres and CHAR(36) elsewhere. slowapi's default_limits was silently
  inert without SlowAPIMiddleware - added in backend/app/main.py.
- Unverified: the backend has been syntax-checked (py_compile, all 24
  files pass) and logically reviewed but not executed against real
  dependencies or a real Postgres instance, since this sandbox has no network
  access. Run pytest -v as the very first step in your next session.
