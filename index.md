---
layout: home

hero:
  name: "Reyhan Commerce"
  text: "The Sovereign Headless E-Commerce Backend Framework"
  tagline: "Engineered for Laravel 13 with 100% strict typing, single-responsibility domain actions, dynamic model extensibility, two-tier concurrency locks, and double-entry financial precision."
  image:
    src: /icon.svg
    alt: Reyhan Commerce Backend Framework
  actions:
    - theme: brand
      text: 🚀 Get Started
      link: /v1/getting-started/overview
    - theme: alt
      text: 🏛 Core Architecture
      link: /v1/architecture/lifecycle
    - theme: alt
      text: 📦 Packagist (Core)
      link: https://packagist.org/packages/reyhan-commerce/core

features:
  - icon: 🛡
    title: Strict Core vs. User-Land Boundary
    details: Clean Composer package architecture. Extend models and inject pipelines with zero fear of breaking vendor code during framework updates.
  - icon: 🎯
    title: Action & DTO Architecture
    details: Follows Farshid's premier Laravel Constitution with final Action classes, typed DTOs, native Eloquent queries, and strictly zero repository bloat.
  - icon: 🔌
    title: Dynamic Model Extensibility
    details: Swap or augment core Eloquent models (Product, Order, Variant) at runtime using Reyhan::useModel() with automatic polymorphic resolution.
  - icon: 🔒
    title: Two-Tier Concurrency Protection
    details: Prevents overselling during high-traffic flash sales using fast atomic Redis memory mutexes paired with PostgreSQL pessimistic row locks.
  - icon: ⚖️
    title: Double-Entry Financial Ledger
    details: Strictly balanced accounting entries (debit == credit) for all monetary transactions, customer wallets, and invoice records.
  - icon: 💳
    title: Multi-Driver Payments & Iranian SMS
    details: Driver-based integration with Shetabit banking gateways (Zarinpal, SEP, Mellat) and pattern-based transactional SMS engines.
---

<div class="vp-doc" style="max-width: 900px; margin: 40px auto;">

## Headless Architecture & Decoupled Ecosystem

Reyhan Commerce is an architecturally pure, headless backend e-commerce framework designed for engineering teams building resilient, scalable commerce platforms.

### Architecture Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                 reyhan-commerce/installer                    │
│      Composer Global CLI Scaffolder: `reyhan new my-store`  │
└──────────────────────────────┬──────────────────────────────┘
                               │ provisions
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   reyhan-commerce/reyhan                    │
│   Starter Application Skeleton (Standard Laravel 13 Layout) │
│       app/, config/, database/, extensions/, routes/        │
└──────────────────────────────┬──────────────────────────────┘
                               │ consumes
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    reyhan-commerce/core                     │
│  Sovereign Commerce Engine Package (vendor/reyhan-commerce) │
│  - First-Class Domain Facades (Cart, Pricing, Ledger)       │
│  - Commercial Calculation & Order Fulfillment Pipelines     │
│  - Dynamic Model Resolution & Extension Service Provider    │
│  - Filament 5 Admin Backoffice & OpenAPI Documentation      │
└──────────────────────────────┬──────────────────────────────┘
                               │
               RESTful JSON APIs & WebSockets
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│    Custom Client Layers      │        │  Official Nuxt 4 Storefront  │
│  - Flutter / React Native    │        │  - reyhan-commerce/          │
│  - Telegram Mini Apps        │        │    storefront-nuxt           │
│  - Next.js / Svelte / Remix  │        │  - 🚀 Coming Soon / In Dev   │
└──────────────────────────────┘        └──────────────────────────────┘
```

</div>
