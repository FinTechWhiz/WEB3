def test_register_returns_tokens(client):
    response = client.post(
        "/api/v1/auth/register",
        json={"email": "trader@example.com", "password": "correct-horse-battery"},
    )
    assert response.status_code == 201
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in body


def test_register_duplicate_email_returns_409(client):
    payload = {"email": "trader@example.com", "password": "correct-horse-battery"}
    client.post("/api/v1/auth/register", json=payload)
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 409


def test_login_with_wrong_password_returns_401(client):
    client.post(
        "/api/v1/auth/register",
        json={"email": "trader@example.com", "password": "correct-horse-battery"},
    )
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "trader@example.com", "password": "wrong-password"},
    )
    assert response.status_code == 401


def test_watchlist_requires_auth(client):
    response = client.get("/api/v1/watchlists")
    assert response.status_code == 401


def test_user_cannot_access_another_users_watchlist(client):
    # User A creates a watchlist.
    reg_a = client.post(
        "/api/v1/auth/register",
        json={"email": "a@example.com", "password": "correct-horse-battery"},
    )
    token_a = reg_a.json()["access_token"]
    created = client.post(
        "/api/v1/watchlists",
        json={"name": "My Picks"},
        headers={"Authorization": f"Bearer {token_a}"},
    )
    watchlist_id = created.json()["id"]

    # User B tries to read it — must get 404, not the data.
    reg_b = client.post(
        "/api/v1/auth/register",
        json={"email": "b@example.com", "password": "correct-horse-battery"},
    )
    token_b = reg_b.json()["access_token"]
    response = client.post(
        f"/api/v1/watchlists/{watchlist_id}/stocks",
        json={"symbol": "NABIL"},
        headers={"Authorization": f"Bearer {token_b}"},
    )
    assert response.status_code == 404
