# Directory Anatomy

A Reyhan Commerce deployment is structured into clean, decoupled repositories and domains. The consumer store skeleton (`reyhan-commerce/reyhan`) cleanly separates application customizations from the immutable framework core (`reyhan-commerce/core`).

---

## 🏛️ Ecosystem Architecture

The Reyhan Commerce ecosystem consists of 5 dedicated repositories:

```text
┌─────────────────────────────────────────────────────────────┐
│                 reyhan-commerce/installer                    │
│  Composer Global CLI Scaffolder: `reyhan new my-store`      │
└──────────────────────────────┬──────────────────────────────┘
                               │ provisions
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   reyhan-commerce/reyhan                    │
│  Turnkey Application Skeleton (Standard Laravel 13 layout)  │
│  Contains app/, config/, database/, extensions/             │
└──────────────────────────────┬──────────────────────────────┘
                               │ requires via Composer
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    reyhan-commerce/core                     │
│  Sovereign Commerce Engine Package (Models, Facades,        │
│  Pipelines, Double-Entry Ledger, Filament Admin Plugin)     │
└─────────────────────────────────────────────────────────────┘
                               ▲
                               │ RESTful API / WebSockets
                               ▼
┌─────────────────────────────────────────────────────────────┐
│               reyhan-commerce/storefront-nuxt               │
│  Decoupled Nuxt 4 Storefront (Tailwind 4, Pinia, Nuxt UI)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Store Application Directory Structure (`reyhan-commerce/reyhan`)

When you create a new store via `reyhan new my-store` or `composer create-project reyhan-commerce/reyhan`, the generated application has the familiar, clean structure of a standard Laravel application:

```text
my-store/
├── app/
│   ├── Actions/                     # User-land domain action classes
│   ├── Data/                        # Strongly-typed Data Transfer Objects (DTOs)
│   ├── Models/                      # Extended custom Eloquent models
│   └── Providers/
│       ├── AppServiceProvider.php   # Model bindings (Reyhan::useModel)
│       └── Filament/
│           └── AdminPanelProvider.php # Filament admin panel configuration
├── config/
│   └── reyhan.php                   # Core model registries, gateways & pipeline configs
├── database/
│   ├── migrations/                  # User-land migrations
│   └── seeders/                     # Initial catalog & store demo seeders
├── extensions/                      # Modular plugins (auto-discovered via module.json)
├── routes/
│   ├── api.php                      # Custom user-land API endpoints
│   └── web.php
├── vendor/
│   └── reyhan-commerce/
│       └── core/                    # Immutable framework library
├── .env.example
├── artisan                          # Laravel Artisan CLI
└── composer.json                    # Declares dependency on reyhan-commerce/core
```

---

## 🛍️ Decoupled Storefront Directory Structure (`storefront-nuxt`)

The official reactive frontend is completely decoupled in its own repository:

```text
storefront-nuxt/
├── app/
│   ├── assets/                      # Tailwind CSS v4 stylesheets & Vazirmatn font
│   ├── components/                  # Nuxt UI components (Cart, Catalog, Product, Checkout)
│   ├── composables/                 # Central useApi, useCart, usePersian
│   ├── layouts/                     # Layout templates (default, auth, minimal)
│   ├── middleware/                  # Sanctum route auth guards
│   ├── pages/                       # Dynamic SSR routes (index, products, checkout, profile)
│   └── stores/                      # Pinia reactive state (auth, cart, catalog)
├── nuxt.config.ts                   # Nuxt 4 configuration, SEO & runtime env
├── package.json
└── tsconfig.json
```

---

## 🔒 Architectural Boundaries

### 1. `vendor/reyhan-commerce/core` (Immutable Engine)
The framework engine is installed as a Composer dependency. It manages core migrations, API route definitions (`/api/v1/*`), domain facades, and the Filament admin plugin. You never edit code in `vendor/`.

### 2. `extensions/` (The Extension & Plugin Directory)
Custom modular extensions (such as specialized payment gateways, CRM synchronizers, or custom ERP exports) are placed in `extensions/` and automatically discovered.

### 3. `Reyhan::useModel()` (Dynamic Model Extensibility)
If your store requires custom attributes on `Product`, `Order`, or `User`, extend the base model in `app/Models/` and register it in `AppServiceProvider`:
```php
Reyhan::useModel('product', \App\Models\CustomProduct::class);
```
Every relationship, facade, and pipeline inside Reyhan Core will resolve your extended model.
