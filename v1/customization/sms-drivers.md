# Custom SMS & OTP Drivers

- [Introduction](#introduction)
- [SMS Manager & Driver Architecture](#driver-architecture)
- [Built-in SMS Providers](#builtin-providers)
- [Implementing a Custom SMS Driver](#implementing-custom-driver)
    - [Step 1: Implementing SmsGatewayContract](#step-1-contract)
    - [Step 2: Registering the Driver](#step-2-registering)
    - [Step 3: Configuring Credentials](#step-3-configuration)
- [Pattern-Based Fast OTP Dispatching](#pattern-based-otp)
- [Anti-Brute-Force & Rate Limiting](#rate-limiting)
- [Testing SMS Drivers](#testing-sms-drivers)

<a name="introduction"></a>
## Introduction

Reliable SMS delivery is the primary lifeline for customer authentication (One-Time Password / OTP), order status updates, and shipping notifications in Iranian e-commerce.

Reyhan Commerce features an enterprise multi-driver SMS notification engine accessible via the `Sms` facade. The engine abstracts away third-party vendor differences and guarantees instant OTP dispatching using **Pattern-Based Fast SMS APIs (ارسال بر اساس پترن / وب‌سرویس خدماتی)**.

---

<a name="driver-architecture"></a>
## SMS Manager & Driver Architecture

All outgoing SMS messages and verification tokens are dispatched via the `Sms` facade. Under the hood, `SmsManager` resolves the configured driver and normalizes Iranian phone numbers (converting Persian/Arabic digits, formatting with `+98`, and removing leading zeros) automatically.

```php
use Reyhan\Core\Facades\Sms;

// Pattern-based OTP dispatch
Sms::driver('kavenegar')->sendOtp(
    mobile: '09123456789',
    token: '748291',
    template: 'verify-login'
);
```

---

<a name="builtin-providers"></a>
## Built-in SMS Providers

Reyhan includes pre-tested drivers for leading SMS gateways:

| Provider Key | Gateway | Supported Features |
| :--- | :--- | :--- |
| `'kavenegar'` | Kavenegar (کاوه‌نگار) | Fast Lookup Pattern OTP, Standard Bulk SMS, Delivery Reports |
| `'farazsms'` | FarazSMS / IPPanel (فراز اس‌ام‌اس) | Shared Pattern Dispatch, Edge Node Acceleration |
| `'ghasedak'` | Ghasedak (قاصدک) | OTP Template Service, Line Selection |
| `'log'` | Local Log Driver | Outputs SMS content directly to `storage/logs/laravel.log` (Ideal for local testing) |

---

<a name="implementing-custom-driver"></a>
## Implementing a Custom SMS Driver

Let's implement a custom driver for **MeliPayamak** (ملی‌پیامک).

<a name="step-1-contract"></a>
### Step 1: Implementing SmsGatewayContract

Create `app/Services/Sms/MeliPayamakDriver.php`:

```php
<?php

declare(strict_types=1);

namespace App\Services\Sms;

use Illuminate\Http\Client\Factory as HttpFactory;
use Reyhan\Core\Contracts\Sms\SmsGatewayContract;
use Reyhan\Core\DTOs\SmsDispatchResult;
use Reyhan\Core\Exceptions\SmsDeliveryException;

final class MeliPayamakDriver implements SmsGatewayContract
{
    public function __construct(
        private readonly HttpFactory $http,
        private readonly string $username,
        private readonly string $password,
    ) {}

    /**
     * Send instant OTP using shared service patterns (وب‌سرویس خدماتی اشتراکی).
     */
    public function sendOtp(string $mobile, string $token, string $template): SmsDispatchResult
    {
        $response = $this->http->post('https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber', [
            'username' => $this->username,
            'password' => $this->password,
            'text' => [$token],
            'to' => $mobile,
            'bodyId' => (int) $template,
        ]);

        if (! $response->successful() || (int) $response->json('RetStatus') !== 1) {
            throw new SmsDeliveryException(
                'Failed to send OTP via MeliPayamak: '.$response->body()
            );
        }

        return new SmsDispatchResult(
            successful: true,
            messageId: (string) $response->json('Value'),
            provider: 'melipayamak'
        );
    }

    /**
     * Send standard transactional or promotional text message.
     */
    public function sendText(string $mobile, string $message): SmsDispatchResult
    {
        $response = $this->http->post('https://rest.payamak-panel.com/api/SendSMS/SendSMS', [
            'username' => $this->username,
            'password' => $this->password,
            'to' => $mobile,
            'from' => '50004...',
            'text' => $message,
            'isflash' => false,
        ]);

        if (! $response->successful() || (int) $response->json('RetStatus') !== 1) {
            throw new SmsDeliveryException('Failed to dispatch SMS: '.$response->body());
        }

        return new SmsDispatchResult(
            successful: true,
            messageId: (string) $response->json('Value'),
            provider: 'melipayamak'
        );
    }
}
```

<a name="step-2-registering"></a>
### Step 2: Registering the Driver

Register the custom driver in `app/Providers/AppServiceProvider.php`:

```php
<?php

declare(strict_types=1);

namespace App\Providers;

use App\Services\Sms\MeliPayamakDriver;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\ServiceProvider;
use Reyhan\Core\Facades\Sms;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Sms::extend('melipayamak', function (Application $app) {
            return new MeliPayamakDriver(
                http: $app->make('http'),
                username: (string) config('sms.drivers.melipayamak.username'),
                password: (string) config('sms.drivers.melipayamak.password')
            );
        });
    }
}
```

<a name="step-3-configuration"></a>
### Step 3: Configuring Credentials

Update `config/sms.php`:

```php
// config/sms.php

return [
    'default' => env('SMS_DEFAULT_DRIVER', 'kavenegar'),

    'drivers' => [
        'melipayamak' => [
            'username' => env('MELIPAYAMAK_USERNAME'),
            'password' => env('MELIPAYAMAK_PASSWORD'),
        ],
        // Other drivers...
    ],

    'templates' => [
        'otp' => env('SMS_OTP_TEMPLATE', '12345'),
        'order_confirmed' => env('SMS_ORDER_CONFIRMED_TEMPLATE', '67890'),
    ],
];
```

---

<a name="pattern-based-otp"></a>
## Pattern-Based Fast OTP Dispatching

> [!IMPORTANT]  
> Regular promotional lines in Iran block recipients with active blacklists (DND / لیست سیاه). For OTP authentication, **always configure a pattern template** that routes through verified telecommunication service lines (خطوط خدماتی).

---

<a name="rate-limiting"></a>
## Anti-Brute-Force & Rate Limiting

Reyhan's built-in `VerifyOtpAction` and `SendOtpAction` enforce strict security throttling out of the box:

- **120-Second Resend Window:** Customers can only request a new code every 2 minutes.
- **Maximum 5 Verification Attempts:** Exceeding 5 incorrect attempts permanently burns the OTP token and triggers a 15-minute cooldown.

---

<a name="testing-sms-drivers"></a>
## Testing SMS Drivers

In local testing or CI pipelines, use the `log` driver or fake HTTP requests:

```php
<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Http;
use Reyhan\Core\Facades\Sms;

it('dispatches otp code through melipayamak driver', function () {
    Http::fake([
        'https://rest.payamak-panel.com/api/SendSMS/BaseServiceNumber' => Http::response([
            'RetStatus' => 1,
            'Value' => '987654321',
        ], 200),
    ]);

    $result = Sms::driver('melipayamak')->sendOtp(
        mobile: '09121112233',
        token: '123456',
        template: '9988'
    );

    expect($result->successful)->toBeTrue()
        ->and($result->messageId)->toBe('987654321');
});
```
