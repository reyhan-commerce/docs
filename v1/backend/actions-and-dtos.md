# Actions & Strongly-Typed DTOs

- [Introduction](#introduction)
- [The Action Pattern](#action-pattern)
    - [Action Class Anatomy](#action-anatomy)
    - [Example: `CreateOrderAction`](#example-create-order)
- [Strongly-Typed Data Transfer Objects (DTOs)](#dtos)
- [Thin HTTP Controllers](#thin-controllers)
- [Testing Domain Actions](#testing-actions)

<a name="introduction"></a>
## Introduction

Reyhan Commerce adheres strictly to clean architectural boundaries: business domain logic is implemented exclusively using **Single-Responsibility Action Classes** and **Strongly-Typed Data Transfer Objects (DTOs)**.

Fat controllers, bloated ActiveRecord models with messy callbacks, and convoluted Repository abstractions are replaced with predictable, testable, and isolated actions.

---

<a name="action-pattern"></a>
## The Action Pattern

<a name="action-anatomy"></a>
### Action Class Anatomy

Every Action in Reyhan adheres to four strict architectural rules:

1. **Declared as `final`:** Prevents fragile inheritance; composition and pipelines are used for extensibility instead.
2. **Single Entry Point (`execute`):** Every action defines a single public `execute()` method.
3. **Type-Safe In & Out:** Accepts strongly typed DTOs and returns explicit Models, DTOs, or scalar values.
4. **Transactional Safety:** Database mutations are wrapped inside `DB::transaction()`.

<a name="example-create-order"></a>
### Example: `CreateOrderAction`

```php
<?php

declare(strict_types=1);

namespace Reyhan\Core\Actions\Checkout;

use Illuminate\Support\Facades\DB;
use Reyhan\Core\Contracts\Models\UserContract;
use Reyhan\Core\DTOs\CreateOrderData;
use Reyhan\Core\DTOs\CreateOrderResult;
use Reyhan\Core\Exceptions\InsufficientStockException;
use Reyhan\Core\Facades\Reyhan;
use Reyhan\Core\Models\Order;
use Reyhan\Core\Models\ProductVariant;

final class CreateOrderAction
{
    /**
     * Execute the order placement workflow.
     */
    public function execute(UserContract $user, CreateOrderData $data): CreateOrderResult
    {
        return DB::transaction(function () use ($user, $data) {
            $orderClass = Reyhan::model('order');
            $variantClass = Reyhan::model('product_variant');

            // 1. Acquire pessimistic row lock on variant
            $variant = $variantClass::query()
                ->lockForUpdate()
                ->findOrFail($data->variantId);

            if ($variant->stock < $data->quantity) {
                throw new InsufficientStockException("Variant {$variant->sku} is out of stock.");
            }

            // 2. Decrement inventory
            $variant->decrement('stock', $data->quantity);

            // 3. Create the order
            $order = $orderClass::create([
                'user_id' => $user->id,
                'total_amount' => $variant->price * $data->quantity,
                'final_payable' => $variant->price * $data->quantity,
                'status' => 'pending_payment',
            ]);

            return new CreateOrderResult(order: $order);
        });
    }
}
```

---

<a name="dtos"></a>
## Strongly-Typed Data Transfer Objects (DTOs)

DTOs guarantee that incoming HTTP payloads are structured, strictly typed, and self-validating before reaching domain actions:

```php
<?php

declare(strict_types=1);

namespace Reyhan\Core\DTOs;

use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

final class CreateOrderData extends Data
{
    public function __construct(
        #[Required]
        public int $variantId,

        #[Required, Min(1)]
        public int $quantity,

        #[Required]
        public ShippingAddressData $shippingAddress,
    ) {}
}
```

---

<a name="thin-controllers"></a>
## Thin HTTP Controllers

Controllers in Reyhan only handle HTTP request parsing and response serialization:

```php
<?php

declare(strict_types=1);

namespace Reyhan\Core\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Reyhan\Core\Actions\Checkout\CreateOrderAction;
use Reyhan\Core\DTOs\CreateOrderData;
use Symfony\Component\HttpFoundation\Response;

final class OrderController extends Controller
{
    public function store(CreateOrderData $data, CreateOrderAction $action): JsonResponse
    {
        $result = $action->execute(auth()->user(), $data);

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $result->order,
        ], Response::HTTP_CREATED);
    }
}
```

---

<a name="testing-actions"></a>
## Testing Domain Actions

Actions are tested in isolation using **Pest 4**:

```php
<?php

declare(strict_types=1);

use App\Models\User;
use Reyhan\Core\Actions\Checkout\CreateOrderAction;
use Reyhan\Core\DTOs\CreateOrderData;
use Reyhan\Core\DTOs\ShippingAddressData;
use Reyhan\Core\Models\ProductVariant;

it('creates an order and decrements stock successfully', function () {
    $user = User::factory()->create();
    $variant = ProductVariant::factory()->create(['stock' => 10, 'price' => 100_000]);

    $data = new CreateOrderData(
        variantId: $variant->id,
        quantity: 2,
        shippingAddress: ShippingAddressData::fake()
    );

    $action = new CreateOrderAction();
    $result = $action->execute($user, $data);

    expect($result->order->final_payable)->toBe(200_000)
        ->and($variant->fresh()->stock)->toBe(8);
});
```
