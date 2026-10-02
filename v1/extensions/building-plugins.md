# Complete Plugin & Extension Development Guide

Reyhan Commerce is engineered around a **Hook-Driven Pipeline Architecture**, allowing developers and agencies to extend every aspect of checkout, payment, logistics, and pricing without modifying the core framework.

---

## 1. Fast Scaffolding with Artisan CLI

Generate an isolated, standard PSR-4 plugin package with a single command:

```bash
php artisan reyhan:make:plugin SmsKavenegar
```

This creates a complete package inside `extensions/sms-kavenegar/`:
- `composer.json` with PSR-4 autoloading (`Reyhan\Plugins\SmsKavenegar\`)
- `src/SmsKavenegarServiceProvider.php`
- `config/sms_kavenegar.php`
- `routes/api.php`
- `README.md`

---

## 2. Intercepting the Checkout Pipeline

The order creation process uses `OrderCreationPipeline`. You can inject custom business logic (e.g. anti-fraud verification, credit checks, custom discounts) into the pipeline at runtime:

```php
namespace Reyhan\Plugins\FraudGuard;

use App\Pipelines\Checkout\OrderCreationContext;
use App\Pipelines\Checkout\OrderCreationPipeline;
use Closure;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\ValidationException;

final class AntiFraudPipe
{
    public function handle(OrderCreationContext $context, Closure $next): mixed
    {
        // Intercept order context prior to database persistence
        if ($context->finalPayable > 500_000_000 && ! $context->user->is_verified) {
            throw ValidationException::withMessages([
                'fraud' => ['سفارش‌های با مبلغ بالاتر از ۵۰ میلیون تومان نیازمند احراز هویت پیامکی هستند.'],
            ]);
        }

        return $next($context);
    }
}

// In your Plugin ServiceProvider:
public function boot(): void
{
    OrderCreationPipeline::prependPipe(AntiFraudPipe::class);
}
```

---

## 3. Subscribing to Framework Domain Events

Reyhan Core dispatches strongly-typed domain events during critical lifecycle stages:

| Domain Event | Dispatched When | Payload |
| :--- | :--- | :--- |
| `App\Events\Orders\OrderCreated` | Order and snapshot line-items are persisted in DB | `Order $order` |
| `App\Events\Orders\OrderPaid` | Order is settled via Gateway or Wallet | `Order $order`, `Payment $payment` |
| `App\Events\Orders\OrderCancelled` | Order is cancelled or payment verification fails | `Order $order`, `?string $reason` |
| `App\Events\Inventory\StockDepleted` | Variant physical inventory reaches 0 | `ProductVariant $variant` |
| `App\Events\Auth\CustomerRegistered` | New customer registers via OTP or Password | `User $user` |

### Example Event Listener

```php
use App\Events\Orders\OrderPaid;
use Illuminate\Support\Facades\Event;

Event::listen(OrderPaid::class, function (OrderPaid $event) {
    // Send automated WhatsApp / SMS receipt or dispatch to ERP
    Log::info("Order {$event->order->order_number} settled via {$event->payment->gateway->value}");
});
```

---

## 4. Custom Payment Gateways (Shaparak PSPs)

Scaffold a new Shaparak direct bank driver:

```bash
php artisan reyhan:make:payment-driver Pasargad
```

Implement `PaymentDriverInterface` in `app/Services/Payment/Drivers/PasargadDriver.php` and register your driver:

```php
use App\Services\Payment\PaymentManager;

app(PaymentManager::class)->extend('pasargad', function ($app) {
    return new PasargadDriver();
});
```

---

## 5. Custom Logistics & Couriers

Scaffold a shipping driver:

```bash
php artisan reyhan:make:shipping-driver Chapar
```

---

## 6. Official Moadian Tax Exports

Export official Iranian Taxpayer System (سامانه مؤدیان) B2B/B2C JSON or CSV packages:

```bash
php artisan reyhan:tax:export-moadian --from=2026-01-01 --to=2026-03-20 --format=json
```
