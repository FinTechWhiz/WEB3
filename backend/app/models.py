"""
ORM models. Mirrors the schema documented in PROJECT.md exactly, so the
two stay in sync — update both together.
"""

import uuid
from datetime import date, datetime

from sqlalchemy import (
    BigInteger,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.types import GUID
from app.database import Base


class Sector(Base):
    """
    Real NEPSE sector taxonomy (Commercial Banks, Hydropower, Life
    Insurance, etc.) — seeded from scripts/seed_sectors.py using the
    exchange's published classification. Individual stock -> sector
    assignments are NOT auto-populated; see stocks.sector_id comment.
    """

    __tablename__ = "sectors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    stocks: Mapped[list["Stock"]] = relationship(back_populates="sector")


class Stock(Base):
    __tablename__ = "stocks"

    id: Mapped[int] = mapped_column(primary_key=True)
    symbol: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    company_name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Nullable on purpose: we do not have a verified per-symbol sector
    # mapping yet (see PROJECT.md, Open Decision #2). Never backfill this
    # with a guess — leave it null until a real source is connected.
    sector_id: Mapped[int | None] = mapped_column(ForeignKey("sectors.id"), nullable=True)

    ltp: Mapped[float | None] = mapped_column(Numeric(14, 2))
    market_cap: Mapped[float | None] = mapped_column(Numeric(18, 2))
    paid_up_capital: Mapped[float | None] = mapped_column(Numeric(18, 2))
    total_float: Mapped[float | None] = mapped_column(Numeric(6, 4))
    cap_size: Mapped[str | None] = mapped_column(String(20))

    asset_per_share: Mapped[float | None] = mapped_column(Numeric(14, 2))
    book_value_per_share: Mapped[float | None] = mapped_column(Numeric(14, 2))
    eps_reported: Mapped[float | None] = mapped_column(Numeric(14, 2))
    eps_ttm: Mapped[float | None] = mapped_column(Numeric(14, 2))
    sales_per_share_ttm: Mapped[float | None] = mapped_column(Numeric(14, 2))
    expected_dps: Mapped[float | None] = mapped_column(Numeric(14, 4))
    payout_ratio: Mapped[float | None] = mapped_column(Numeric(14, 4))

    week_52_high: Mapped[float | None] = mapped_column(Numeric(14, 2))
    week_52_low: Mapped[float | None] = mapped_column(Numeric(14, 2))

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    sector: Mapped[Sector | None] = relationship(back_populates="stocks")
    price_history: Mapped[list["PriceHistory"]] = relationship(
        back_populates="stock", cascade="all, delete-orphan"
    )
    watchlist_items: Mapped[list["WatchlistItem"]] = relationship(back_populates="stock")

    @property
    def sector_name(self) -> str | None:
        """Plain string accessor for API serialization (see schemas.StockOut)."""
        return self.sector.name if self.sector else None


class PriceHistory(Base):
    """
    Daily OHLCV. Empty until a live/EOD feed is connected — this table
    exists so the schema is ready, but nothing seeds it with invented
    prices (see PROJECT.md, Open Decision #1).
    """

    __tablename__ = "price_history"
    __table_args__ = (UniqueConstraint("stock_id", "trade_date"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), nullable=False)
    trade_date: Mapped[date] = mapped_column(Date, nullable=False)
    open: Mapped[float | None] = mapped_column(Numeric(14, 2))
    high: Mapped[float | None] = mapped_column(Numeric(14, 2))
    low: Mapped[float | None] = mapped_column(Numeric(14, 2))
    close: Mapped[float | None] = mapped_column(Numeric(14, 2))
    volume: Mapped[int | None] = mapped_column(BigInteger)

    stock: Mapped[Stock] = relationship(back_populates="price_history")


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    watchlists: Mapped[list["Watchlist"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )


class Watchlist(Base):
    __tablename__ = "watchlists"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID(), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        GUID(), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)

    user: Mapped[User] = relationship(back_populates="watchlists")
    items: Mapped[list["WatchlistItem"]] = relationship(
        back_populates="watchlist", cascade="all, delete-orphan"
    )


class WatchlistItem(Base):
    __tablename__ = "watchlist_items"

    watchlist_id: Mapped[uuid.UUID] = mapped_column(
        GUID(),
        ForeignKey("watchlists.id", ondelete="CASCADE"),
        primary_key=True,
    )
    stock_id: Mapped[int] = mapped_column(ForeignKey("stocks.id"), primary_key=True)
    added_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    watchlist: Mapped[Watchlist] = relationship(back_populates="items")
    stock: Mapped[Stock] = relationship(back_populates="watchlist_items")
