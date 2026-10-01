# Zero-Downtime Safe Updates

Upgrading e-commerce software is historically stressful. Reyhan Commerce eliminates update anxiety through an automated, atomic update pipeline triggered via `./reyhan update`.

---

## 1. The Update Pipeline Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Admin as System Administrator
    participant CLI as ./reyhan update
    participant DB as PostgreSQL 17
    participant Core as Reyhan Framework Core
    participant Octane as FrankenPHP / Octane Workers

    Admin->>CLI: Executes ./reyhan update
    CLI->>DB: Pre-flight Health Check
    CLI->>DB: Generates Compressed Database Snapshot
    CLI->>Core: Pulls SemVer Core Release & Dependencies
    CLI->>DB: Executes New Migrations (php artisan migrate --force)
    CLI->>Core: Upgrades Admin Assets (filament:upgrade)
    CLI->>Core: Flushes & Rebuilds Config, Route & Event Caches
    CLI->>Octane: Sends Graceful SIGUSR1 Signal (Zero-Downtime Reload)
    CLI-->>Admin: Update Complete! Framework Running on New Version.
```

---

## 2. Automatic Pre-Update Backups

Before any database schema change is executed, the update orchestrator invokes `spatie/laravel-backup` to generate an encrypted snapshot of the current PostgreSQL database. If any migration fails, the update process safely terminates with zero data loss.

---

## 3. Running an Update

```bash
./reyhan update
```
