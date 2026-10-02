# Installation & Setup

Getting started with **Reyhan Commerce** is designed to be frictionless for PHP and Laravel developers. You can either scaffold a new store using the global **Composer CLI Installer** (`reyhan new`), create a project via `composer create-project`, or set up an existing workspace using the central orchestrator `./reyhan`.

---

## 1. System Requirements

Reyhan's headless engine requires **zero Node.js dependencies** to run the backend and administrative backoffice:

* **PHP:** `8.3` or `8.4+` (Required extensions: `pdo_pgsql`, `redis`, `intl`, `gd`, `bcmath`, `curl`, `pcntl`)
* **Composer:** `2.x+`
* **PostgreSQL:** `17.x` (Mandatory for JSONB variant matrices, GIN indices, and `pg_trgm` fuzzy text search)
* **Redis:** `7.x+` (Required default driver for Cache, Sessions, Queues, and atomic inventory mutexes)

::: tip Automated Health Check
Run `./reyhan doctor` or `php artisan reyhan:doctor` at any time to verify system requirements, PHP extensions, and database connections automatically.
:::

---

## 2. Option A: The Reyhan Global CLI Installer (Recommended)

Just like the official Laravel Installer, install the Reyhan CLI globally via Composer:

```bash
composer global require reyhan-commerce/installer
```

Ensure your global Composer `bin` directory is in your `$PATH` (`~/.config/composer/vendor/bin` or `~/.composer/vendor/bin`).

Now scaffold a new store with an interactive terminal UI powered by **Laravel Prompts**:

```bash
reyhan new my-store
```

The installer will ask:
1. **Database engine**: PostgreSQL 17+ (recommended), MySQL, or SQLite.
2. **Catalog seeding**: Automatically run migrations and seed provinces, cities, cosmetics/fashion categories, and demo products.

### Non-Interactive / Automation Flags

For automated CI/CD environments and Docker provisioning:

```bash
# Provision with PostgreSQL and automatic demo catalog seed
reyhan new my-store --pgsql --seed --no-interaction

# Rapid local prototyping with SQLite
reyhan new test-store --sqlite --seed --no-interaction
```

---

## 3. Option B: Direct `composer create-project`

If you prefer not to install global CLI tools, you can create a new project in one command:

```bash
composer create-project reyhan-commerce/reyhan my-store
```

Then enter the project and start development:

```bash
cd my-store
php artisan migrate --seed
php artisan serve
```

---

## 4. Admin Panel & API Verification

Once launched, your headless store is immediately operational out of the box:

* **Filament Admin Backoffice:** `http://localhost:8000/admin` (Default credentials: `admin@reyhan.test` / `password`)
* **Interactive OpenAPI Reference:** `http://localhost:8000/docs/api` (Rendered via Scalar API Reference)
* **Health Diagnostics:** `php artisan reyhan:doctor`

---

## 5. Connecting a Frontend Storefront

Reyhan Commerce is completely headless. The backend provides RESTful JSON APIs and WebSocket channels that can power any presentation layer:

* **Official Nuxt 4 Storefront (Decoupled Repo):** `reyhan-commerce/storefront-nuxt`
* **Mobile Applications:** Flutter, React Native, or iOS/Android native apps
* **Next.js / Svelte / Remix:** Connect using standard REST APIs and `@nuxtjs/sitemap` endpoints
* **Telegram Mini Apps:** Native mobile shopping via Telegram WebApp SDK
