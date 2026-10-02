# Orchestrator CLI Reference (`./reyhan`)

Reyhan includes a unified, executable orchestrator script at the root of your project (`./reyhan`) as well as first-class Artisan commands (`php artisan reyhan:*`). It wraps backend Artisan utilities, Octane daemons, and system health diagnostics into simple, memorable commands.

---

## Command Reference Matrix

| Command | Usage | Description |
| :--- | :--- | :--- |
| `version` | `./reyhan version` | Displays the full version matrix of the core framework, database engine, and active extensions. |
| `doctor` | `./reyhan doctor` | Comprehensive diagnostic testing PHP runtime, PostgreSQL connectivity, Redis latency, and symlinks. |
| `install` | `./reyhan install` | Automates baseline keys generation, database migrations, seeders, storage links, and build assets. |
| `install --prod` | `./reyhan install --prod` | Production installer initializing Docker containers, Caddy reverse-proxy, and Octane servers. |
| `update` | `./reyhan update` | Zero-downtime rolling update with automatic database backup, migrations, and Octane reload. |
| `dev` | `./reyhan dev` | Boots the high-performance local Laravel development server with queue workers and real-time logs. |

---

## Detailed Command Walkthrough

### 1. `./reyhan version`
Outputs a structured summary of your backend engine:
```text
🌿 Reyhan Commerce Orchestrator
Framework Core: v1.0.0 (SemVer)
PHP Version:    8.4.2 (CLI)
Database:       PostgreSQL 17.0 (Connected)
In-Memory:      Redis 7.2.4 (Active)
Extensions:     4 Active Plugins
```

### 2. `./reyhan doctor`
Validates all mandatory dependencies:
```bash
./reyhan doctor
# or
php artisan reyhan:doctor
```

### 3. `./reyhan dev`
Spawns the local development stack:
* `[backend]` `http://localhost:8000` (API & Filament Admin)
* `[queue]` Redis worker listening on `QUEUE_CONNECTION=redis`
