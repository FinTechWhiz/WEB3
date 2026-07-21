"""
Seeds the sectors table with NEPSE's published sector taxonomy. This is
the real, publicly documented classification (confirmed via NEPSE/Mero
Lagani sector listings) — NOT a per-stock assignment. Stocks remain
unmapped (sector_id = NULL) until a verified symbol -> sector source is
connected; see PROJECT.md, Open Decision #2.

Usage:
    python -m scripts.seed_sectors
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import Sector

NEPSE_SECTORS = [
    "Commercial Banks",
    "Development Banks",
    "Finance Companies",
    "Microfinance",
    "Life Insurance",
    "Non-Life Insurance",
    "Micro Insurance",
    "Hydropower",
    "Manufacturing and Processing",
    "Hotels and Tourism",
    "Investment",
    "Trading",
    "Others",
]


def seed_sectors(db: Session) -> None:
    created = 0
    for name in NEPSE_SECTORS:
        exists = db.scalar(select(Sector).where(Sector.name == name))
        if exists is None:
            db.add(Sector(name=name))
            created += 1
    db.commit()
    print(f"Seeded sectors: {created} created, {len(NEPSE_SECTORS)} total in taxonomy")


if __name__ == "__main__":
    session = SessionLocal()
    try:
        seed_sectors(session)
    finally:
        session.close()
