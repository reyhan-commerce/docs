# Upgrade Guide

- [Introduction](#introduction)
- [Release Frequency & SemVer Support](#release-frequency)
- [Upgrading to 1.0.0 from Legacy Skeleton](#upgrade-1.0.0)
    - [Dependency & Namespace Migration](#namespace-migration)
    - [Admin Panel & Plugin Registration](#admin-plugin-registration)
    - [Action Signatures & Dynamic Contracts](#action-signatures)
    - [Automated Migrations](#automated-migrations)
- [Automated Updates via CLI (`./reyhan update`)](#automated-updates)

<a name="introduction"></a>
## Introduction

This guide outlines breaking changes, deprecations, database migrations, and step-by-step procedures for upgrading your Reyhan Commerce applications between releases.

---

<a name="release-frequency"></a>
## Release Frequency & SemVer Support

Reyhan Commerce adheres strictly to **Semantic Versioning (SemVer)**:

- **Major Releases (`X.0.0`)**: May include breaking changes, signature alterations to public interfaces/actions, or architectural decoupling.
- **Minor Releases (`1.X.0`)**: Deliver new domain features, payment/logistics drivers, new pipeline stages, and additive non-breaking database schema changes.
- **Patch Releases (`1.0.X`)**: Provide critical security fixes, tax calculation patches, and performance optimizations with 100% backward compatibility.

---

<a name="upgrade-1.0.0"></a>
## Upgrading to 1.0.0 from Legacy Skeleton

**Estimated Upgrade Duration**: 10 – 15 minutes  
**Impact Level**: High

The `v1.0.0` milestone transforms Reyhan from a monolithic starter kit into an **independent, upstream-upgradable e-commerce framework (`reyhan-commerce/core`)**.

<a name="namespace-migration"></a>
### Dependency & Namespace Migration

All core e-commerce classes previously residing under `App\` have moved to the framework vendor namespace `Reyhan\Core\`:

| Previous Class | New Framework Class |
| :--- | :--- |
| `App\Models\Order` | `Reyhan\Core\Models\Order` |
| `App\Models\Product` | `Reyhan\Core\Models\Product` |
| `App\Models\Cart` | `Reyhan\Core\Models\Cart` |
| `App\Actions\Checkout\CreateOrderAction` | `Reyhan\Core\Actions\Checkout\CreateOrderAction` |
| `App\Pipelines\Checkout\OrderCreationPipeline` | `Reyhan\Core\Pipelines\Checkout\OrderCreationPipeline` |

Update your namespace imports in your application's `app/` directory:

```php
// [Before]
use App\Models\Product;
use App\Actions\Checkout\CreateOrderAction;

// [After]
use Reyhan\Core\Models\Product;
use Reyhan\Core\Actions\Checkout\CreateOrderAction;
```

<a name="admin-plugin-registration"></a>
### Admin Panel & Plugin Registration

Core Filament resources, pages, and widgets are now distributed via the official `ReyhanCorePlugin`.

In `app/Providers/Filament/AdminPanelProvider.php`, register the plugin:

```php
use Filament\Panel;
use Reyhan\Core\ReyhanCorePlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        ->default()
        ->id('admin')
        ->path('admin')
        // Automatically registers all core e-commerce resources & widgets
        ->plugin(ReyhanCorePlugin::make())
        // Discover any custom userland resources created in app/Filament
        ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
        ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages');
}
```

<a name="action-signatures"></a>
### Action Signatures & Dynamic Contracts

`CreateOrderAction::execute()` now accepts `UserContract|User` instead of a concrete class, permitting seamless substitution of customized customer models:

```php
// [Before]
public function execute(User $user, CreateOrderData $data): CreateOrderResultData

// [After]
public function execute(UserContract|User $user, CreateOrderData $data): CreateOrderResultData
```

<a name="automated-migrations"></a>
### Automated Migrations

Core database migrations are loaded automatically from the framework package. You no longer need to copy migration files into your root `database/migrations` directory.

Run pending migrations:

```bash
php artisan migrate --force
```

---

<a name="automated-updates"></a>
## Automated Updates via CLI (`./reyhan update`)

Reyhan includes an automated update command to streamline upstream package updates:

```bash
./reyhan update
```

This command executes the following zero-downtime routine:
1. Puts the application into maintenance mode (`php artisan down`).
2. Pulls upstream packages via Composer.
3. Automatically executes database migrations (`php artisan migrate --force`).
4. Recompiles and publishes updated assets.
5. Clears stale application, route, and Redis caches.
6. Restores application traffic (`php artisan up`).
