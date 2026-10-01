# Dynamic Model Swapping

In Reyhan Commerce, core entities such as `Product`, `Order`, `Customer`, `Category`, and `Variant` are never hardcoded as rigid class names in queries or actions. Instead, the framework accesses all domain models through the **Central Model Resolver**.

This allows you to replace any core model with your own custom subclass that adds new relationships, custom accessors, local scopes, or custom events—without modifying any core queries or controller endpoints.

---

## 1. How the Resolver Works

Internally, every core action and service resolves models using the `Reyhan` facade:

```php
use App\Support\Reyhan;

// Core resolution pattern
$productClass = Reyhan::model('product');
$product = $productClass::where('slug', $slug)->firstOrFail();
```

---

## 2. Swapping a Core Model

### Step 1: Create Your Custom Model
Extend the core Reyhan model in your application namespace (or inside an extension):

```php
namespace App\Models;

use Reyhan\Core\Models\Product as BaseProduct;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomProduct extends BaseProduct
{
    /**
     * Define a custom relationship to a 3D model viewer asset.
     */
    public function threeDimensionalAssets(): HasMany
    {
        return $this->hasMany(Product3DAsset::class);
    }

    /**
     * Add a custom scope for featured storefront campaigns.
     */
    public function scopeActiveCampaign($query)
    {
        return $query->where('is_campaign_active', true);
    }
}
```

### Step 2: Register in `config/reyhan.php`
Register your custom model class in the `models` configuration map:

```php
// backend/config/reyhan.php

return [
    'models' => [
        'product' => \App\Models\CustomProduct::class,
        'order'   => \Reyhan\Core\Models\Order::class,
        'user'    => \Reyhan\Core\Models\User::class,
    ],
];
```

---

## 3. Benefits of Model Swapping

* **Contract Integrity:** Your custom model inherits all base attributes, casts, sluggable behaviors, and relations while allowing tailored extensions.
* **Global Propagation:** Every core action (Cart calculations, Inventory audits, Admin panel grids, API transformers) automatically utilizes your `CustomProduct` class without touching other files.
* **Clean Testing:** In feature and unit tests, you can easily mock or swap models dynamically during runtime.
