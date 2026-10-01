---
layout: home

hero:
  name: "Reyhan Commerce"
  text: "The Sovereign Headless E-Commerce Framework"
  tagline: "Engineered for uncompromising performance, domain-driven actions, strict data isolation, dynamic model swapping, and zero-breaking upgrades."
  image:
    src: /icon.svg
    alt: Reyhan Commerce Framework
  actions:
    - theme: brand
      text: 🚀 Get Started
      link: /v1/getting-started/overview
    - theme: alt
      text: 🏛 Core Architecture
      link: /v1/architecture/lifecycle
    - theme: alt
      text: 📦 GitHub Repository
      link: https://github.com/reyhan-commerce/reyhan

features:
  - icon: 🛡
    title: Strict Core vs. User-Land Boundary
    details: Complete customization freedom without touching core code. Receive seamless central framework upgrades with zero fear of breaking user code.
  - icon: 🎯
    title: Action & DTO Architecture
    details: Strongly-typed data transfer objects (DTOs), dedicated single-responsibility Action classes, native database transactions, and zero repository overhead.
  - icon: 🔌
    title: Dynamic Model Swapping
    details: Seamlessly swap and extend core domain models (Product, Order, Variant) with strict contracts using the central Reyhan registry.
  - icon: 🛠
    title: Unified Orchestrator CLI (./reyhan)
    details: Manage the entire system lifecycle—from automated health diagnostics and database migrations to zero-downtime rolling updates.
  - icon: 🎨
    title: Cascading Storefront Engine
    details: Instant component and layout overrides, optimistic reactive cart state, zero-custom-CSS design tokens, and automated SEO metadata.
  - icon: 💳
    title: Multi-Driver Payments & SMS Engine
    details: Modular driver-based architecture for banking gateways, merchant aggregators, and pattern-based transactional SMS notifications.
---

<div class="vp-doc" style="max-width: 900px; margin: 40px auto;">

## Why Reyhan Commerce?

Reyhan is not a bloated monolithic e-commerce script or a superficial template. It is an **architecturally pure, headless e-commerce framework** designed for teams building high-traffic, resilient, and fully customizable storefronts.

### Architectural Blueprint

```text
┌─────────────────────────────────────────────────────────────┐
│                    Reyhan Orchestrator                      │
│                  (./reyhan & create-reyhan)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
       ┌───────────────────────┴───────────────────────┐
       ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│       Backend Domain         │        │      Storefront Engine       │
│  - Action & DTO Architecture │        │  - Component Overriding      │
│  - Dynamic Model Swapping    │        │  - app.config Theming        │
│  - Multi-Driver Payments/SMS │        │  - Optimistic Cart Store     │
│  - PostgreSQL 17 + Redis 7   │        │  - Zero Custom CSS Tokens    │
└──────────────────────────────┘        └──────────────────────────────┘
```

</div>
