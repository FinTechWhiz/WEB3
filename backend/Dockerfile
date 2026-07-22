FROM python:3.12-slim

WORKDIR /app

# Build deps for psycopg's C extension, removed after install to keep the
# image small.
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
RUN chmod +x start.sh

EXPOSE 8000

# start.sh runs migrations + seeding (both idempotent) before booting the
# server, and reads $PORT if the host sets one (Render, Railway, etc. all
# assign a dynamic port — hardcoding 8000 would fail on those platforms).
CMD ["./start.sh"]
