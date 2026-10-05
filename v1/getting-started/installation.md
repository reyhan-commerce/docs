# Installation

- [Introduction](#introduction)
- [Server Requirements](#server-requirements)
- [Creating a Reyhan Application](#creating-a-reyhan-application)
    - [Option 1: The Reyhan Installer (Recommended)](#the-reyhan-installer)
    - [Option 2: Via Composer Create-Project](#via-composer-create-project)
- [Initial Configuration & Database Migration](#initial-configuration)
- [Running the Local Development Server](#local-development-server)
- [Verifying System Health (`doctor`)](#system-health-doctor)
- [Connecting a Storefront](#connecting-a-storefront)

<a name="introduction"></a>
## Introduction

Getting started with **Reyhan Commerce** is designed to be frictionless for PHP and Laravel developers. You can either scaffold a new store using the global **Composer CLI Installer** (`reyhan new`), create a project via `composer create-project`, or launch development using the root orchestrator `./reyhan`.

---

<a name="server-requirements"></a>
## Server Requirements

The Reyhan Commerce backend and Filament administration panel require **zero Node.js dependencies** to run:

* **PHP:** `8.3` or `8.4+`
  * Required extensions: `pdo_pgsql` (or `pdo_mysql`), `redis`, `intl`, `gd`, `bcmath`, `curl`, `pcntl`, `mbstring`, `xml`
* **Composer:** `2.x+`
* **PostgreSQL:** `17.x` (Recommended for native JSONB attribute matrices, GIN indices, and `pg_trgm` fuzzy search)
* **Redis:** `7.x+` (Default driver for Cart caching, distributed sessions, and atomic inventory mutexes)

> [!TIP]  
> You can run `./reyhan doctor` or `php artisan reyhan:doctor` at any time to verify system requirements, PHP extensions, and database connections automatically.

---

<a name="creating-a-reyhan-application"></a>
## Creating a Reyhan Application

<a name="the-reyhan-installer"></a>
### Option 1: The Reyhan Installer (Recommended)

First, install the Reyhan CLI installer globally via Composer:

```bash
composer global require reyhan-commerce/installer
```

Ensure your global Composer `bin` directory is in your system's `$PATH` variable (`~/.config/composer/vendor/bin` or `~/.composer/vendor/bin`).

Once installed, use the `reyhan new` command to scaffold a new store:

```bash
reyhan new my-store
```

The interactive installer (powered by Laravel Prompts) will guide you through:
1. **Database engine selection:** PostgreSQL 17+ (Recommended), MySQL 8.0+, or SQLite.
2. **Catalog seeding:** Automatically running database migrations and seeding Iranian provinces, cities, categories, and sample products.

```text
  ██████╗ ███████╗██╗   ██╗██╗  ██╗ █████╗ ███╗   ██╗
  ██╔══██╗██╔════╝╚██╗ ██╔╝██║  ██║██╔══██╗████╗  ██║
  ██████╔╝█████╗   ╚████╔╝ ███████║███████║██╔██╗ ██║
  ██╔══██╗██╔══╝    ╚██╔╝  ██╔══██║██╔══██║██║╚██╗██║
  ██║  ██║███████╗   ██║   ██║  ██║██║  ██║██║ ╚████║
  ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝

  Reyhan Commerce — Modern Headless E-Commerce Framework

  ? Select primary database engine:
  ❯ PostgreSQL 17+ (Recommended: Native JSONB matrices & pg_trgm)
    MySQL 8.0+ / MariaDB
    SQLite (Local development & testing)

  ? Seed initial Iranian commerce catalog (provinces, categories, sample products)? (yes/no) [yes]:
  ❯ yes
```

#### Non-Interactive / CI/CD Automation Flags

For automated CI/CD pipelines, Docker provisioning, or rapid scripting:

```bash
# Provision PostgreSQL store with demo catalog seeding
reyhan new my-store --pgsql --seed --no-interaction

# Rapid local prototyping with SQLite
reyhan new test-store --sqlite --seed --no-interaction
```

<a name="via-composer-create-project"></a>
### Option 2: Via Composer Create-Project

Alternatively, you can create a project using Composer directly:

```bash
composer create-project reyhan-commerce/reyhan my-store
```

---

<a name="initial-configuration"></a>
## Initial Configuration & Database Migration

Navigate to your newly created store directory:

```bash
cd my-store
```

The installer automatically configures your `.env` file and generates your application encryption key (`APP_KEY`).

If you need to run or re-run database migrations and demo seeders manually:

```bash
php artisan migrate --seed
```

---

<a name="local-development-server"></a>
## Running the Local Development Server

You can start the local development server using the unified Reyhan CLI or standard Artisan:

```bash
./reyhan dev
# or
php artisan serve
```

Once started, the following services are available immediately:

* **Admin Backoffice:** `http://localhost:8000/admin`
  * Default staff credentials: `admin@reyhan.test` / `password`
* **Interactive OpenAPI Reference:** `http://localhost:8000/docs/api` (Rendered via Scramble / Scalar)
* **RESTful Headless API Base:** `http://localhost:8000/api/v1`

---

<a name="system-health-doctor"></a>
## Verifying System Health (`doctor`)

To diagnose your environment, verify PostgreSQL connectivity, check Redis latency, and inspect runtime extensions:

```bash
./reyhan doctor
# or
php artisan reyhan:doctor
```

```text
  Reyhan Framework Health & Environment Doctor

  ✔ PHP Version (8.4.2)
  ✔ PostgreSQL 17 Connection (Latency: 0.8ms)
  ✔ Redis 7 Connection (Latency: 0.3ms)
  ✔ BCMath Extension
  ✔ Intl Extension (fa_IR locale support)
  ✔ Storage & Cache Permissions

  Result: All systems operational. Your environment is production-ready.
```

---

<a name="connecting-a-storefront"></a>
## Connecting a Storefront

Reyhan operates as a decoupled headless backend engine. You can connect any frontend presentation layer:

* **Official Nuxt 4 Storefront:** Maintained in the dedicated `reyhan-commerce/storefront-nuxt` repository.
* **Mobile Apps:** Flutter, React Native, or Native iOS/Android apps via the REST API.
* **Modern Web Frameworks:** Next.js, SvelteKit, Astro, or Remix.
* **Telegram Mini Apps:** Native mobile storefronts embedded directly in Telegram bots.
