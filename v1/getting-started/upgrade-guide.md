# 🔄 Reyhan Commerce Upgrade Guide

This guide outlines breaking changes, deprecations, database migrations, and step-by-step procedures for upgrading your Reyhan Commerce applications between releases.

---

## Upgrade Philosophy & Standards

Reyhan adheres strictly to **Semantic Versioning (SemVer)**:
- **Major Releases (`X.0.0`)**: May include breaking changes, signature alterations to public interfaces/actions, or architectural decoupling.
- **Minor Releases (`1.X.0`)**: Deliver new domain features, payment/logistics drivers, new pipeline stages, and additive non-breaking database schema changes.
- **Patch Releases (`1.0.X`)**: Provide critical security fixes, tax calculation patches, and performance optimizations with 100% backward compatibility.

### Change Impact Categories

| Level | Symbol | Description |
| :--- | :---: | :--- |
| **High** | 🔴 | Breaking changes affecting public contracts, required parameters, or namespaces that require manual developer updates. |
| **Medium** | 🟡 | Deprecations, altered event payloads, or optional config additions that should be reviewed. |
| **Low** | 🟢 | Transparent bug fixes, new database columns with safe defaults, and optimizations requiring no user action. |

---

## Upgrading from Pre-Release Monolith to v1.0.0 (Framework Decoupling)

**Estimated Upgrade Duration**: 10 – 15 minutes  
**Impact Level**: 🔴 High  

The `v1.0.0` milestone transforms Reyhan from a monolithic Starter Kit into an **independent, upstream-upgradable e-commerce framework (`reyhan-commerce/core`)**.

### 1. Dependency & Namespace Migration (High Impact 🔴)

#### Direct Namespace Relocation
All core e-commerce classes previously residing under `App\` have moved to the framework vendor namespace `Reyhan\Core\`:

| Previous Monolithic Class | New Official Framework Class |
| :--- | :--- |
| `App\Models\Order` | `Reyhan\Core\Models\Order` |
| `App\Models\Product` | `Reyhan\Core\Models\Product` |
| `App\Models\Cart` | `Reyhan\Core\Models\Cart` |
| `App\Actions\Checkout\CreateOrderAction` | `Reyhan\Core\Actions\Checkout\CreateOrderAction` |
| `App\Pipelines\Checkout\OrderCreationPipeline` | `Reyhan\Core\Pipelines\Checkout\OrderCreationPipeline` |
| `App\Support\Reyhan` | `Reyhan\Core\Support\Reyhan` |

In your user application code (`app/`), update any direct imports referencing the former `App\` domain classes:

```php
// [Before]
use App\Models\Product;
use App\Actions\Checkout\CreateOrderAction;

// [After]
use Reyhan\Core\Models\Product;
use Reyhan\Core\Actions\Checkout\CreateOrderAction;
```

#### Userland User Model Extension
To allow custom relationships (e.g. organizational departments, custom roles) without mutating vendor files, your application's `app/Models/User.php` now inherits from `Reyhan\Core\Models\User`:

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Reyhan\Core\Models\User as BaseUser;

class User extends BaseUser
{
    // Custom userland relationships and domain methods
}
```

---

### 2. Admin Panel & Filament Plugin Registration (High Impact 🔴)

Core Filament resources, pages, and widgets are now distributed via the official `ReyhanCorePlugin`.

In `app/Providers/Filament/AdminPanelProvider.php`, replace raw resource discovery with the plugin registration:

```php
use Reyhan\Core\ReyhanCorePlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        ->default()
        ->id('admin')
        ->path('admin')
        // Automatically registers all 22+ e-commerce resources, widgets & pages
        ->plugin(ReyhanCorePlugin::make())
        // Discover any custom userland resources created in app/Filament
        ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
        ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages');
}
```

---

### 3. Action Signatures & Contract Binding (Medium Impact 🟡)

#### `CreateOrderAction` Signature
`CreateOrderAction::execute()` now accepts `UserContract|User` instead of a concrete class, permitting seamless substitution of customized customer models:

```php
// [Before]
public function execute(User $user, CreateOrderData $data): CreateOrderResultData

// [After]
public function execute(UserContract|User $user, CreateOrderData $data): CreateOrderResultData
```

#### Eloquent Dynamic Model Resolution
Core models now resolve related models via the central `Reyhan` registry:

```php
// Customizing the Product model in your AppServiceProvider:
use Reyhan\Core\Support\Reyhan;
use App\Models\CustomProduct;

public function boot(): void
{
    Reyhan::useModel('product', CustomProduct::class);
}
```

All core relations (`Order::items()`, `Cart::user()`, etc.) will automatically instantiate your registered subclass.

---

### 4. Database Migrations (Low Impact 🟢)

Core database migrations are loaded automatically from the framework package. You no longer need to copy migration files into your root `database/migrations` directory.

Execute pending database updates:

```bash
php artisan migrate --force
```

---

### 5. Automated Verification & Health Check

After applying the upgrade:

```bash
# 1. Regenerate optimized autoloader
composer dump-autoload -o

# 2. Run Reyhan Diagnostic Doctor
php artisan reyhan:doctor

# 3. Clear cached config and routes
php artisan optimize:clear
php artisan optimize
```

---

## Upgrade Command Automation (`reyhan:update`)

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
