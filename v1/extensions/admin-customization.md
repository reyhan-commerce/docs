# Customizing the Admin Panel

Reyhan's administrative backoffice is powered by an RTL-first, high-density **Filament Admin Panel**. Extensions can register new navigation groups, resource tables, metrics widgets, and system settings tabs.

---

## 1. Registering Custom Resources

To introduce a new administrative resource from an extension (e.g. `LoyaltyWalletResource`):

```php
namespace Reyhan\Extensions\LoyaltyPoints\Filament\Resources;

use Filament\Resources\Resource;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Form;
use Filament\Forms\Components\TextInput;

class LoyaltyWalletResource extends Resource
{
    protected static ?string $model = \App\Models\LoyaltyWallet::class;
    protected static ?string $navigationIcon = 'heroicon-o-gift';
    protected static ?string $navigationGroup = 'Customers & Growth';

    public static function form(Form $form): Form
    {
        return $form->schema([
            TextInput::make('points')
                ->label('Available Balance')
                ->numeric()
                ->required(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('user.mobile')->label('Customer Phone')->searchable(),
            TextColumn::make('points')->label('Coins Balance')->sortable(),
            TextColumn::make('updated_at')->jalaliDateTime()->label('Last Updated'),
        ]);
    }
}
```

---

## 2. Registering in Panel Service Provider

In your extension's Service Provider:

```php
use Filament\Panel;
use Reyhan\Extensions\LoyaltyPoints\Filament\Resources\LoyaltyWalletResource;

public function boot(): void
{
    Panel::configureUsing(function (Panel $panel) {
        $panel->resources([
            LoyaltyWalletResource::class,
        ]);
    });
}
```
