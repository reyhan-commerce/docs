# Plugin Architecture & `module.json`

The **Modular Extension Engine** allows you to encapsulate distinct commercial domains, third-party integrations (e.g., shipping carriers, loyalty systems, CRM synchronizers), and administrative tools into self-contained plugins residing in `backend/extensions/`.

---

## 1. Extension Directory Anatomy

Each extension lives in its own folder and follows standard package layout:

```text
backend/extensions/torob-sync/
├── module.json                      # Mandatory manifest descriptor
├── src/
│   ├── Actions/                     # Extension-specific domain actions
│   ├── Data/                        # DTOs
│   ├── Http/
│   │   └── Controllers/             # Dedicated API endpoints
│   ├── Filament/
│   │   └── Pages/                   # Custom admin console tabs/pages
│   └── Providers/
│       └── TorobSyncServiceProvider.php
├── routes/
│   └── api.php                      # Extension routes
└── database/
    └── migrations/                  # Extension-specific tables
```

---

## 2. The `module.json` Manifest

The manifest informs the Reyhan `ModuleManager` how to discover, boot, and prioritize the extension:

```json
{
  "name": "torob-sync",
  "title": "Torob Marketplace Product Feed Sync",
  "version": "1.0.0",
  "description": "Automated price and stock updater for Torob price comparison engine",
  "author": "Reyhan Engineering",
  "providers": [
    "Reyhan\\Extensions\\TorobSync\\Providers\\TorobSyncServiceProvider"
  ],
  "enabled": true,
  "requires": {
    "reyhan/core": "^1.0.0"
  }
}
```

---

## 3. Auto-Discovery & Service Providers

During framework boot:
1. The `ModuleManager` scans `backend/extensions/*/module.json`.
2. Active extensions have their specified `providers` registered automatically into the service container.
3. Extension migrations and routes are loaded dynamically without requiring manual entries in `bootstrap/providers.php`.

---

## 4. The `ReyhanExtensionServiceProvider` Base Class

Instead of wrestling with raw Laravel service providers, Reyhan plugins inherit from `Reyhan\Core\Support\Extensions\ReyhanExtensionServiceProvider`. This base class provides first-class methods for commercial extension:

```php
namespace Reyhan\Extensions\TorobSync\Providers;

use Reyhan\Core\Support\Extensions\ReyhanExtensionServiceProvider;
use Reyhan\Extensions\TorobSync\Drivers\CustomPaymentDriver;
use Reyhan\Extensions\TorobSync\Pipelines\TorobMarkupPipe;

class TorobSyncServiceProvider extends ReyhanExtensionServiceProvider
{
    public function register(): void
    {
        // 1. Register custom payment driver into PaymentManager
        $this->registerPaymentDriver('torob_pay', CustomPaymentDriver::class);

        // 2. Dynamically swap a core model
        $this->swapModel('product', CustomProduct::class);
    }

    public function boot(): void
    {
        // 3. Hook custom pricing pipe into CartCalculationPipeline
        $this->registerPricingPipe(TorobMarkupPipe::class);

        // 4. Hook custom checkout validation into OrderCreationPipeline
        $this->registerCheckoutPipe(AntiFraudPipe::class, prepend: true);

        // 5. Register custom Filament admin panel resources
        $this->registerAdminResources([
            TorobSyncResource::class,
        ]);

        // 6. Load routes, migrations and translations
        $this->loadExtensionApiRoutes(__DIR__.'/../../routes/api.php');
        $this->loadExtensionMigrations(__DIR__.'/../../database/migrations');
    }
}
```
