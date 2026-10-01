# Payment Gateway Drivers

Reyhan Commerce features an abstraction layer for online payment gateways, merchant aggregators, and direct banking integrations. The payment subsystem isolates gateway-specific HTTP APIs, callback parsing, and verification logic into swappable **Payment Drivers**.

---

## 1. Supported Drivers

Out of the box, Reyhan provides adapters for leading Iranian payment networks via the unified gateway manager:
* **ZarinPal** (Merchant Aggregator)
* **Saman (SEP)** (Direct Bank Gateway)
* **Mellat (Behpardakht)** (Direct Bank Gateway)
* **Pasargad (PEP)** (Direct Bank Gateway)
* **Sadad (Melli)** (Direct Bank Gateway)
* **IDPay / NextPay / Zibal**

---

## 2. Initiating a Payment in an Action

```php
namespace App\Actions\Payment;

use App\Models\Order;
use Shetabit\Multipay\Invoice;
use Shetabit\Payment\Facade\Payment;

final class InitiatePaymentAction
{
    /**
     * Generate an invoice and retrieve gateway redirect parameters.
     */
    public function execute(Order $order, string $callbackUrl): string
    {
        $invoice = (new Invoice)
            ->amount((int) $order->total_amount)
            ->detail(['order_id' => $order->id, 'mobile' => $order->user->mobile]);

        return Payment::callbackUrl($callbackUrl)
            ->purchase($invoice, function ($driver, $transactionId) use ($order) {
                $order->update([
                    'payment_transaction_id' => $transactionId,
                ]);
            })
            ->pay()
            ->toJson();
    }
}
```

---

## 3. Verifying Callbacks

Callbacks are handled via a dedicated, idempotent verification action:

```php
namespace App\Actions\Payment;

use App\Models\Order;
use Shetabit\Payment\Facade\Payment;
use Shetabit\Multipay\Exceptions\InvalidPaymentException;
use App\Enums\OrderStatus;

final class VerifyPaymentAction
{
    public function execute(Order $order, int $amount, string $authority): bool
    {
        try {
            $receipt = Payment::amount($amount)
                ->transactionId($authority)
                ->verify();

            $order->update([
                'status'         => OrderStatus::Processing,
                'reference_id'   => $receipt->getReferenceId(),
                'paid_at'        => now(),
            ]);

            return true;
        } catch (InvalidPaymentException $e) {
            $order->update(['status' => OrderStatus::Cancelled]);
            return false;
        }
    }
}
```
