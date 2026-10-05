# Orchestrator CLI Reference

- [Introduction](#introduction)
- [Available Commands](#available-commands)
- [Command Deep Dive](#command-deep-dive)
    - [`./reyhan version`](#cmd-version)
    - [`./reyhan doctor`](#cmd-doctor)
    - [`./reyhan dev`](#cmd-dev)
    - [`./reyhan install`](#cmd-install)
    - [`./reyhan update`](#cmd-update)

<a name="introduction"></a>
## Introduction

Reyhan Commerce includes a unified executable binary in the root of your project (`./reyhan`) as well as first-class Artisan commands (`php artisan reyhan:*`). It simplifies daily developer workflows, production deployments, and maintenance tasks into expressive, easy-to-remember commands.

---

<a name="available-commands"></a>
## Available Commands

| Command | Syntax | Purpose |
| :--- | :--- | :--- |
| `version` | `./reyhan version` | Displays framework version matrix, PHP runtime, database status, and active extensions. |
| `doctor` | `./reyhan doctor` | Diagnoses PostgreSQL connectivity, Redis latency, PHP C-extensions, and filesystem permissions. |
| `dev` | `./reyhan dev` | Starts local backend development server, queue workers, and API documentation endpoints. |
| `install` | `./reyhan install` | Automates local environment provisioning (encryption keys, migrations, demo seeders). |
| `install --prod` | `./reyhan install --prod` | Production automated VPS installer initializing Docker, Caddy TLS, and worker-mode runtimes. |
| `update` | `./reyhan update` | Performs zero-downtime framework updates with automated database backup and migration. |

---

<a name="command-deep-dive"></a>
## Command Deep Dive

<a name="cmd-version"></a>
### `./reyhan version`

Displays a structured overview of your application runtime:

```bash
./reyhan version
```

```text
  Reyhan Commerce Unified Orchestrator
  Framework Core: v1.0.0 (SemVer)
  Laravel Engine: v13.17.0
  PHP Runtime:    8.4.2 (CLI)
  Database:       PostgreSQL 17.0 (Connected)
  In-Memory:      Redis 7.2.4 (Active)
  Extensions:     3 Active Plugins
```

<a name="cmd-doctor"></a>
### `./reyhan doctor`

Runs an automated system diagnostic check:

```bash
./reyhan doctor
```

<a name="cmd-dev"></a>
### `./reyhan dev`

Starts the local development server:

```bash
./reyhan dev
```

* API Endpoints: `http://localhost:8000/api/v1`
* Interactive OpenAPI Docs: `http://localhost:8000/docs/api`
* Filament Backoffice: `http://localhost:8000/admin`

<a name="cmd-install"></a>
### `./reyhan install`

Provisions a fresh installation with database migrations, demo catalog data, and encryption keys:

```bash
./reyhan install
```

<a name="cmd-update"></a>
### `./reyhan update`

Executes an automated rolling framework update with database snapshots:

```bash
./reyhan update
```
