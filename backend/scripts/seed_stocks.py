"""
Seeds the stocks table from backend/data/stocks.json — a copy of the same
real NEPSE fundamentals data (280 symbols) that powers the frontend, kept
inside backend/ so the backend is self-contained: a Docker build with
build context = backend/ (e.g. Render's "Root Directory" setting) still
has this file, unlike the frontend's copy one level up in ../data/. Safe
to re-run: upserts by symbol instead of duplicating rows.

If you regenerate the frontend's data/stocks.json (e.g. from an updated
workbook), copy it here too: cp ../data/stocks.json backend/data/stocks.json

Usage:
    python -m scripts.seed_stocks
"""

import json
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Stock

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "stocks.json"


def seed_stocks(db: Session) -> None:
    if not DATA_PATH.exists():
        raise FileNotFoundError(
            f"Expected fundamentals data at {DATA_PATH}. "
            "Run the frontend data pipeline first, or copy data/stocks.json here."
        )

    records = json.loads(DATA_PATH.read_text())
    created, updated = 0, 0

    for r in records:
        stock = db.scalar(select(Stock).where(Stock.symbol == r["symbol"]))
        if stock is None:
            stock = Stock(symbol=r["symbol"])
            db.add(stock)
            created += 1
        else:
            updated += 1

        # company_name isn't in the source workbook (only ticker symbols
        # were provided) — fall back to the symbol itself rather than
        # inventing a company name. Replace once a verified name list
        # is available.
        stock.company_name = r.get("companyName", r["symbol"])
        stock.ltp = r["ltp"]
        stock.market_cap = r["marketCap"]
        stock.paid_up_capital = r["paidUpCapital"]
        stock.total_float = r["totalFloat"]
        stock.cap_size = r["capSize"]
        stock.asset_per_share = r["assetPerShare"]
        stock.book_value_per_share = r["bookValuePerShare"]
        stock.eps_reported = r["epsReported"]
        stock.eps_ttm = r["epsTTM"]
        stock.sales_per_share_ttm = r["salesPerShareTTM"]
        stock.expected_dps = r["expectedDPS"]
        stock.payout_ratio = r["payoutRatio"]
        stock.week_52_high = r["week52High"]
        stock.week_52_low = r["week52Low"]

    db.commit()
    print(f"Seeded stocks: {created} created, {updated} updated, {len(records)} total")


if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed_stocks(session)
    finally:
        session.close()
