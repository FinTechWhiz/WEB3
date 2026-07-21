"""
Application configuration, loaded from environment variables / .env.
Nothing sensitive is hardcoded here — see .env.example for the required keys.
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    # --- Core ---
    environment: str = Field(default="development")
    api_v1_prefix: str = "/api/v1"

    # --- Database ---
    database_url: str = Field(
        ...,
        description="e.g. postgresql+psycopg://user:pass@host:5432/nepse",
    )

    # --- Redis (caching layer for market summary / leaderboards) ---
    redis_url: str = Field(default="redis://localhost:6379/0")

    # --- Auth ---
    jwt_secret_key: str = Field(..., description="Generate with `openssl rand -hex 32`")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 14

    # --- CORS ---
    cors_allowed_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000"]
    )

    # --- Rate limiting ---
    rate_limit_per_minute: int = 60


@lru_cache
def get_settings() -> Settings:
    """Cached so Settings() only parses the environment once per process."""
    return Settings()
