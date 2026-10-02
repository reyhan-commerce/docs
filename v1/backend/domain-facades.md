# First-Class Domain Facades

Just as Laravel provides expressive facades over low-level Symfony components (`Route`, `Storage`, `Queue`), **Reyhan Commerce** provides high-level **First-Class Domain Facades** over its underlying e-commerce services, models, and pipelines.

Developers building custom store features or extensions interact directly with these fluent facades under `Reyhan\Core\Facades\*`.

---

## 1. The `Cart` Facade

The `Cart` facade manages shopping cart resolution, item mutations, pricing recalculations, coupons, and guest-to-customer synchronization:

```php
use Reyhan\Core\Facades\Cart;

// 1. Resolve or create cart for user or guest session
$cart = Cart::resolveCart($user);

// 2. Add an item with inventory and stock checks
$item = Cart::addItem($cart, $variantId, quantity: 2);

// 3. Update quantity (passing 0 removes the item)
$updatedItem = Cart::updateQuantity($item, quantity: 4);

// 4. Remove an item
Cart::removeItem($item);

// 5. Apply or remove discount coupons
$coupon = Cart::applyCoupon($cart, 'SPRING1405');
Cart::removeCoupon($cart);

// 6. Merge guest session cart into user cart after OTP login
$userCart = Cart::syncGuestCart($user, $guestSessionId);
```

---

## 2. The `Inventory` Facade

The `Inventory` facade provides an abstraction over Reyhan's **Two-Tier Concurrency & Stock Locking Engine**:

- **Tier 1 (Redis ZSET)**: Temporary high-speed reservations during checkout (with self-purging TTL).
- **Tier 2 (PostgreSQL)**: Pessimistic locking (`lockForUpdate`) upon bank payment verification.

```php
use Reyhan\Core\Facades\Inventory;

// 1. Get available stock (physical stock minus active temporary reservations)
$available = Inventory::getAvailableStock($variant);

// 2. Atomically reserve stock for checkout (15-minute TTL by default)
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

// 4. Commit reservation upon verified payment (clears Redis lock as DB stock decrements)
Inventory::commit($variant->id, quantity: 2, reservationId: $orderUuid);
```

---

## 3. The `Pricing` Facade

The `Pricing` facade computes comprehensive cart pricing breakdowns including:
- Catalog discounts (`compare_at_price - price`)
- Coupon eligibility across scopes (`All`, `Categories`, `Brands`, `Variants`)
- Weight-tier and courier/national shipping fees
- Legal Value-Added Tax (VAT - configurable percentage and inclusive/exclusive modes)

```php
use Reyhan\Core\Facades\Pricing;

/** @var \Reyhan\Core\Data\Pricing\CartPricingData $pricing */
$pricing = Pricing::calculateCart(
    cart: $cart,
    destinationCity: $shippingAddress->city,
    shippingMethod: $selectedShippingMethod
);

echo $pricing->itemsSubtotal;         // Gross items subtotal in Rials
echo $pricing->catalogDiscount;       // On-sale product discounts
echo $pricing->couponDiscount;        // Applied voucher reduction
echo $pricing->taxAmount;             // VAT calculation
echo $pricing->shippingFee;           // Dynamic carrier rate
echo $pricing->finalPayable;          // Net amount payable at checkout
```

---

## 4. The `Checkout` Facade

The `Checkout` facade orchestrates the order creation workflow and exposes hooks into the extensible `OrderCreationPipeline`:

```php
use Reyhan\Core\Facades\Checkout;

// Process checkout through the pipeline
$result = Checkout::process($user, $createOrderData);

// Hook custom middleware pipes into checkout (e.g. inside a plugin)
Checkout::prependPipe(MyAntiFraudPipe::class);
Checkout::appendPipe(MyCustomLoyaltyPointsPipe::class);
```

---

## 5. The `Reyhan` Master Facade

The `Reyhan` facade (`Reyhan\Core\Facades\Reyhan` or `Reyhan\Core\Support\Reyhan`) provides access to the version, dynamic model resolver, and domain service instances:

```php
use Reyhan\Core\Facades\Reyhan;

// Dynamic model resolution
$orderClass = Reyhan::orderModel();
$productClass = Reyhan::productModel();

// Direct access to core domain services
$cartService = Reyhan::cart();
$inventoryService = Reyhan::inventory();
$pricingService = Reyhan::pricing();
$checkoutService = Reyhan::checkout();
```
