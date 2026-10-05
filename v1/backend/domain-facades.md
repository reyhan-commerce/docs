# First-Class Domain Facades

- [Introduction](#introduction)
- [The `Cart` Facade](#the-cart-facade)
- [The `Inventory` Facade](#the-inventory-facade)
- [The `Pricing` Facade](#the-pricing-facade)
- [The `Checkout` Facade](#the-checkout-facade)
- [The `Ledger` Facade](#the-ledger-facade)
- [The `Reyhan` Master Facade](#the-reyhan-facade)

<a name="introduction"></a>
## Introduction

Just as Laravel provides expressive facades over underlying framework components (`Route`, `Storage`, `Queue`, `Event`), **Reyhan Commerce** provides high-level **First-Class Domain Facades** over its underlying e-commerce services, models, and calculation pipelines.

Facades provide a static interface to classes that are available in the application's service container, allowing you to execute complex commerce operations with concise, readable syntax.

---

<a name="the-cart-facade"></a>
## The `Cart` Facade

The `Cart` facade (`Reyhan\Core\Facades\Cart`) manages shopping cart resolution, item mutations, pricing recalculations, promotional coupons, and guest-to-customer synchronization:

```php
use Reyhan\Core\Facades\Cart;

// 1. Resolve or create cart for user or guest session
$cart = Cart::resolveCart($user);

// 2. Add a product variant with automatic inventory availability check
$item = Cart::addItem($cart, variantId: $variantId, quantity: 2);

// 3. Update line item quantity (passing 0 removes the item)
$updatedItem = Cart::updateQuantity($item, quantity: 4);

// 4. Remove an item
Cart::removeItem($item);

// 5. Apply or remove discount vouchers
$coupon = Cart::applyCoupon($cart, 'NOROOZ1405');
Cart::removeCoupon($cart);

// 6. Merge guest session cart into user cart upon OTP login
$userCart = Cart::syncGuestCart($user, $guestSessionId);
```

---

<a name="the-inventory-facade"></a>
## The `Inventory` Facade

The `Inventory` facade (`Reyhan\Core\Facades\Inventory`) manages the framework's **Two-Tier Concurrency & Stock Locking Engine**:

- **Tier 1 (Redis ZSET)**: Temporary high-speed reservations during checkout with automated TTL self-purging.
- **Tier 2 (PostgreSQL)**: Pessimistic row locking (`lockForUpdate`) upon bank payment verification.

```php
use Reyhan\Core\Facades\Inventory;

// 1. Get available stock (physical stock minus active temporary reservations)
$available = Inventory::getAvailableStock($variant);

// 2. Atomically reserve stock for checkout (15-minute TTL)
$reserved = Inventory::reserve(
    variantId: $variant->id,
    quantity: 2,
    reservationId: $orderUuid,
    ttlSeconds: 900
);

if (! $reserved) {
    throw new \Exception('Variant is temporarily reserved or out of stock.');
}

// 3. Release temporary reservation (on payment failure or cart cancellation)
Inventory::release($variant->id, quantity: 2, reservationId: $orderUuid);

// 4. Commit reservation upon verified payment
Inventory::commit($variant->id, quantity: 2, reservationId: $orderUuid);
```

---

<a name="the-pricing-facade"></a>
## The `Pricing` Facade

The `Pricing` facade (`Reyhan\Core\Facades\Pricing`) computes full cart pricing breakdowns including catalog discounts, tiered promotional coupons, shipping freight, and Value-Added Tax (VAT):

```php
use Reyhan\Core\Facades\Pricing;

/** @var \Reyhan\Core\DTOs\CartPricingResult $pricing */
$pricing = Pricing::calculateCart(
    cart: $cart,
    destinationCity: $shippingAddress->city,
    shippingMethod: $selectedShippingMethod
);

echo $pricing->itemsSubtotal;     // Gross items subtotal in Rials
echo $pricing->catalogDiscount;   // Product on-sale discounts
echo $pricing->couponDiscount;    // Applied voucher reduction
echo $pricing->taxAmount;         // VAT calculation
echo $pricing->shippingFee;       // Dynamic carrier freight
echo $pricing->finalPayable;      // Net amount payable at checkout
```

---

<a name="the-checkout-facade"></a>
## The `Checkout` Facade

The `Checkout` facade (`Reyhan\Core\Facades\Checkout`) orchestrates the order creation workflow through the extensible `OrderCreationPipeline`:

```php
use Reyhan\Core\Facades\Checkout;

// Process checkout and create order
$result = Checkout::process($user, $createOrderData);
```

---

<a name="the-ledger-facade"></a>
## The `Ledger` Facade

The `Ledger` facade (`Reyhan\Core\Facades\Ledger`) provides double-entry financial ledger accounting for customer wallets, order invoices, merchant payouts, and refunds:

```php
use Reyhan\Core\Facades\Ledger;

// Record a balanced double-entry transaction
Ledger::recordTransaction(
    referenceType: 'order',
    referenceId: $order->id,
    debitAccount: 'accounts_receivable',
    creditAccount: 'sales_revenue',
    amount: $order->final_payable,
    description: 'تسویه فاکتور سفارش '.$order->tracking_code
);
```

---

<a name="the-reyhan-facade"></a>
## The `Reyhan` Master Facade

The `Reyhan` master facade provides central access to versioning, dynamic model resolution, and container services:

```php
use Reyhan\Core\Facades\Reyhan;

// Dynamic model class resolution
$orderClass = Reyhan::model('order');
$productClass = Reyhan::model('product');

// Direct access to core domain services
$cart = Reyhan::cart();
$inventory = Reyhan::inventory();
$pricing = Reyhan::pricing();
```
