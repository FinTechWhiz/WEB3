"""
GET /api/v1/stocks            - paginated list, filterable by cap_size/sector
GET /api/v1/stocks/{symbol}   - single stock detail
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Sector, Stock
from app.schemas import StockListResponse, StockOut

router = APIRouter(prefix="/stocks", tags=["stocks"])


@router.get("", response_model=StockListResponse)
def list_stocks(
    db: Session = Depends(get_db),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    cap_size: str | None = Query(default=None, description="Small-cap | Mid-cap | High-cap"),
    sector: str | None = Query(default=None, description="Sector name, e.g. 'Commercial Banks'"),
    symbol_contains: str | None = Query(default=None, min_length=1, max_length=20),
) -> StockListResponse:
    stmt = select(Stock)

    if cap_size:
        stmt = stmt.where(Stock.cap_size == cap_size)
    if sector:
        stmt = stmt.join(Sector).where(Sector.name == sector)
    if symbol_contains:
        stmt = stmt.where(Stock.symbol.ilike(f"%{symbol_contains.upper()}%"))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0

    stmt = stmt.order_by(Stock.market_cap.desc().nullslast())
    stmt = stmt.offset((page - 1) * page_size).limit(page_size)

    stocks = db.scalars(stmt).all()

    return StockListResponse(
        items=[StockOut.model_validate(s) for s in stocks],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{symbol}", response_model=StockOut)
def get_stock(symbol: str, db: Session = Depends(get_db)) -> StockOut:
    stock = db.scalar(select(Stock).where(Stock.symbol == symbol.upper()))
    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No stock found for symbol '{symbol.upper()}'",
        )
    return StockOut.model_validate(stock)
