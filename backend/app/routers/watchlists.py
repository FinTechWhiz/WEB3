"""
GET    /api/v1/watchlists
POST   /api/v1/watchlists
POST   /api/v1/watchlists/{watchlist_id}/stocks
DELETE /api/v1/watchlists/{watchlist_id}/stocks/{symbol}
DELETE /api/v1/watchlists/{watchlist_id}

All routes require auth and are scoped to the current user — a user can
never read or modify another user's watchlist, even by guessing an ID.
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models import Stock, User, Watchlist, WatchlistItem
from app.schemas import WatchlistAddStockRequest, WatchlistCreateRequest, WatchlistOut

router = APIRouter(prefix="/watchlists", tags=["watchlists"])


def _get_owned_watchlist(watchlist_id: UUID, user: User, db: Session) -> Watchlist:
    watchlist = db.get(Watchlist, watchlist_id)
    if watchlist is None or watchlist.user_id != user.id:
        # 404, not 403 — don't confirm to an attacker that the ID exists.
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Watchlist not found")
    return watchlist


def _to_watchlist_out(watchlist: Watchlist) -> WatchlistOut:
    return WatchlistOut(
        id=watchlist.id,
        name=watchlist.name,
        stock_symbols=[item.stock.symbol for item in watchlist.items],
    )


@router.get("", response_model=list[WatchlistOut])
def list_watchlists(
    user: User = Depends(get_current_user), db: Session = Depends(get_db)
) -> list[WatchlistOut]:
    watchlists = db.scalars(select(Watchlist).where(Watchlist.user_id == user.id)).all()
    return [_to_watchlist_out(w) for w in watchlists]


@router.post("", response_model=WatchlistOut, status_code=status.HTTP_201_CREATED)
def create_watchlist(
    payload: WatchlistCreateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WatchlistOut:
    watchlist = Watchlist(user_id=user.id, name=payload.name)
    db.add(watchlist)
    db.commit()
    db.refresh(watchlist)
    return _to_watchlist_out(watchlist)


@router.post("/{watchlist_id}/stocks", response_model=WatchlistOut)
def add_stock_to_watchlist(
    watchlist_id: UUID,
    payload: WatchlistAddStockRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WatchlistOut:
    watchlist = _get_owned_watchlist(watchlist_id, user, db)

    stock = db.scalar(select(Stock).where(Stock.symbol == payload.symbol.upper()))
    if stock is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No stock found for symbol '{payload.symbol.upper()}'",
        )

    already_added = any(item.stock_id == stock.id for item in watchlist.items)
    if not already_added:
        db.add(WatchlistItem(watchlist_id=watchlist.id, stock_id=stock.id))
        db.commit()
        db.refresh(watchlist)

    return _to_watchlist_out(watchlist)


@router.delete("/{watchlist_id}/stocks/{symbol}", response_model=WatchlistOut)
def remove_stock_from_watchlist(
    watchlist_id: UUID,
    symbol: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> WatchlistOut:
    watchlist = _get_owned_watchlist(watchlist_id, user, db)

    item = next(
        (i for i in watchlist.items if i.stock.symbol == symbol.upper()), None
    )
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"'{symbol.upper()}' is not in this watchlist",
        )

    db.delete(item)
    db.commit()
    db.refresh(watchlist)
    return _to_watchlist_out(watchlist)


@router.delete("/{watchlist_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_watchlist(
    watchlist_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    watchlist = _get_owned_watchlist(watchlist_id, user, db)
    db.delete(watchlist)
    db.commit()
