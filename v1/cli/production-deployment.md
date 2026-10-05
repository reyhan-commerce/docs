# Production Deployment

- [Introduction](#introduction)
- [Automated VPS Deployment (`./reyhan install --prod`)](#automated-deployment)
- [Production Docker Architecture](#docker-architecture)
- [Nginx & Caddy Configuration](#caddy-configuration)
- [Queue Workers with Laravel Horizon](#horizon-workers)
- [High-Traffic Performance Optimization Checklist](#performance-checklist)

<a name="introduction"></a>
## Introduction

When you are ready to deploy your Reyhan Commerce application to production, there are several essential steps you should take to ensure your store runs as efficiently and reliably as possible.

Reyhan Commerce is engineered for containerized cloud deployment using **Docker**, **FrankenPHP / Laravel Octane**, and **Caddy** automated TLS reverse proxying.

---

<a name="automated-deployment"></a>
## Automated VPS Deployment (`./reyhan install --prod`)

To provision a fresh Linux VPS or cloud server:

```bash
./reyhan install --prod
```

This command automatically:
1. Validates host Docker and Docker Compose availability.
2. Generates secure production environment keys.
3. Initializes the FrankenPHP Octane container stack.
4. Provisions automated SSL certificates via Caddy and Let's Encrypt.
5. Executes database migrations and caches config and routes.

---

<a name="docker-architecture"></a>
## Production Docker Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│             Caddy Automatic HTTPS Reverse Proxy             │
│            (Port 80/443 -> Automatic SSL & HTTP/3)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┴──────────────────────┐
        ▼                                             ▼
┌──────────────────────────────┐       ┌──────────────────────────────┐
│  FrankenPHP Octane Worker    │       │   Horizon Queue Workers      │
│   (Backend API & Filament)   │       │   (SMS, Webhooks, Emails)    │
└──────────────┬───────────────┘       └──────────────┬───────────────┘
               │                                      │
               └───────────────────┬──────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 Standalone Enterprise Tier                  │
│       PostgreSQL 17 (DB Engine) + Redis 7 (Queues/Cache)    │
└─────────────────────────────────────────────────────────────┘
```

---

<a name="caddy-configuration"></a>
## Nginx & Caddy Configuration

Reyhan includes a production `Caddyfile` that automatically negotiates Let's Encrypt certificates and routes API and administrative traffic to FrankenPHP:

```caddyfile
api.mystore.com {
    reverse_proxy php:8000
    encode gzip zstd
}
```

---

<a name="horizon-workers"></a>
## Queue Workers with Laravel Horizon

To process background jobs (SMS notifications, stock releases, ledger accounting):

```bash
php artisan horizon
```

---

<a name="performance-checklist"></a>
## High-Traffic Performance Optimization Checklist

Before taking your store live, ensure you have completed the following optimizations:

### 1. Optimize Configuration & Route Loading

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 2. Configure Octane Worker Concurrency
Set `OCTANE_WORKERS` to match `(2 * CPU cores)` in your production `.env` file.

### 3. Enable OPcache & JIT Compilation
Ensure OPcache JIT is enabled in your production PHP INI configuration:

```ini
opcache.enable=1
opcache.jit_buffer_size=100M
opcache.jit=1255
```

### 4. Enable PgBouncer Connection Pooling
For high-traffic deployments with hundreds of concurrent workers, enable PostgreSQL connection pooling via PgBouncer.
