# SMS Multi-Driver & Notifications

Transactional SMS notifications are the lifeblood of mobile-first e-commerce. In Reyhan, SMS delivery is handled by an internal **Multi-Driver Notification Subsystem** supporting both shared lines and high-priority pattern/lookup templates.

---

## 1. Supported SMS Providers

The driver manager allows instant switching via `.env` without touching application code:
* **Kavenegar** (Direct API & Pattern Lookup)
* **FarazSMS / IPPanel** (Pattern Token Verification)
* **Ghasedak** (OTP & Transactional)
* **Log Driver** (Local testing & CI environments)

---

## 2. Dispatching a Verification OTP

```php
namespace App\Actions\Auth;

use App\Services\Sms\SmsManager;
use Illuminate\Support\Facades\Cache;

final class SendOtpAction
{
    public function __construct(
        private readonly SmsManager $sms
    ) {}

    public function execute(string $mobile): void
    {
        $code = (string) random_int(10000, 99999);

        // Store OTP in Redis with a 2-minute TTL
        Cache::put("otp:{$mobile}", $code, now()->addMinutes(2));

        // Dispatch pattern SMS
        $this->sms->driver()->sendPattern(
            recipient: $mobile,
            patternCode: 'auth-verify',
            tokens: ['code' => $code]
        );
    }
}
```

---

## 3. Queue-Driven Notifications

All customer transactional notifications (e.g. `OrderShippedNotification`, `PaymentConfirmedNotification`) implement Laravel's `ShouldQueue` contract, automatically routing background delivery through **Redis Horizon workers** to ensure zero API latency for the customer.
