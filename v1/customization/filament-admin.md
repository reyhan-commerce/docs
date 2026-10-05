# Customizing Filament Admin Panel

- [Introduction](#introduction)
- [Admin Panel Architecture](#panel-architecture)
- [Adding Custom Resources](#adding-resources)
- [Adding Custom Dashboard Widgets](#adding-widgets)
- [Theming, Branding & Logo](#theming-and-branding)
- [RBAC Role & Permission Management (Filament Shield)](#rbac-management)
- [Real-time Livewire & WebSocket Updates](#realtime-updates)

<a name="introduction"></a>
## Introduction

Reyhan Commerce includes a comprehensive backoffice management console powered by **Filament v5** and **Livewire 3**. 

Rather than locking you into a monolithic, unchangeable dashboard, the admin panel is configured directly inside your application's `app/Providers/Filament/AdminPanelProvider.php`. You have complete freedom to register custom Eloquent resources, interactive charts, custom pages, navigation groups, and role-based access control (RBAC) permission gates.

---

<a name="panel-architecture"></a>
## Admin Panel Architecture

All admin features are defined within the `admin` panel provider. Core Reyhan resources (Products, Orders, Customers, Inventory, Coupons, Ledger) are auto-discovered from the core package, while your application's custom resources inside `app/Filament/` are loaded seamlessly alongside them.

```php
// app/Providers/Filament/AdminPanelProvider.php

namespace App\Providers\Filament;

use Filament\Panel;
use Filament\PanelProvider;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandName('Reyhan Admin')
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets');
    }
}
```

---

<a name="adding-resources"></a>
## Adding Custom Resources

To create a new administrative resource (for example, managing B2B Corporate Contracts):

```bash
php artisan make:filament-resource CorporateContract
```

This creates `app/Filament/Resources/CorporateContractResource.php`:

```php
<?php

declare(strict_types=1);

namespace App\Filament\Resources;

use App\Models\CorporateContract;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

final class CorporateContractResource extends Resource
{
    protected static ?string $model = CorporateContract::class;
    protected static ?string $navigationIcon = 'heroicon-o-briefcase';
    protected static ?string $navigationGroup = 'مدیریت سازمانی B2B';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('company_name')
                ->label('نام شرکت')
                ->required(),
            TextInput::make('credit_ceiling')
                ->label('سقف اعتبار (ریال)')
                ->numeric()
                ->required(),
            DatePicker::make('contract_expires_at')
                ->label('تاریخ انقضای قرارداد'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('company_name')->label('شرکت')->searchable(),
            TextColumn::make('credit_ceiling')->label('سقف اعتبار')->numeric(),
            TextColumn::make('contract_expires_at')->label('انقضا')->date(),
        ]);
    }
}
```

---

<a name="adding-widgets"></a>
## Adding Custom Dashboard Widgets

You can add real-time analytical chart widgets to the admin dashboard:

```bash
php artisan make:filament-widget SalesOverviewChart --chart
```

```php
<?php

declare(strict_types=1);

namespace App\Filament\Widgets;

use Filament\Widgets\ChartWidget;
use Reyhan\Core\Models\Order;

final class SalesOverviewChart extends ChartWidget
{
    protected static ?string $heading = 'نمودار فروش هفتگی (تومان)';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'فروش ناخالص',
                    'data' => [1200, 1900, 3000, 5000, 2400, 4800, 7200],
                    'borderColor' => '#00c975',
                ],
            ],
            'labels' => ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
```

---

<a name="theming-and-branding"></a>
## Theming, Branding & Logo

You can customize panel colors, brand assets, and RTL orientation directly in `AdminPanelProvider.php`:

```php
use Filament\Support\Colors\Color;

$panel
    ->brandLogo(asset('logo.png'))
    ->darkModeBrandLogo(asset('logo-dark.png'))
    ->brandLogoHeight('2.5rem')
    ->colors([
        'primary' => Color::Emerald,
        'danger' => Color::Rose,
        'warning' => Color::Amber,
        'info' => Color::Sky,
    ])
    ->font('Plus Jakarta Sans');
```

---

<a name="rbac-management"></a>
## RBAC Role & Permission Management (Filament Shield)

Reyhan includes **Filament Shield** (`bezhansalleh/filament-shield`) pre-configured out of the box for granular permission management:

```bash
# Generate permissions for custom resources
php artisan shield:generate --all
```

Admin staff can manage permissions, create roles (e.g. *Warehouse Operator*, *Accountant*, *Support Manager*), and assign granular read/write gates via the **Roles & Permissions** tab in the admin console.

---

<a name="realtime-updates"></a>
## Real-time Livewire & WebSocket Updates

The admin console supports real-time order notifications via Laravel Reverb:

> [!NOTE]  
> When new orders are placed or verified by customers, the Orders table automatically refreshes in real-time without requiring a browser page reload.
