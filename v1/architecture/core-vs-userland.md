# Core vs. User-Land Boundary

The core strength of **Reyhan Commerce** is the unyielding boundary between the **Framework Core Package** and **User-Land Store Applications**.

In traditional e-commerce projects, developers directly modify core controllers, database seeders, or vendor files. When the parent framework publishes a security patch or a major feature update, running `composer update` or `git pull` results in merge conflicts, broken logic, and failed deployments.

Reyhan permanently eliminates this via clean Composer packaging and dynamic runtime binding:

```text
┌─────────────────────────────────────────────────────────────┐
│             reyhan-commerce/core (Vendor Package)           │
│  - Immutable e-commerce engine                              │
│  - Standard REST API contracts & routes (/api/v1)           │
│  - Base models, migrations & Filament admin plugin          │
│  - Upgraded cleanly via: composer update                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
             Overrides & Extends via Clean Contracts
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            User-Land Application (Your Store Code)          │
│  - app/Providers/AppServiceProvider.php (Reyhan::useModel)  │
│  - extensions/ (Custom domain plugins & drivers)            │
│  - app/Actions/ (Custom user-land business workflows)       │
│  - config/reyhan.php (Runtime configuration overrides)      │
└─────────────────────────────────────────────────────────────┘
```

---

## The Golden Rules of Reyhan Development

### Rule 1: Never Touch Vendor Files
Never edit files inside `vendor/reyhan-commerce/core/`. If you need to:
* **Add custom columns/methods to the Product model:** Extend the base model in `app/Models/CustomProduct.php` and register it via `Reyhan::useModel('product', CustomProduct::class)`.
* **Add a custom payment driver:** Extend `Reyhan\Core\Contracts\PaymentDriver` and register it in `config/reyhan.php`.
* **Add specialized business logic:** Create a single-responsibility Action in `app/Actions/`.
* **Add modular features:** Place them in `extensions/your-extension/` with a `module.json` manifest.

### Rule 2: Decoupled Storefront Independence
The frontend storefront (`reyhan-commerce/storefront-nuxt`) is fully decoupled:
* It consumes the backend strictly through standard RESTful JSON APIs and WebSocket channels.
* UI customizations in Nuxt never risk breaking the Laravel backend or database schema.

---

## Upgrade Safety Guarantee

Because custom business logic lives in standard user-land directories (`app/`, `extensions/`, `config/`), upgrading the framework engine is as simple as:

```bash
composer update reyhan-commerce/core --with-all-dependencies
php artisan migrate --force
php artisan reyhan:doctor
```

This guarantees:
1. Zero merge conflicts in vendor code.
2. Safe, incremental schema migrations.
3. Your extended models and plugins continue working seamlessly.
