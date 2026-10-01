# Orchestrator CLI Reference (`./reyhan`)

Reyhan includes a unified, executable orchestrator script at the root of your project (`./reyhan`). It wraps backend Artisan utilities, frontend package scripts, Docker daemons, and system health checks into simple, memorable commands.

---

## Command Reference Matrix

| Command | Usage | Description |
| :--- | :--- | :--- |
| `version` | `./reyhan version` | Displays the full version matrix of the core framework, database engine, and active extensions. |
| `doctor` | `./reyhan doctor` | Comprehensive diagnostic testing PHP runtime, PostgreSQL connectivity, Redis latency, and symlinks. |
| `install` | `./reyhan install` | Automates baseline keys generation, database migrations, seeders, storage links, and build assets. |
| `install --prod` | `./reyhan install --prod` | Production installer initializing Docker containers, Caddy reverse-proxy, and Octane servers. |
| `update` | `./reyhan update` | Zero-downtime rolling update with automatic database backup, migrations, and Octane reload. |
| `dev` | `./reyhan dev` | Concurrently boots both the backend API and storefront development servers. |

---

## Detailed Command Walkthrough

### 1. `./reyhan version`
Outputs a structured summary:
```text
🌿 Reyhan Commerce Orchestrator
Framework Core: v1.0.4 (SemVer)
PHP Version:    8.3.12 (CLI)
Database:       PostgreSQL 17.0 (Connected)
In-Memory:      Redis 7.2.4 (Active)
Extensions:     4 Active Plugins
```

### 2. `./reyhan dev`
Spawns background processes with colored terminal prefixing:
* `[backend]` `http://localhost:8000` (API & Admin)
* `[frontend]` `http://localhost:3000` (Storefront SSR)
