"""
Application entrypoint. Run locally with:
    uvicorn app.main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address

from app.core.config import get_settings
from app.routers import auth, market, stocks, watchlists

settings = get_settings()

limiter = Limiter(key_func=get_remote_address, default_limits=[
    f"{settings.rate_limit_per_minute}/minute"
])


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: nothing to warm up yet — DB connections are pooled lazily.
    yield
    # Shutdown: engine disposal is handled by SQLAlchemy's pool on process exit.


app = FastAPI(
    title="NepseLens API",
    description="NEPSE stock research platform API",
    version="0.1.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# Without this middleware, `default_limits` on the Limiter is inert —
# slowapi only enforces limits it's wired to via this ASGI middleware
# (or a per-route @limiter.limit() decorator).
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Uniform error shape across the API instead of FastAPI's default,
    # which leaks internal field paths in a format the frontend has to
    # special-case.
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": "Validation failed", "errors": exc.errors()},
    )


@app.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(stocks.router, prefix=settings.api_v1_prefix)
app.include_router(market.router, prefix=settings.api_v1_prefix)
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(watchlists.router, prefix=settings.api_v1_prefix)
