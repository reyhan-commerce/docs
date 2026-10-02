# Building Your First Extension

In this step-by-step guide, we will build a custom **Loyalty Points Extension** that awards reward coins to customers upon completed order payments.

---

## Step 1: Scaffold Extension Directory

Create the directory structure under `backend/extensions/loyalty-points/`:

```bash
mkdir -p backend/extensions/loyalty-points/src/{Actions,Data,Providers}
```

---

## Step 2: Define `module.json`

Create `backend/extensions/loyalty-points/module.json`:

```json
{
  "name": "loyalty-points",
  "title": "Customer Loyalty Points",
  "version": "1.0.0",
  "description": "Awards reward coins on order completion.",
  "providers": [
    "Reyhan\\Extensions\\LoyaltyPoints\\Providers\\LoyaltyPointsServiceProvider"
  ],
  "enabled": true
}
```

---

## Step 3: Implement Domain Action

Create `backend/extensions/loyalty-points/src/Actions/AwardOrderPointsAction.php`:

```php
namespace Reyhan\Extensions\LoyaltyPoints\Actions;

use Reyhan\Core\Models\Order;
use Illuminate\Support\Facades\DB;

final class AwardOrderPointsAction
{
    /**
     * Calculate 1% cash-back coins on order total.
     */
    public function execute(Order $order): int
    {
        $points = (int) ($order->total_amount * 0.01);

        DB::table('customer_loyalty_wallets')
            ->updateOrInsert(
                ['user_id' => $order->user_id],
                ['points'  => DB::raw("points + {$points}")]
            );

        return $points;
    }
}
```

---

## Step 4: Register Service Provider & Event Listener

Create `backend/extensions/loyalty-points/src/Providers/LoyaltyPointsServiceProvider.php`:

```php
namespace Reyhan\Extensions\LoyaltyPoints\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Reyhan\Core\Events\Payment\PaymentVerifiedEvent;
use Reyhan\Extensions\LoyaltyPoints\Actions\AwardOrderPointsAction;

class LoyaltyPointsServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // Listen to core framework event
        Event::listen(OrderPaidEvent::class, function (OrderPaidEvent $event) {
            app(AwardOrderPointsAction::class)->execute($event->order);
        });
    }
}
```

Now, whenever an order is marked as paid across the system, your isolated plugin seamlessly awards loyalty points!
