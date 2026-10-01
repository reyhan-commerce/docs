# System Health Diagnostics (`doctor`)

The **Reyhan Doctor** command is an enterprise diagnostic tool that prevents obscure runtime crashes by evaluating every infrastructure dependency before deployment.

---

## 1. Running Diagnostics

```bash
./reyhan doctor
```

---

## 2. Diagnostic Checklist Matrix

Reyhan Doctor executes deep diagnostics across 6 critical operational vectors:

```text
[✓] PHP Runtime: PHP 8.3+ detected.
[✓] Required C-Extensions: pdo_pgsql, redis, intl, gd, bcmath, curl, pcntl verified.
[✓] Relational Database: PostgreSQL 17 connected (pg_trgm & GIN support available).
[✓] Memory & Queue Store: Redis 7 ping responsive (latency: 0.4ms).
[✓] Storage & Filesystem: backend/storage writable; public/storage symlink valid.
[✓] Node Ecosystem: Node 20+ and pnpm detected; storefront dependencies in sync.
```

---

## 3. Automated Error Remediation Guidance

If a failure occurs (e.g. database password incorrect or Redis offline), Doctor prints actionable remediation instructions directly in your terminal:

```text
[✗] Redis Connectivity: Connection refused at 127.0.0.1:6379
    -> Tip: Ensure your Redis server daemon is running:
       sudo systemctl start redis-server
    -> Verify credentials in backend/.env (REDIS_HOST, REDIS_PORT)
```
