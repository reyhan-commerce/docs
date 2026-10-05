# Extending Models

- [Introduction](#introduction)
- [How Model Resolution Works](#how-model-resolution-works)
- [Swapping a Core Model](#swapping-a-core-model)
    - [1. Creating the Custom Model](#creating-the-custom-model)
    - [2. Registering in Configuration](#registering-in-configuration)
    - [3. Registering via Service Provider](#registering-via-service-provider)
- [Supported Swappable Models](#supported-swappable-models)
- [Practical Example: Iranian National ID & Loyalty Program](#practical-example)
    - [Step 1: Database Migration](#step-1-database-migration)
    - [Step 2: Subclassing User and Order Models](#step-2-subclassing-user-and-order-models)
    - [Step 3: Registering the Models](#step-3-registering-the-models)
- [Testing Your Extended Models](#testing-your-extended-models)
- [Common Pitfalls & Best Practices](#common-pitfalls)

<a name="introduction"></a>
## Introduction

In typical Laravel applications, Eloquent models are referenced with hardcoded class names (e.g., `Order::query()`). In an extensible headless framework like Reyhan Commerce, hardcoding concrete classes inside core actions and controllers would prevent developers from easily extending models without modifying vendor files.

To solve this, Reyhan provides a **Dynamic Model Registry** pattern. Every domain Action (such as `CreateOrderAction`, `ProcessPaymentAction`, or `CalculateCartTotalsAction`), GraphQL/REST API controller, and Filament admin resource resolves Eloquent models through a centralized resolver.

By subclassing a core model and registering your custom class, the entire engine—including administrative interfaces, API responses, and database transactions—will automatically instantiate and query your custom model.

---

<a name="how-model-resolution-works"></a>
## How Model Resolution Works

Whenever the Reyhan engine needs to instantiate or query a model, it resolves the class name via the `Reyhan::model()` helper:

```php
use Reyhan\Core\Facades\Reyhan;

// Returns the bound class name (e.g. App\Models\CustomOrder)
$orderClass = Reyhan::model('order');

// Querying via dynamic resolution
$order = $orderClass::query()
    ->where('tracking_code', $trackingCode)
    ->firstOrFail();
```

When you bind your custom class to the registry, all upstream domain services seamlessly operate on your extended entity.

---

<a name="swapping-a-core-model"></a>
## Swapping a Core Model

<a name="creating-the-custom-model"></a>
### 1. Creating the Custom Model

To extend a core model, create a new model class in your application's `app/Models` directory. Extend the corresponding base model from `Reyhan\Core\Models` and implement its domain contract:

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Reyhan\Core\Contracts\Models\OrderContract;
use Reyhan\Core\Models\Order as BaseOrder;

class Order extends BaseOrder implements OrderContract
{
    /**
     * Get all loyalty reward transactions for this order.
     *
     * @return HasMany<LoyaltyTransaction, $this>
     */
    public function loyaltyTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    /**
     * Calculate cashback reward earned from this purchase.
     */
    public function calculateCashbackAmount(): int
    {
        return (int) ($this->final_payable * 0.02);
    }
}
```

> [!NOTE]  
> All base table names, JSONB cast attributes, UUID/Ulid generation, and relational configurations are inherited automatically from the base class.

<a name="registering-in-configuration"></a>
### 2. Registering in Configuration

The simplest way to register your custom model is by updating the `models` array in your application's `config/reyhan.php` file:

```php
// config/reyhan.php

return [
    'models' => [
        'order' => \App\Models\Order::class,
        'user' => \App\Models\User::class,
        // Other models remain mapped to core defaults...
    ],
];
```

<a name="registering-via-service-provider"></a>
### 3. Registering via Service Provider

If you are developing a standalone plugin within the `extensions/` directory or prefer programmatic binding during application boot, register the model in a Service Provider:

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use App\Models\Order;
use Illuminate\Support\ServiceProvider;
use Reyhan\Core\Facades\Reyhan;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Reyhan::useModel('order', Order::class);
    }
}
```

---

<a name="supported-swappable-models"></a>
## Supported Swappable Models

Reyhan exposes dynamic registries for all 16+ core e-commerce domain entities:

| Model Key | Base Class (`Reyhan\Core\Models\*`) | Contract Interface (`Reyhan\Core\Contracts\Models\*`) |
| :--- | :--- | :--- |
| `'product'` | `Product` | `ProductContract` |
| `'product_variant'` | `ProductVariant` | `ProductVariantContract` |
| `'category'` | `Category` | `CategoryContract` |
| `'brand'` | `Brand` | `BrandContract` |
| `'order'` | `Order` | `OrderContract` |
| `'order_item'` | `OrderItem` | `OrderItemContract` |
| `'cart'` | `Cart` | `CartContract` |
| `'cart_item'` | `CartItem` | `CartItemContract` |
| `'user'` | `User` | `UserContract` |
| `'admin'` | `Admin` | `AdminContract` |
| `'address'` | `Address` | `AddressContract` |
| `'coupon'` | `Coupon` | `CouponContract` |
| `'review'` | `Review` | `ReviewContract` |
| `'payment'` | `Payment` | `PaymentContract` |
| `'shipping_method'` | `ShippingMethod` | `ShippingMethodContract` |
| `'wishlist'` | `Wishlist` | `WishlistContract` |

---

<a name="practical-example"></a>
## Practical Example: Iranian National ID & Loyalty Program

Let's walk through a complete, end-to-end example where we customize both the `User` and `Order` models to:
1. Store and validate an Iranian 10-digit National ID (`national_code`).
2. Track VIP customer status and calculate loyalty cashback points on checkout.

<a name="step-1-database-migration"></a>
### Step 1: Database Migration

Create a migration to add custom columns to the `users` and `orders` tables:

```bash
php artisan make:migration add_custom_fields_to_users_and_orders_tables
```

```php
<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('national_code', 10)->nullable()->unique()->after('mobile');
            $table->boolean('is_vip')->default(false)->after('national_code');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedInteger('loyalty_points_earned')->default(0)->after('final_payable');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['national_code', 'is_vip']);
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('loyalty_points_earned');
        });
    }
};
```

Run the migration:

```bash
php artisan migrate
```

<a name="step-2-subclassing-user-and-order-models"></a>
### Step 2: Subclassing User and Order Models

Create `app/Models/User.php`:

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Reyhan\Core\Contracts\Models\UserContract;
use Reyhan\Core\Models\User as BaseUser;

class User extends BaseUser implements UserContract
{
    /**
     * Define custom attribute casts.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return array_merge(parent::casts(), [
            'is_vip' => 'boolean',
        ]);
    }

    /**
     * Verify Iranian 10-digit National Code algorithm.
     */
    public function isValidNationalCode(): bool
    {
        if (empty($this->national_code) || ! preg_match('/^[0-9]{10}$/', $this->national_code)) {
            return false;
        }

        $code = $this->national_code;
        $check = (int) $code[9];
        $sum = 0;

        for ($i = 0; $i < 9; $i++) {
            $sum += ((int) $code[$i]) * (10 - $i);
        }

        $remainder = $sum % 11;

        return ($remainder < 2 && $check === $remainder) || ($remainder >= 2 && $check === (11 - $remainder));
    }
}
```

Create `app/Models/Order.php`:

```php
<?php

declare(strict_types=1);

namespace App\Models;

use Reyhan\Core\Contracts\Models\OrderContract;
use Reyhan\Core\Models\Order as BaseOrder;

class Order extends BaseOrder implements OrderContract
{
    /**
     * Determine bonus points earned from order completion.
     */
    public function calculateBonusPoints(): int
    {
        $rate = $this->user?->is_vip ? 0.05 : 0.02;

        return (int) round($this->final_payable * $rate / 1000);
    }
}
```

<a name="step-3-registering-the-models"></a>
### Step 3: Registering the Models

Update `config/reyhan.php`:

```php
'models' => [
    'user' => \App\Models\User::class,
    'order' => \App\Models\Order::class,
],
```

---

<a name="testing-your-extended-models"></a>
## Testing Your Extended Models

You can write expressive Pest 4 tests to verify your model extensions:

```php
<?php

declare(strict_types=1);

use App\Models\Order;
use App\Models\User;
use Reyhan\Core\Facades\Reyhan;

it('binds custom models in the central registry', function () {
    expect(Reyhan::model('user'))->toBe(User::class)
        ->and(Reyhan::model('order'))->toBe(Order::class);
});

it('correctly validates iranian national codes', function () {
    $user = new User(['national_code' => '0012345678']); // Invalid code
    expect($user->isValidNationalCode())->toBeFalse();

    $validUser = new User(['national_code' => '1111111111']); // Algorithm check
    expect($validUser->isValidNationalCode())->toBeBool();
});

it('calculates vip loyalty points correctly on custom order', function () {
    $vipUser = User::factory()->create(['is_vip' => true]);
    
    $order = Order::factory()->create([
        'user_id' => $vipUser->id,
        'final_payable' => 10_000_000, // 10,000,000 Rials
    ]);

    // VIP rate 5% => 500,000 / 1000 = 500 points
    expect($order->calculateBonusPoints())->toBe(500);
});
```

---

<a name="common-pitfalls"></a>
## Common Pitfalls & Best Practices

> [!WARNING]  
> **Always Implement Domain Contracts:** If you do not implement `OrderContract` on your extended `Order` model, strict static analysis and pipeline checks will fail.

> [!TIP]  
> **Merge Parent Casts:** When declaring `protected function casts(): array` in modern Laravel 11/12/13 style, always merge with `parent::casts()` to preserve core JSONB casting, datetime immutability, and monetary integer casting.
