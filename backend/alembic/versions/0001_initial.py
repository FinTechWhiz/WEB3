"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-07-17

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_initial"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "sectors",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False, unique=True),
    )

    op.create_table(
        "stocks",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("symbol", sa.String(length=20), nullable=False, unique=True),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("sector_id", sa.Integer(), sa.ForeignKey("sectors.id"), nullable=True),
        sa.Column("ltp", sa.Numeric(14, 2), nullable=True),
        sa.Column("market_cap", sa.Numeric(18, 2), nullable=True),
        sa.Column("paid_up_capital", sa.Numeric(18, 2), nullable=True),
        sa.Column("total_float", sa.Numeric(6, 4), nullable=True),
        sa.Column("cap_size", sa.String(length=20), nullable=True),
        sa.Column("asset_per_share", sa.Numeric(14, 2), nullable=True),
        sa.Column("book_value_per_share", sa.Numeric(14, 2), nullable=True),
        sa.Column("eps_reported", sa.Numeric(14, 2), nullable=True),
        sa.Column("eps_ttm", sa.Numeric(14, 2), nullable=True),
        sa.Column("sales_per_share_ttm", sa.Numeric(14, 2), nullable=True),
        sa.Column("expected_dps", sa.Numeric(14, 4), nullable=True),
        sa.Column("payout_ratio", sa.Numeric(14, 4), nullable=True),
        sa.Column("week_52_high", sa.Numeric(14, 2), nullable=True),
        sa.Column("week_52_low", sa.Numeric(14, 2), nullable=True),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_stocks_symbol", "stocks", ["symbol"])

    op.create_table(
        "price_history",
        sa.Column("id", sa.BigInteger(), primary_key=True),
        sa.Column("stock_id", sa.Integer(), sa.ForeignKey("stocks.id"), nullable=False),
        sa.Column("trade_date", sa.Date(), nullable=False),
        sa.Column("open", sa.Numeric(14, 2), nullable=True),
        sa.Column("high", sa.Numeric(14, 2), nullable=True),
        sa.Column("low", sa.Numeric(14, 2), nullable=True),
        sa.Column("close", sa.Numeric(14, 2), nullable=True),
        sa.Column("volume", sa.BigInteger(), nullable=True),
        sa.UniqueConstraint("stock_id", "trade_date", name="uq_price_history_stock_date"),
    )

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "watchlists",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(length=100), nullable=False),
    )

    op.create_table(
        "watchlist_items",
        sa.Column(
            "watchlist_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("watchlists.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "stock_id", sa.Integer(), sa.ForeignKey("stocks.id"), primary_key=True
        ),
        sa.Column(
            "added_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_table("watchlist_items")
    op.drop_table("watchlists")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.drop_table("price_history")
    op.drop_index("ix_stocks_symbol", table_name="stocks")
    op.drop_table("stocks")
    op.drop_table("sectors")
