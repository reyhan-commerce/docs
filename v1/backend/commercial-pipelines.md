# Hookable Commercial Pipelines

Just as Laravel abstracts HTTP requests into an extensible **Middleware Pipeline**, **Reyhan Commerce** abstracts all mission-critical commercial workflows into **Hookable Commercial Pipelines**.

Extensions, plugins, and custom store implementations can prepend, append, or replace pipes in the pipeline to alter pricing, inject custom promotions, apply anti-fraud screening, or integrate external ERP systems without editing a single line of framework code.

---

## 1. Overview of Core Pipelines

Reyhan ships with two primary commercial pipelines:

| Pipeline | Responsibility | Context Object |
| :--- | :--- | :--- |
| `CartCalculationPipeline` | Computes item subtotals, catalog sales, vouchers, shipping rates, and legal tax (VAT) | `CartCalculationContext` |
| `OrderCreationPipeline` | Validates cart state, reserves stock, creates DB order, generates payment tokens | `OrderCreationContext` |

---

## 2. Cart Calculation Pipeline (`CartCalculationPipeline`)

The cart calculation pipeline runs whenever `Pricing::calculateCart($cart)` or the cart API is invoked:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                      CartCalculationPipeline                           │
│                                                                        │
│   1. CollectCartItemsPipe          ──▶ Resolves variants, units & tax  │
│   2. ApplyCatalogDiscountsPipe     ──▶ Calculates on-sale savings      │
│   3. ApplyCouponsAndPromotionsPipe ──▶ Evaluates vouchers & scopes     │
│   4. CalculateShippingFeePipe      ──▶ Computes carrier & courier fee  │
│   5. CalculateTaxesPipe            ──▶ Evaluates legal VAT (10%)       │
│   6. AssemblePricingDataPipe       ──▶ Packages CartPricingData DTO    │
└────────────────────────────────────────────────────────────────────────┘
```

### Adding a Custom Pricing Pipe

For example, to introduce a **VIP Loyalty Discount** that awards a 5% discount to customers with more than 1,000 loyalty coins:

```php
namespace App\Pipelines\Cart;

use Closure;
use Reyhan\Core\Pipelines\Cart\CartCalculationContext;

final class ApplyVipCustomerDiscountPipe
{
    public function handle(CartCalculationContext $context, Closure $next): mixed
    {
        $user = $context->cart->user;

        if ($user && $user->loyalty_coins >= 1000) {
            $vipDiscount = (int) round($context->itemsSubtotal * 0.05);
            $context->couponDiscount += $vipDiscount;
            $context->totalDiscount += $vipDiscount;
            $context->attributes['vip_discount'] = $vipDiscount;
        }

        return $next($context);
    }
}
```

Register your pipe in a Service Provider:

```php
use Reyhan\Core\Facades\Pricing;
use App\Pipelines\Cart\ApplyVipCustomerDiscountPipe;

public function boot(): void
{
    Pricing::appendPipe(ApplyVipCustomerDiscountPipe::class);
}
```

---

## 3. Order Creation Pipeline (`OrderCreationPipeline`)

The checkout order creation pipeline runs atomically inside `Checkout::process($user, $data)`:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        OrderCreationPipeline                           │
│                                                                        │
│   1. VerifyCartStatePipe           ──▶ Checks active items & stock     │
│   2. ApplyDynamicPromotionsPipe    ──▶ Validates final coupon locks    │
│   3. CalculateTaxesAndShippingPipe ──▶ Recalculates final payable      │
│   4. ReserveInventoryMutexPipe     ──▶ Redis atomic stock mutex        │
│   5. ExecutePreOrderHooksPipe      ──▶ Pre-order verification hooks    │
│   6. PersistOrderRecordPipe        ──▶ DB transaction & line items     │
│   7. InitiatePaymentOrWalletPipe   ──▶ Generates gateway invoice       │
│   8. FireOrderCreatedEventsPipe    ──▶ Dispatches domain events        │
└────────────────────────────────────────────────────────────────────────┘
```

### Adding an Anti-Fraud Screening Pipe

To block suspicious orders or require secondary verification for orders exceeding a certain monetary threshold:

```php
namespace App\Pipelines\Checkout;

use Closure;
use Reyhan\Core\Pipelines\Checkout\OrderCreationContext;
use Illuminate\Validation\ValidationException;

final class FraudScreeningPipe
{
    public function handle(OrderCreationContext $context, Closure $next): mixed
    {
        // Intercept high-value orders
        if ($context->finalPayable > 1_000_000_000 && ! $context->user->is_verified) {
            throw ValidationException::withMessages([
                'checkout' => ['Orders exceeding 100 million Tomans require verified mobile identity.'],
            ]);
        }

        return $next($context);
    }
}
```

Prepend this pipe at the start of the checkout pipeline:

```php
use Reyhan\Core\Facades\Checkout;
use App\Pipelines\Checkout\FraudScreeningPipe;

public function boot(): void
{
    Checkout::prependPipe(FraudScreeningPipe::class);
}
```

---

## 4. Pipeline Management API

Both pipelines provide full static control for inspection, re-ordering, and testing:

```php
use Reyhan\Core\Pipelines\Cart\CartCalculationPipeline;
use Reyhan\Core\Pipelines\Checkout\OrderCreationPipeline;

// Append a pipe to the end of execution
CartCalculationPipeline::appendPipe(MyPipe::class);

// Prepend a pipe to execute first
CartCalculationPipeline::prependPipe(SecurityCheckPipe::class);

// Inspect configured pipes
$pipes = CartCalculationPipeline::getPipes();

// Reset pipes to framework defaults (especially useful in test cleanups)
CartCalculationPipeline::resetPipes();
OrderCreationPipeline::resetPipes();
```
