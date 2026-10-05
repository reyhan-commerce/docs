# Core vs. User-Land Boundary

- [Introduction](#introduction)
- [The Boundary Architecture](#boundary-architecture)
- [The Golden Rules of Reyhan Development](#golden-rules)
- [How Customizations Stay Intact](#how-customizations-stay-intact)
- [The Upgrade Safety Guarantee](#upgrade-safety-guarantee)

<a name="introduction"></a>
## Introduction

The primary architectural strength of **Reyhan Commerce** is the clean, unyielding separation between the **Framework Core Package** (`reyhan-commerce/core`) and your **User-Land Store Application** (`app/`, `config/`, `extensions/`).

In legacy e-commerce software, developers routinely modify core controllers, database seeders, or vendor files. When upstream maintainers release security patches or major feature updates, running updates results in merge conflicts, broken logic, and costly manual refactors.

Reyhan permanently eliminates this problem through clean Composer encapsulation, interface contracts, and dynamic runtime bindings.

---

<a name="boundary-architecture"></a>
## The Boundary Architecture

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
│  - app/Models/ (Custom models via Reyhan::useModel)         │
│  - extensions/ (Custom modular plugins & drivers)           │
│  - app/Actions/ (Custom user-land business workflows)       │
│  - config/reyhan.php (Runtime configuration overrides)      │
└─────────────────────────────────────────────────────────────┘
```

---

<a name="golden-rules"></a>
## The Golden Rules of Reyhan Development

To ensure your application remains clean, maintainable, and continuously upgradable, adhere to the following rules:

### Rule 1: Never Touch Vendor Files
Never edit files inside `vendor/reyhan-commerce/core/`. When you need to customize behavior:

* **Add custom columns or methods to models:** Extend the base model in `app/Models/` and register it in `config/reyhan.php`. Read the [Extending Models Guide](/v1/customization/extending-models).
* **Add a custom payment driver:** Implement `GatewayDriverContract` and register it via `Payment::extend()`. Read the [Payment Gateways Guide](/v1/customization/payment-gateways).
* **Add specialized business logic:** Create a single-responsibility Action class in `app/Actions/`.
* **Add modular features:** Place them in `extensions/{plugin-name}/`. Read the [Modular Extensions Guide](/v1/customization/modular-extensions).

### Rule 2: Decoupled Storefront Independence
The frontend presentation layer (such as the official Nuxt 4 storefront) is fully decoupled. It communicates with the backend exclusively through RESTful JSON APIs and WebSocket channels. Frontend updates never risk destabilizing the backend business logic or database schema.

---

<a name="how-customizations-stay-intact"></a>
## How Customizations Stay Intact

Because all core services resolve classes through dynamic registries (`Reyhan::model()`, `Reyhan::payment()`, `Pipeline::through()`), your custom classes seamlessly intercept all domain traffic:

```php
// Your custom logic executes in place of core defaults
$orderModel = Reyhan::model('order'); // Resolves App\Models\CustomOrder
```

---

<a name="upgrade-safety-guarantee"></a>
## The Upgrade Safety Guarantee

Upgrading your store's core engine is as simple as running:

```bash
./reyhan update
# or
composer update reyhan-commerce/core --with-all-dependencies
php artisan migrate --force
php artisan reyhan:doctor
```

This guarantees:
1. **Zero Merge Conflicts:** Core framework improvements are pulled cleanly without touching your repository's files.
2. **Deterministic Migrations:** Database schema updates execute idempotently.
3. **Continuous Compatibility:** Your custom models, pipelines, and extensions remain completely intact.
