"""
Pydantic v2 schemas for request/response validation. Kept separate from
ORM models (app/models.py) so API contracts can evolve independently of
the database shape.
"""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# --- Stocks ---


class StockOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    symbol: str
    company_name: str
    sector: str | None = Field(default=None, validation_alias="sector_name")
    ltp: float | None
    market_cap: float | None
    paid_up_capital: float | None
    total_float: float | None
    cap_size: str | None
    asset_per_share: float | None
    book_value_per_share: float | None
    eps_reported: float | None
    eps_ttm: float | None
    sales_per_share_ttm: float | None
    expected_dps: float | None
    payout_ratio: float | None
    week_52_high: float | None
    week_52_low: float | None
    updated_at: datetime


class StockListResponse(BaseModel):
    items: list[StockOut]
    total: int
    page: int
    page_size: int


# --- Market ---


class MarketSummaryResponse(BaseModel):
    total_listed: int
    total_market_cap: float
    by_cap_size: dict[str, int]


# --- Auth ---


class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# --- Watchlists ---


class WatchlistCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)


class WatchlistOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    stock_symbols: list[str] = []


class WatchlistAddStockRequest(BaseModel):
    symbol: str = Field(min_length=1, max_length=20)
