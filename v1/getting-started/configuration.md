# Configuration & The BYOD Infrastructure Standard

Reyhan Commerce follows the **BYOD (Bring Your Own Database)** infrastructure standard. The framework does not bundle, spawn, or enforce localized database daemons. Instead, it relies on cleanly managed environment variables to connect to your standalone infrastructure instances.

---

## 1. Why PostgreSQL 17+ and Redis 7+ are Mandatory

Reyhan leverages advanced relational and in-memory capabilities that are integral to its headless commerce engine:

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

## 2. Framework Environment Variables (`.env`)

### Database Connection (PostgreSQL 17+)
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

REDIS_DB=0
REDIS_CACHE_DB=0
REDIS_SESSION_DB=1
REDIS_QUEUE_DB=2
```

### SMS Notification Drivers
```ini
SMS_DEFAULT_DRIVER=kavenegar
KAVENEGAR_API_KEY=your_kavenegar_api_token
KAVENEGAR_SENDER_LINE=10008000
```

### Banking & Payment Gateways
```ini
PAYMENT_DEFAULT_DRIVER=zarinpal
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=false
```

---

## 3. Headless API & CORS Configuration

Because Reyhan Commerce is completely headless, configure CORS and Sanctum stateful domains to authorize your decoupled client storefronts (such as Nuxt, Next.js, or mobile clients):

```ini
# Application URL
APP_URL=http://localhost:8000

# Client domains allowed to authenticate via stateful session cookies
SANCTUM_STATEFUL_DOMAINS="localhost:3000,mystore.com"

# Allowed origins for API requests
CORS_ALLOWED_ORIGINS="http://localhost:3000,https://mystore.com"
```

---

## 4. Validating Infrastructure Health

Run the built-in diagnostic tool to verify all database, cache, and filesystem access permissions:

```bash
php artisan reyhan:doctor
```

The doctor command evaluates:
* PHP runtime version and required native C-extensions (`pdo_pgsql`, `redis`, `intl`, `gd`, `bcmath`, `curl`, `pcntl`).
* Live TCP connection and schema readability in PostgreSQL.
* Live Redis ping latency and response validity.
* Storage directory symlinks and write permissions (`storage/app`, `storage/framework`).
