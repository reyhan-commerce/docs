# Installation & Setup

Getting started with **Reyhan Commerce** is designed to be frictionless. You can either scaffold a new store using the interactive NPX initializer or set up an existing workspace using the central orchestrator `./reyhan`.

---

## 1. System Requirements

Before beginning, ensure your host environment meets the following baseline requirements:

* **PHP:** `8.3` or higher (Required extensions: `pdo_pgsql`, `redis`, `intl`, `gd`, `bcmath`, `curl`, `pcntl`)
* **Node.js:** `20.x` or `22.x+` with `pnpm` (version `9.x+`)
* **PostgreSQL:** `17.x` (Mandatory for advanced JSONB, GIN indexing, and trigram text search)
* **Redis:** `7.x+` (Required default driver for Cache, Sessions, and Queues)
* **Composer:** `2.x+`

::: tip Automated Health Check
Run `./reyhan doctor` at any time to verify system requirements, PHP extensions, and database connections automatically.
:::

---

## 2. Quickstart with `create-reyhan`

To scaffold a completely fresh store without manual cloning:

::: code-group
```bash [pnpm]
pnpm create reyhan my-store
```

```bash [npx]
npx create-reyhan@latest my-store
```

```bash [yarn]
yarn create reyhan my-store
```
:::

The installer automatically:
1. Provisions the root workspace structure (`version.json`, `backend/`, `frontend/`, `reyhan`).
2. Installs backend Composer packages and storefront Node dependencies.
3. Generates environment configuration files (`.env`).

---

## 3. Manual Workspace Setup with `./reyhan`

If you are deploying from a cloned repository, execute the following standardized steps:

### Step 1: Configure Environment Variables
Copy and configure the database and Redis credentials in `backend/.env`:

```ini
# backend/.env
APP_NAME="Reyhan Store"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=reyhan_commerce
DB_USERNAME=postgres
DB_PASSWORD=secret

REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=null
```

### Step 2: Validate System Connections
Verify database connectivity and directory permissions using the doctor command:

```bash
./reyhan doctor
```

### Step 3: Run the Automated Installer
The install command handles application keys, migrations, baseline seeders, storage symlinks, and asset compilation:

```bash
./reyhan install
```

::: info Admin Panel Credentials
Upon completion, the installer displays the default administrative console URL (`http://localhost:8000/admin`) and operator credentials.
:::

---

## 4. Starting the Development Environment

Launch the unified development servers (both backend API and frontend storefront concurrently):

```bash
./reyhan dev
```

* **Customer Storefront:** `http://localhost:3000`
* **Admin Console:** `http://localhost:8000/admin`
* **Interactive API Reference:** `http://localhost:8000/docs/api`
