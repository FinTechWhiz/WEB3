from app.models import Sector, Stock


def _make_stock(**overrides) -> Stock:
    defaults = dict(
        symbol="NABIL",
        company_name="NABIL",
        ltp=521.9,
        market_cap=141210467343.0,
        paid_up_capital=13500000000.0,
        total_float=0.49,
        cap_size="High-cap",
        asset_per_share=1000.0,
        book_value_per_share=200.0,
        eps_reported=30.0,
        eps_ttm=31.57,
        sales_per_share_ttm=150.0,
        expected_dps=0.1,
        payout_ratio=0.3,
        week_52_high=650.0,
        week_52_low=480.0,
    )
    defaults.update(overrides)
    return Stock(**defaults)


def test_list_stocks_returns_seeded_rows(client, db_session):
    db_session.add(_make_stock())
    db_session.add(_make_stock(symbol="EBL", company_name="EBL", market_cap=95226346809.18))
    db_session.commit()

    response = client.get("/api/v1/stocks")

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    # Ordered by market cap desc — NABIL should come first.
    assert body["items"][0]["symbol"] == "NABIL"


def test_get_stock_by_symbol_is_case_insensitive(client, db_session):
    db_session.add(_make_stock())
    db_session.commit()

    response = client.get("/api/v1/stocks/nabil")

    assert response.status_code == 200
    assert response.json()["symbol"] == "NABIL"


def test_get_unknown_stock_returns_404(client):
    response = client.get("/api/v1/stocks/DOESNOTEXIST")
    assert response.status_code == 404


def test_filter_stocks_by_cap_size(client, db_session):
    db_session.add(_make_stock(symbol="NABIL", cap_size="High-cap"))
    db_session.add(_make_stock(symbol="SMALL1", cap_size="Small-cap", market_cap=1_000_000))
    db_session.commit()

    response = client.get("/api/v1/stocks", params={"cap_size": "Small-cap"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 1
    assert body["items"][0]["symbol"] == "SMALL1"


def test_stock_exposes_sector_name_not_relationship_object(client, db_session):
    sector = Sector(name="Commercial Banks")
    db_session.add(sector)
    db_session.flush()
    db_session.add(_make_stock(sector_id=sector.id))
    db_session.commit()

    response = client.get("/api/v1/stocks/NABIL")

    assert response.json()["sector"] == "Commercial Banks"


def test_market_overview_reflects_real_aggregates(client, db_session):
    db_session.add(_make_stock(symbol="A", cap_size="High-cap", market_cap=100.0))
    db_session.add(_make_stock(symbol="B", cap_size="Small-cap", market_cap=50.0))
    db_session.commit()

    response = client.get("/api/v1/market/overview")

    assert response.status_code == 200
    body = response.json()
    assert body["total_listed"] == 2
    assert body["total_market_cap"] == 150.0
    assert body["by_cap_size"] == {"High-cap": 1, "Small-cap": 1}


def test_market_overview_has_no_fabricated_index_field(client):
    """
    Regression guard for the product decision in PROJECT.md: this endpoint
    must never gain a 'nepse_index' or 'change_percent' field until a real
    live feed is connected, since we have no live source for one.
    """
    response = client.get("/api/v1/market/overview")
    body = response.json()
    assert "nepse_index" not in body
    assert "change_percent" not in body
