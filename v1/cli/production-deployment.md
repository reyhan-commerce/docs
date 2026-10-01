# Production & Docker Deployment

Reyhan Commerce is engineered for enterprise-grade containerized deployment using **Docker**, **FrankenPHP / Octane**, and **Caddy** automated SSL reverse-proxying.

---

## 1. Single-Command Production Setup

To provision a live VPS or cloud server:

```bash
./reyhan install --prod
```

This command automatically:
1. Validates host Docker daemon and Compose availability.
2. Configures production `.env` parameters (generating 64-byte cryptographic keys).
3. Spawns high-performance FrankenPHP workers with in-memory application caching.
4. Initializes Caddy with automatic Let's Encrypt TLS certificate provisioning.

---

## 2. Production Docker Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│             Caddy Automatic HTTPS Reverse Proxy             │
│            (Port 80/443 -> Automatic SSL & HTTP/3)          │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│  FrankenPHP Octane Worker    │        │    Storefront SSR Worker     │
│   (Backend API & Admin)      │        │       (Nuxt 4 Node / Nitro)  │
└──────────────┬───────────────┘        └──────────────┬───────────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 Standalone Enterprise Tier                  │
│       PostgreSQL 17 (DB Engine) + Redis 7 (Queues/Cache)    │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. High-Traffic Optimization Checklist

* **Octane Workers:** Set `OCTANE_WORKERS` to match `(2 * CPU cores)`.
* **Redis Persistence:** Enable AOF (Append Only File) persistence on your Redis host.
* **OPcache:** Ensure JIT (Just-In-Time) compilation is active in production PHP INI.
