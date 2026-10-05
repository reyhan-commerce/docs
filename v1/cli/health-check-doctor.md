# System Health Diagnostics (`doctor`)

- [Introduction](#introduction)
- [Running Diagnostics](#running-diagnostics)
- [Diagnostic Checklist](#diagnostic-checklist)
- [Automated Remediation Guidance](#remediation-guidance)
- [CI/CD Automated Verification](#ci-cd-verification)

<a name="introduction"></a>
## Introduction

Deploying e-commerce applications without verifying underlying system dependencies, native PHP extensions, and database permissions can lead to unexpected runtime outages.

The **Reyhan Doctor** command is an enterprise diagnostic tool that evaluates every infrastructure component before you launch or deploy your store.

---

<a name="running-diagnostics"></a>
## Running Diagnostics

You can invoke the doctor command via the root orchestrator binary or Artisan:

```bash
./reyhan doctor
# or
php artisan reyhan:doctor
```

---

<a name="diagnostic-checklist"></a>
## Diagnostic Checklist

Reyhan Doctor executes deep checks across all critical operational vectors:

```text
  ✔ PHP Runtime: PHP 8.4.2 detected
  ✔ Required Extensions: pdo_pgsql, redis, intl, gd, bcmath, curl, pcntl verified
  ✔ Relational Database: PostgreSQL 17 connected (pg_trgm & GIN available)
  ✔ In-Memory & Queues: Redis 7 ping responsive (0.3ms latency)
  ✔ Storage Permissions: storage/app and storage/framework writable
  ✔ Filesystem Symlink: public/storage symlink valid
  ✔ Encryption Cipher: APP_KEY configured properly
```

---

<a name="remediation-guidance"></a>
## Automated Remediation Guidance

If a failure is detected, Reyhan Doctor outputs actionable instructions to resolve the issue immediately:

```text
  ✖ Redis Connectivity: Connection refused at 127.0.0.1:6379
    -> Remediation: Start the Redis server service:
       sudo systemctl start redis-server
    -> Verify credentials in .env (REDIS_HOST, REDIS_PORT)
```

---

<a name="ci-cd-verification"></a>
## CI/CD Automated Verification

You can include `./reyhan doctor` in your CI/CD test pipelines. The command returns an exit code of `0` on success and `1` on failure, allowing automated deployment gates to halt if requirements are unmet.
