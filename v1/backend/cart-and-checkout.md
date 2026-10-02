# Cart, Checkout & Concurrency Locks

In high-volume e-commerce, flash sales and campaign traffic can trigger severe **Race Conditions**—leading to overselling inventory beyond physical warehouse limits. Reyhan Commerce employs robust **Atomic Mutexes and Pessimistic Locking** during checkout.

---

## 1. Concurrency Protection Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Customer1 as Customer A (Flash Sale)
    actor Customer2 as Customer B (Flash Sale)
    participant Action as CreateOrderAction
    participant DB as PostgreSQL 17 (pessimistic lock)

    Customer1->>Action: Checkout Item (Stock = 1)
    Customer2->>Action: Checkout Item (Stock = 1)
    
    Action->>DB: Variant::lockForUpdate()->find() [Customer 1 Locks Row]
    Note over DB: Lock granted to Customer 1. Customer 2 request waits.
    
    Action->>DB: Decrements Stock: 1 -> 0
    Action->>DB: Creates Order #101
    Action->>DB: Commits Transaction [Lock Released]
    
    DB-->>Customer1: Order Created & Payment Gateway Redirected
    
    Note over DB: Lock granted to Customer 2. Evaluates stock = 0.
    Action->>DB: Evaluates Stock (0 < 1) -> Throws InsufficientStockException
    DB-->>Customer2: 422 Unprocessable Entity ("Item is out of stock")
```

---

## 2. Guest-to-Authenticated Cart Synchronization

Reyhan supports seamless guest shopping with immediate cart migration upon authentication:

1. **Guest Phase:** Unauthenticated shoppers store items locally in browser storage and Redis session keys.
2. **Authentication Phase:** When the customer logs in via SMS OTP, the storefront issues a single synchronization call:
   ```http
   POST /api/v1/cart/sync
   Content-Type: application/json
   Authorization: Bearer <sanctum_token>

   {
     "items": [
       { "variant_id": 42, "quantity": 2 }
     ]
   }
   ```
3. **Merge Engine:** The backend atomically aggregates quantities, checks current stock availability, applies user-specific tier pricing, and returns the unified active cart payload.

---

## 3. Order Status State Machine

Orders progress through a strictly defined lifecycle powered by native PHP 8.3+ Backed Enums:

```php
namespace Reyhan\Core\Enums\Order;

enum OrderStatus: string
{
    case PendingPayment = 'pending_payment';
    case Processing     = 'processing';
    case Shipped        = 'shipped';
    case Delivered      = 'delivered';
    case Cancelled      = 'cancelled';
    case Refunded       = 'refunded';
}
```
