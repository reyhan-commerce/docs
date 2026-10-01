# Text & Digit Normalization Engine

In regional e-commerce, inconsistency in user input (such as mixed Arabic/Persian keyboards, non-standard Persian numerals, and inconsistent zero-width non-joiners) frequently breaks search indexes and phone number validations.

Reyhan Commerce includes a dedicated **Text Normalization Engine** that automatically cleans incoming requests before they reach validation rules or database queries.

---

## 1. Normalization Pipeline Rules

```text
┌─────────────────────────────────────────────────────────────┐
│                 Incoming Raw Request Payload                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Reyhan Normalization Middleware                │
│  1. Digit Conversion: '۰۱۲۳۴۵۶۷۸۹'  ──▶ '0123456789'        │
│  2. Character Fixes:  'ي', 'ك', 'ة' ──▶ 'ی', 'ک', 'ه'        │
│  3. ZWNJ Standardizer: Standardizes half-spaces in titles   │
│  4. Whitespace Trimming: Removes invisible unicode spaces   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Validated DTO & Search Index Queries            │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Using the Normalizer Programmatically

You can invoke the normalization service directly anywhere in your custom actions or extensions:

```php
namespace App\Services\Normalization;

use App\Services\Normalization\TextNormalizer;

$cleanedMobile = TextNormalizer::normalizeDigits('۰۹۱۲۳۴۵۶۷۸۹');
// Output: '09123456789'

$cleanedTitle = TextNormalizer::normalizePersianCharacters('كرم مرطوب كننده پوست');
// Output: 'کرم مرطوب کننده پوست'
```

---

## 3. Database Search Integration

By combining normalized text inputs with PostgreSQL's `pg_trgm` extension and `GIN` indices, store searches achieve typo tolerance and instant match scoring across product titles and descriptions.
