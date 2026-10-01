# Directory Anatomy

A Reyhan Commerce project is structured into clear, decoupled domains. The top-level workspace cleanly segregates the framework's core runtime from the user-land customization layers.

---

## High-Level Tree Structure

```text
reyhan-store/
├── version.json                     # Semantic versioning manifest (SemVer)
├── reyhan                           # Central executable CLI orchestrator
│
├── backend/                         # Headless Commerce Engine (PHP 8.3+)
│   ├── app/
│   │   ├── Actions/                 # Single-responsibility domain action classes
│   │   ├── Data/                    # Strongly-typed Data Transfer Objects (DTOs)
│   │   ├── Models/                  # Eloquent models (swappable via contracts)
│   │   ├── Support/
│   │   │   └── Reyhan.php           # Central model resolver facade (Reyhan::model)
│   │   └── Services/
│   │       ├── Normalization/       # Text & digit cleaning pipeline
│   │       └── Sms/                 # Driver-based SMS manager & notification channels
│   ├── config/
│   │   └── reyhan.php               # Core model registries, gateways & pipeline configs
│   ├── database/
│   │   ├── migrations/              # PostgreSQL schema blueprints (JSONB, pg_trgm)
│   │   └── seeders/                 # Initial catalog & permissions seeders
│   └── extensions/                  # User-land plugins (auto-discovered via module.json)
│
└── frontend/                        # Reactive Storefront Engine
    ├── app/
    │   ├── app.config.ts            # Brand identity, theme tokens, announcement bar
    │   ├── components/              # Cascading user-land component overrides
    │   ├── layouts/                 # Cascading storefront layouts (default, checkout)
    │   ├── pages/                   # User-land custom pages & overrides
    │   ├── stores/                  # Pinia stores (useCartStore, useAuthStore)
    │   └── locales/                 # Localization dictionaries (en.json, fa.json)
    └── nuxt.config.ts               # Storefront build configuration & module bindings
```

---

## Architectural Boundaries

### 1. `version.json` (The Core Version Manifest)
This file tracks the exact semantic version (`major.minor.patch`) of the Reyhan framework core. When you execute `./reyhan update`, this manifest determines the upgrade path and necessary schema migrations.

### 2. `backend/extensions/` (The Plugin Directory)
Any custom feature, integration, or custom admin panel resource should be placed in its own modular folder inside `backend/extensions/`. Each extension provides a `module.json` manifest that is auto-discovered by the `ModuleManager`.

### 3. `frontend/app/` (The User-Land Storefront)
Any component placed inside `frontend/app/components/` with the same name as a core component (e.g., `ProductCard.vue` or `PriceTag.vue`) automatically takes precedence, replacing the default implementation across all storefront pages.
