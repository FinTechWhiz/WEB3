"""
GET /api/v1/market/overview - aggregate market snapshot

Deliberately does NOT include an index value/change% or gainers/losers —
no live feed is connected yet (see PROJECT.md, Open Decision #1). Adding a
fake number here would be worse than omitting the field.
"""

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Stock
from app.schemas import MarketSummaryResponse

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/overview", response_model=MarketSummaryResponse)
def market_overview(db: Session = Depends(get_db)) -> MarketSummaryResponse:
    total_listed = db.scalar(select(func.count()).select_from(Stock)) or 0
    total_market_cap = db.scalar(select(func.coalesce(func.sum(Stock.market_cap), 0))) or 0

    rows = db.execute(
        select(Stock.cap_size, func.count()).group_by(Stock.cap_size)
    ).all()
    by_cap_size = {cap_size or "Unclassified": count for cap_size, count in rows}

    return MarketSummaryResponse(
        total_listed=total_listed,
        total_market_cap=float(total_market_cap),
        by_cap_size=by_cap_size,
    )
