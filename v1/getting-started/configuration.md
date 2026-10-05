# Configuration

- [Introduction](#introduction)
- [Environment Configuration](#environment-configuration)
    - [Determining Current Environment](#determining-environment)
- [Database Configuration (PostgreSQL 17+)](#database-configuration)
- [Redis Infrastructure Configuration](#redis-configuration)
- [SMS Notification Driver Configuration](#sms-configuration)
- [Payment Gateway Configuration](#payment-configuration)
- [Headless API, CORS & Sanctum Domains](#cors-and-sanctum)
- [Maintenance Mode & Doctor Diagnostics](#diagnostics)

<a name="introduction"></a>
## Introduction

All configuration files for the Reyhan Commerce framework are stored in the `config` directory. Each option is documented, so feel free to look through the files and get familiar with the options available to you.

Reyhan Commerce adheres strictly to the **BYOD (Bring Your Own Database)** infrastructure standard. The framework does not spawn local database daemons; instead, it relies cleanly on standard environment variables to connect to your database and Redis clusters.

---

<a name="environment-configuration"></a>
## Environment Configuration

It is often helpful to have different configuration values based on the environment where the application is running. For example, you may wish to use a local Redis server locally while utilizing a managed cloud cluster on production.

To make this easy, Reyhan utilizes the [DotEnv](https://github.com/vlucas/phpdotenv) PHP library. In a fresh installation, the root directory of your application will contain a `.env.example` file that defines many common environment variables.

<a name="determining-environment"></a>
### Determining Current Environment

The current application environment is determined via the `APP_ENV` variable from your `.env` file:

```ini
APP_NAME="Reyhan Store"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000
```

---

<a name="database-configuration"></a>
## Database Configuration (PostgreSQL 17+)

Reyhan Commerce leverages PostgreSQL 17+ features—including JSONB attribute matrices, GIN indices, and `pg_trgm` fuzzy text search:

```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reyhan_commerce
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password
```

> [!NOTE]  
> If you are using MySQL 8.0+ or SQLite for local prototyping, set `DB_CONNECTION=mysql` or `DB_CONNECTION=sqlite`. PostgreSQL remains the recommended production database for advanced JSONB operations.

---

<a name="redis-configuration"></a>
## Redis Infrastructure Configuration

Redis 7+ powers sub-millisecond shopping cart caching, distributed customer sessions, Horizon queue workers, and atomic stock reservation locks:

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

---

<a name="sms-configuration"></a>
## SMS Notification Driver Configuration

Configure your default transactional SMS gateway provider in `.env`:

```ini
SMS_DEFAULT_DRIVER=kavenegar

# Kavenegar Credentials
KAVENEGAR_API_KEY=your_kavenegar_api_key
KAVENEGAR_SENDER_LINE=10008000

# FarazSMS / IPPanel Credentials
FARAZSMS_API_KEY=your_farazsms_api_key
FARAZSMS_PATTERN_CODE=12345
```

---

<a name="payment-configuration"></a>
## Payment Gateway Configuration

Configure default Iranian banking gateways and merchant credentials:

```ini
PAYMENT_DEFAULT_DRIVER=zarinpal

# Zarinpal Gateway
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ZARINPAL_SANDBOX=false

# Saman (SEP) Gateway
SEP_TERMINAL_ID=12345678
SEP_TERMINAL_PASSWORD=secret
```

---

<a name="cors-and-sanctum"></a>
## Headless API, CORS & Sanctum Domains

Because Reyhan Commerce functions as a decoupled headless backend, configure CORS and Sanctum stateful domains to allow your frontend applications (Nuxt, Next.js, or mobile clients) to make authorized requests:

```ini
# Client domains allowed to authenticate via stateful session cookies
SANCTUM_STATEFUL_DOMAINS="localhost:3000,mystore.com"

# Allowed origins for CORS API requests
CORS_ALLOWED_ORIGINS="http://localhost:3000,https://mystore.com"
```

---

<a name="diagnostics"></a>
## Maintenance Mode & Doctor Diagnostics

To verify that your environment variables, database connections, and cache layers are configured correctly:

```bash
php artisan reyhan:doctor
```
