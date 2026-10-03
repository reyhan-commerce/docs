# Official Storefront (Nuxt 4)

::: tip Sovereign Headless Architecture
**Reyhan Commerce** is an unopinionated, 100% headless backend e-commerce framework. The backend engine provides high-performance RESTful APIs, OpenAPI contracts, and WebSocket broadcast channels, allowing you to connect **any** frontend technology—including Next.js, Remix, mobile native apps (Flutter / Swift / Kotlin), or Telegram Mini Apps.
:::

---

## Official Nuxt 4 Storefront — Coming Soon

To provide a reference turnkey shopping experience, the Reyhan Commerce team is actively developing an **Official Decoupled Storefront** built on **Nuxt 4**, **Vue 3**, **Tailwind CSS v4**, and **Nuxt UI**.

The official storefront is maintained as an independent repository:
👉 [**github.com/reyhan-commerce/storefront-nuxt**](https://github.com/reyhan-commerce/storefront-nuxt)

```text
┌─────────────────────────────────────────────────────────────┐
│                 reyhan-commerce/reyhan                      │
│        (Laravel 13 Headless Commerce Engine & API)          │
│              http://localhost:8000/api/v1                   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                REST JSON APIs & WebSockets
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             reyhan-commerce/storefront-nuxt                 │
│         (Decoupled Nuxt 4 Commercial Storefront)            │
│                 🚀 COMING SOON / IN ACTIVE DEV               │
└─────────────────────────────────────────────────────────────┘
```

---

## ⚡ Planned Features & Capabilities

When released, the official storefront will offer:

* **Blazing Fast SSR & Edge Ready:** Full Server-Side Rendering (SSR) optimized for search engine bots and instantaneous First Contentful Paint (FCP).
* **Bilingual & Native RTL:** Complete RTL support, Persian Shamsi calendar, and the variable Vazirmatn font family.
* **100% Nuxt UI & Tailwind CSS 4:** Modern CSS-first theming with dark/light mode toggle and zero custom CSS overhead.
* **Optimistic Cart & Checkout:** Instant slide-over cart drawer synchronized with backend Redis sessions and temporary two-tier inventory reservations.
* **Iranian Payment Gateway Redirects:** Pre-configured support for Zarinpal, Saman Bank (SEP), Mellat Bank (Behpardakht), and sandbox gateways.
* **Zero-Friction In-Browser Proof-of-Work (PoW):** Transparent anti-bot cryptographic challenges replacing intrusive visual captchas.

---

## 🛠️ Building Your Own Custom Storefront Today

Because Reyhan Commerce is completely headless, you do not need to wait for the official storefront to launch your e-commerce store!

### 1. Explore OpenAPI / Scalar API Docs
Boot your backend and visit:
```text
http://localhost:8000/docs/api
```
Here you can test all customer endpoints, including authentication (`/api/v1/auth/otp/*`), catalog browsing (`/api/v1/products`), cart management (`/api/v1/cart`), and checkout (`/api/v1/checkout/*`).

### 2. Generate TypeScript API SDKs
Export the OpenAPI specification from your Reyhan backend and generate a typed client for any framework:

```bash
# Export the OpenAPI specification
php artisan scramble:export --path=storage/app/openapi.json

# Or generate a TypeScript client using openapi-typescript-codegen
npx openapi-typescript-codegen -i storage/app/openapi.json -o ./src/api
```

### 3. Connect via Sanctum Tokens
Authenticate customers via OTP, store the Sanctum bearer token in HTTP-only cookies or client storage, and attach it to outgoing requests:

```ts
const response = await fetch('http://localhost:8000/api/v1/cart', {
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${userToken}`,
  }
});
```

---

## 📢 Development Status & Release Updates

Follow progress and contribute to the storefront repository on GitHub:
- Repository: [reyhan-commerce/storefront-nuxt](https://github.com/reyhan-commerce/storefront-nuxt)
- Release Milestones: [Roadmap & Milestones](/v1/roadmap)
