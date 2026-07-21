"""
Security primitives: password hashing (argon2, not bcrypt — no 72-byte
truncation footgun) and JWT access/refresh token issuance and verification.
"""

from datetime import datetime, timedelta, timezone
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import get_settings

settings = get_settings()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def _create_token(subject: UUID, expires_delta: timedelta, token_type: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(subject),
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_access_token(user_id: UUID) -> str:
    return _create_token(
        user_id,
        timedelta(minutes=settings.access_token_expire_minutes),
        token_type="access",
    )


def create_refresh_token(user_id: UUID) -> str:
    return _create_token(
        user_id,
        timedelta(days=settings.refresh_token_expire_days),
        token_type="refresh",
    )


class InvalidTokenError(Exception):
    pass


def decode_token(token: str, expected_type: str = "access") -> UUID:
    """Raises InvalidTokenError on any failure — expired, malformed, wrong type."""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
    except JWTError as exc:
        raise InvalidTokenError("Token is invalid or expired") from exc

    if payload.get("type") != expected_type:
        raise InvalidTokenError(f"Expected a {expected_type} token")

    try:
        return UUID(payload["sub"])
    except (KeyError, ValueError) as exc:
        raise InvalidTokenError("Token subject is malformed") from exc
