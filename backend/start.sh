#!/bin/sh
# Runs on every container start. Both steps are safe to repeat:
# - alembic upgrade head is a no-op if the schema is already current
# - the seed scripts upsert by symbol/name, so re-running never duplicates
# This means deploying to a host with no shell access (e.g. Render's free
# tier) still gets a fully migrated, fully seeded database with zero manual
# steps — you never have to run a command by hand.
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Seeding sector taxonomy..."
python -m scripts.seed_sectors

echo "Seeding stock fundamentals..."
python -m scripts.seed_stocks

echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
