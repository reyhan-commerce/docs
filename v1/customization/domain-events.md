# Domain Events & Webhooks

- [Introduction](#introduction)
- [Available Core Domain Events](#available-events)
- [Listening to Domain Events](#listening-to-events)
- [Queued Async Event Listeners](#queued-listeners)
- [Practical Example: Accounting ERP Synchronization](#practical-example)
- [Testing Events & Listeners](#testing-events)

<a name="introduction"></a>
## Introduction

Reyhan Commerce dispatches strongly-typed **Domain Events** throughout every phase of the commerce lifecycle—from customer registration and shopping cart modifications to order placement, stock reservation, and payment settlement.

By creating event listeners or dispatching outgoing webhooks, you can react to state changes, synchronize third-party systems (such as CRM or accounting software), and trigger notifications without altering core Action workflows.

---

<a name="available-events"></a>
## Available Core Domain Events

Reyhan dispatches the following domain events:

| Event Class (`Reyhan\Core\Events\*`) | Dispatched When | Payload Properties |
| :--- | :--- | :--- |
| `OrderCreated` | An order is placed and enters `pending_payment` status. | `public Order $order` |
| `PaymentVerified` | Payment is verified by IPG gateway and transaction committed. | `public Payment $payment`, `public Order $order` |
| `OrderStatusChanged` | Order transitions to `processing`, `shipped`, `delivered`, or `cancelled`. | `public Order $order`, `public string $previousStatus`, `public string $newStatus` |
| `StockReserved` | Temporary Redis mutex reservation is created for items during checkout. | `public string $reservationId`, `public array $items` |
| `StockDecremented` | Permanent stock decrement is committed to database after payment. | `public Order $order` |
| `UserRegistered` | A new customer completes initial OTP verification. | `public User $user` |
| `ReviewApproved` | A customer product review is approved by store staff. | `public Review $review` |

---

<a name="listening-to-events"></a>
## Listening to Domain Events

To listen to a core event, create a listener class:

```bash
php artisan make:listener SyncOrderWithAccounting --event=Reyhan\\Core\\Events\\PaymentVerified
```

---

<a name="queued-listeners"></a>
## Queued Async Event Listeners

For operations that interact with external HTTP APIs or perform heavy processing, implement the `ShouldQueue` contract to run the listener asynchronously on your Redis background queue:

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Reyhan\Core\Events\PaymentVerified;

final class SyncOrderWithAccounting implements ShouldQueue
{
    use InteractsWithQueue;

    public string $queue = 'integrations';
    public int $tries = 3;

    public function handle(PaymentVerified $event): void
    {
        $order = $event->order;

        // Synchronize with external accounting ERP (Sepidar, Holo, etc.)
    }
}
```

Register the listener in `app/Providers/AppServiceProvider.php` (or `EventServiceProvider.php`):

```php
use App\Listeners\SyncOrderWithAccounting;
use Illuminate\Support\Facades\Event;
use Reyhan\Core\Events\PaymentVerified;

public function boot(): void
{
    Event::listen(
        PaymentVerified::class,
        SyncOrderWithAccounting::class,
    );
}
```

---

<a name="practical-example"></a>
## Practical Example: Accounting ERP Synchronization

Here is an example listener synchronizing a verified order with an accounting API:

```php
<?php

declare(strict_types=1);

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Http\Client\Factory as HttpFactory;
use Illuminate\Queue\InteractsWithQueue;
use Reyhan\Core\Events\PaymentVerified;

final class SyncSepidarInvoiceListener implements ShouldQueue
{
    use InteractsWithQueue;

    public function __construct(
        private readonly HttpFactory $http,
    ) {}

    public function handle(PaymentVerified $event): void
    {
        $order = $event->order;

        $response = $this->http->withHeaders([
            'X-API-Key' => config('services.sepidar.api_key'),
        ])->post('https://api.sepidar.com/v1/invoices', [
            'invoice_number' => $order->tracking_code,
            'customer_mobile' => $order->user->mobile,
            'amount_rials' => $order->final_payable,
            'items' => $order->items->map(fn ($item) => [
                'sku' => $item->variant->sku,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
            ])->all(),
        ]);

        if (! $response->successful()) {
            $this->release(30); // Retry in 30 seconds
        }
    }
}
```

---

<a name="testing-events"></a>
## Testing Events & Listeners

You can assert that events are dispatched properly using `Event::fake()` in Pest 4:

```php
<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Event;
use Reyhan\Core\Events\PaymentVerified;
use Reyhan\Core\Models\Order;
use Reyhan\Core\Models\Payment;

it('dispatches PaymentVerified event upon successful payment verification', function () {
    Event::fake([PaymentVerified::class]);

    $order = Order::factory()->create();
    $payment = Payment::factory()->create(['order_id' => $order->id]);

    $payment->markAsPaid('REF-987654', '6037********1234');

    Event::assertDispatched(PaymentVerified::class, function (PaymentVerified $event) use ($order) {
        return $event->order->id === $order->id;
    });
});
```
