# Configuration & The BYOD Infrastructure Standard

Reyhan Commerce follows the **BYOD (Bring Your Own Database)** infrastructure policy. The framework does not bundle, spawn, or enforce localized database daemons. Instead, it relies on cleanly managed environment variables to connect to your standalone infrastructure instances.

---

## 1. Why PostgreSQL 17+ and Redis 7+ are Mandatory

Reyhan leverages advanced relational and in-memory capabilities that are integral to its commerce engine:

```text
┌─────────────────────────────────────────────────────────────┐
│                 PostgreSQL 17+ Capabilities                 │
│  - JSONB attributes & dynamic variant matrix schemas        │
│  - pg_trgm & GIN indexing for sub-millisecond search        │
│  - Strict isolation levels for checkout inventory locks     │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ Direct Connection via .env
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Redis 7+ Capabilities                    │
│  - Sub-millisecond distributed shopping session cache       │
│  - Horizon background worker queues and telemetry           │
│  - Real-time atomic mutexes for rate limiting & locks       │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Environment Variables (`backend/.env`)

### Database Connection (PostgreSQL)
```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reyhan_commerce
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
```

### Redis In-Memory Infrastructure
```ini
REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```

### SMS Notification Drivers
```ini
SMS_DEFAULT_DRIVER=kavenegar
KAVENEGAR_API_KEY=your_kavenegar_api_token
KAVENEGAR_SENDER_LINE=10008000
```

### Banking & Payment Gateway
```ini
PAYMENT_DEFAULT_DRIVER=zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=false
```

---

## 3. Storefront Environment Variables (`frontend/.env`)

The storefront communicates with the backend via RESTful endpoints authenticated via Sanctum tokens:

```ini
# frontend/.env
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 4. Validating Infrastructure Health

Run the built-in diagnostic tool to verify all database, cache, and filesystem access permissions:

```bash
./reyhan doctor
```

The doctor command evaluates:
* PHP runtime version and required native C-extensions (`pdo_pgsql`, `redis`, etc.).
* Live TCP connection and schema readability in PostgreSQL.
* Live Redis ping latency and response validity.
* Storage directory symlinks and write permissions (`backend/storage`).
* Node.js and package manager version alignment.
