# Modular Extensions

- [Introduction](#introduction)
- [Directory Structure of an Extension](#directory-structure)
- [The Extension Service Provider](#extension-service-provider)
- [Dynamic PSR-4 Autoloading Engine](#psr4-autoloading)
- [Packaging and Distributing Extensions](#packaging-extensions)
- [Testing Modular Extensions](#testing-extensions)

<a name="introduction"></a>
## Introduction

For larger e-commerce deployments or third-party package creators, bundling specialized features directly into `app/` can cause codebase clutter. 

Reyhan Commerce provides a first-class **Modular Extension Architecture**. You can drop self-contained modules into the root `extensions/` directory. Each extension can contain its own Service Provider, routes, database migrations, Filament resources, domain models, and Pest test suites.

Reyhan's `ModuleManager` automatically discovers and registers these extensions at boot time without requiring any edits to your root `composer.json`.

---

<a name="directory-structure"></a>
## Directory Structure of an Extension

An extension placed inside `extensions/{extension-name}` follows standard PSR-4 conventions:

```text
extensions/
└── carrier-chapar/
    ├── composer.json                       # Extension package manifest
    ├── src/
    │   ├── ChaparServiceProvider.php       # Extends ReyhanExtensionServiceProvider
    │   ├── Actions/
    │   ├── Models/
    │   └── Filament/
    │       └── Resources/
    ├── database/
    │   └── migrations/
    ├── routes/
    │   └── api.php
    └── tests/
        └── Feature/
```

### The `composer.json` Manifest

```json
{
    "name": "reyhan-extension/carrier-chapar",
    "type": "reyhan-extension",
    "description": "Chapar Logistics & Tracking integration for Reyhan Commerce",
    "autoload": {
        "psr-4": {
            "Reyhan\\Extensions\\Chapar\\": "src/"
        }
    },
    "extra": {
        "laravel": {
            "providers": [
                "Reyhan\\Extensions\\Chapar\\ChaparServiceProvider"
            ]
        }
    }
}
```

---

<a name="extension-service-provider"></a>
## The Extension Service Provider

Your extension's service provider should extend `Reyhan\Core\Support\Extensions\ReyhanExtensionServiceProvider`:

```php
<?php

declare(strict_types=1);

namespace Reyhan\Extensions\Chapar;

use Reyhan\Core\Support\Extensions\ReyhanExtensionServiceProvider;
use Reyhan\Core\Facades\Shipping;

final class ChaparServiceProvider extends ReyhanExtensionServiceProvider
{
    /**
     * Boot extension components, routes, and migrations.
     */
    public function bootExtension(): void
    {
        // 1. Register API Routes
        $this->loadExtensionApiRoutes(__DIR__.'/../routes/api.php');

        // 2. Load Extension Database Migrations
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');

        // 3. Register Shipping Calculator
        Shipping::registerCalculator('chapar', new Services\ChaparRateCalculator());
    }
}
```

---

<a name="psr4-autoloading"></a>
## Dynamic PSR-4 Autoloading Engine

During framework initialization, `Reyhan\Core\Support\Extensions\ModuleManager` performs the following automated steps:

1. **Scans `extensions/*`:** Reads each extension's `composer.json`.
2. **Registers PSR-4 Autoloading:** Injects the extension namespace dynamically into Composer's `ClassLoader` instance (`$classLoader->addPsr4(...)`).
3. **Discovers Service Providers:** Resolves and registers the providers defined under `extra.laravel.providers`.

> [!NOTE]  
> Because autoloading is injected dynamically, you do **not** need to run `composer dump-autoload` when adding a new extension to `extensions/`.

---

<a name="packaging-extensions"></a>
## Packaging and Distributing Extensions

When you are ready to publish your extension for public consumption:
1. Publish the package to Packagist or private Git repository.
2. Users can install it either via Composer:
   ```bash
   composer require vendor-name/reyhan-carrier-chapar
   ```
   Or by dropping the folder into `extensions/`.

---

<a name="testing-extensions"></a>
## Testing Modular Extensions

Extensions can define their own Pest test suite:

```bash
php artisan test extensions/carrier-chapar/tests
```
