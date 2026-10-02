# Actions & Strongly-Typed DTOs

Reyhan Commerce rejects the "fat controller, bloated model" antipattern as well as convoluted repository abstractions. Instead, all business domain logic is implemented strictly using **Single-Responsibility Action Classes** and **Strongly-Typed Data Transfer Objects (DTOs)**.

---

## 1. The Anatomy of an Action Class

Every Action in Reyhan must obey the following architectural rules:
1. It must be declared as `final`.
2. It must expose a single public entry point: `execute()`.
3. It must accept a strongly-typed DTO (or scalar ID) and return an explicit DTO, Model, or value type.
4. Database mutations must be wrapped inside atomic transactions with proper exception handling.

### Example: `CreateOrderAction`

```php
namespace Reyhan\Core\Actions\Checkout;

use Reyhan\Core\Data\Checkout\CreateOrderData;
use Reyhan\Core\Models\Order;
use Reyhan\Core\Support\Reyhan;
use Illuminate\Support\Facades\DB;
use Reyhan\Core\Exceptions\InsufficientStockException;

final class CreateOrderAction
{
    /**
     * Execute the order creation workflow with atomic inventory locks.
     */
    public function execute(CreateOrderData $data): Order
    {
        return DB::transaction(function () use ($data) {
            $orderClass = Reyhan::model('order');
            $variantClass = Reyhan::model('variant');

            // 1. Acquire pessimistic lock on inventory items
            $variant = $variantClass::where('id', $data->variantId)
                ->lockForUpdate()
                ->firstOrFail();

            if ($variant->stock_quantity < $data->quantity) {
                throw new InsufficientStockException("Variant {$variant->sku} is out of stock.");
            }

            // 2. Decrement stock atomically
            $variant->decrement('stock_quantity', $data->quantity);

            // 3. Create order record
            $order = $orderClass::create([
                'user_id'          => $data->userId,
                'total_amount'     => $variant->price * $data->quantity,
                'status'           => \Reyhan\Core\Enums\Order\OrderStatus::PendingPayment,
                'shipping_address' => $data->shippingAddress->toArray(),
            ]);

            return $order;
        });
    }
}
```

---

## 2. Strongly-Typed Data Transfer Objects (DTOs)

DTOs guarantee that incoming API payloads and internal method inputs are strictly validated, typed, and structured before reaching domain actions.

```php
namespace Reyhan\Core\Data\Checkout;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\Min;

class CreateOrderData extends Data
{
    public function __construct(
        #[Required]
        public int $userId,

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

## 3. Thin Controllers Pattern

Controllers in Reyhan only handle HTTP serialization and dispatch:

```php
namespace Reyhan\Core\Http\Controllers\Api\V1;

use Reyhan\Core\Actions\Checkout\CreateOrderAction;
use Reyhan\Core\Data\Checkout\CreateOrderData;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class OrderController extends Controller
{
    public function store(
        CreateOrderData $data,
        CreateOrderAction $action
    ): JsonResponse {
        $order = $action->execute($data);

        return response()->json([
            'message' => 'Order initiated successfully.',
            'order'   => $order,
        ], Response::HTTP_CREATED);
    }
}
```
