---
layout: home

hero:
  name: "The clean stack for"
  text: "Artisans and commerce."
  tagline: "Reyhan is batteries-included so everyone can build and ship modern online stores at ridiculous speed."
  image:
    src: /logo.png
    alt: Reyhan Commerce Framework
  actions:
    - theme: brand
      text: Get started →
      link: /v1/getting-started/installation
    - theme: alt
      text: View framework docs
      link: /v1/getting-started/overview
---

<div class="vp-doc" style="max-width: 1040px; margin: 40px auto; padding: 0 20px;">

<!-- Top Badge Pill -->
<div style="text-align: center; margin-bottom: 48px;">
<div class="hero-pill">
<span class="hero-pill-dot"></span>
<span>Reyhan Framework v1.0.0 is released</span>
<span style="opacity: 0.5;">—</span>
<a href="/docs/v1/getting-started/overview" style="color: var(--vp-c-brand-1); text-decoration: underline; font-weight: 700;">Explore the Architecture →</a>
</div>
</div>

<!-- =======================================================================
     Section 2: Sovereign Extensibility
     ======================================================================= -->
<div style="margin: 72px 0;">
<div class="section-header">
<div class="section-tagline">Zero Core Modification</div>
<h2 class="section-title">Sovereign Extensibility.</h2>
<p class="section-desc">
Never modify vendor files again. Customize every layer of your commerce stack with dynamic model registries, hookable pipelines, and drop-in modular plugins.
</p>
</div>

<div class="feature-grid">
<div class="feature-card">
<div class="feature-icon-box">🔌</div>
<div class="feature-card-title">Dynamic Model Registry</div>
<div class="feature-card-desc">
Swap or augment any core Eloquent model (<code>Product</code>, <code>Order</code>, <code>User</code>, <code>Cart</code>) at runtime via <code>config/reyhan.php</code>. All core actions resolve your subclass automatically.
</div>
</div>

<div class="feature-card">
<div class="feature-icon-box">🔀</div>
<div class="feature-card-title">Hookable Pipelines</div>
<div class="feature-card-desc">
Inject custom stages into critical business workflows (such as B2B credit limits, fraud verification, or VIP discount calculations) using Laravel's Pipeline pattern.
</div>
</div>

<div class="feature-card">
<div class="feature-icon-box">🧩</div>
<div class="feature-card-title">Modular Extensions (PSR-4)</div>
<div class="feature-card-desc">
Drop self-contained extensions inside <code>extensions/</code>. Reyhan dynamically registers PSR-4 autoloading and discovers Service Providers without editing your root <code>composer.json</code>.
</div>
</div>
</div>
</div>

---

<!-- =======================================================================
     Section 3: High Concurrency & Financial Precision
     ======================================================================= -->
<div style="margin: 72px 0;">
<div class="section-header">
<div class="section-tagline">Enterprise Reliability</div>
<h2 class="section-title">High Concurrency & Financial Precision.</h2>
<p class="section-desc">
Engineered for flash sales and strict financial accounting. Eliminate inventory overselling and balance every single Rial.
</p>
</div>

<div class="feature-grid">
<div class="feature-card">
<div class="feature-icon-box">🔒</div>
<div class="feature-card-title">Two-Tier Concurrency Locks</div>
<div class="feature-card-desc">
High-speed Redis 7 Sorted Set reservations (with self-purging TTL) combined with PostgreSQL <code>lockForUpdate()</code> pessimistic row locks prevent flash-sale overselling.
</div>
</div>

<div class="feature-card">
<div class="feature-icon-box">⚖️</div>
<div class="feature-card-title">Double-Entry General Ledger</div>
<div class="feature-card-desc">
Every order settlement, wallet transaction, and refund creates strictly balanced journal entries (<code>sum(debits) === sum(credits)</code>) with zero silent balance drift.
</div>
</div>

<div class="feature-card">
<div class="feature-icon-box">⚡️</div>
<div class="feature-card-title">Octane & FrankenPHP Runtime</div>
<div class="feature-card-desc">
Worker-mode execution keeps your application in-memory for microsecond response times and ultra-high throughput under extreme traffic spikes.
</div>
</div>
</div>
</div>

---

<!-- =======================================================================
     Section 4: Tailored for Iranian Commerce
     ======================================================================= -->
<div style="margin: 72px 0;">
<div class="section-header">
<div class="section-tagline">Iranian Commerce Ready</div>
<h2 class="section-title">Tailored for Iranian E-Commerce.</h2>
<p class="section-desc">
First-class support for Iranian payment switches, fast-service SMS patterns, postal logistics tariffs, and automatic text normalization.
</p>
</div>

<div class="feature-grid">
<div class="feature-card">
<div class="feature-icon-box">💳</div>
<div class="feature-card-title">Multi-Driver Bank Gateways</div>
<div class="feature-card-desc">
Unified driver manager supporting Zarinpal, Saman (SEP), Mellat (Behpardakht), Sadad, and offline card-to-card approval workflows.
</div>
</div>

<div class="feature-card">
<div class="feature-icon-box">📲</div>
<div class="feature-card-title">Pattern-Based Fast OTP SMS</div>
<div class="feature-card-desc">
Instant OTP delivery bypassing telecom blacklists via verified service pattern webhooks (Kavenegar, FarazSMS, Ghasedak, MeliPayamak).
</div>
</div>

<div class="feature-card">
<div class="feature-icon-box">🚚</div>
<div class="feature-card-title">Provincial Logistics & Tariffs</div>
<div class="feature-card-desc">
Accurate dimensional weight calculation, neighboring province logic, and carrier drivers for Iran Post (Pishtaz), Tipax, and Chapar.
</div>
</div>
</div>
</div>

---

<!-- =======================================================================
     Section 5: The Ecosystem
     ======================================================================= -->
<div style="margin: 72px 0;">
<div class="section-header">
<div class="section-tagline">Everything You Need</div>
<h2 class="section-title">The Reyhan Ecosystem.</h2>
<p class="section-desc">
A decoupled suite of official packages and starter kits to launch enterprise commerce in record time.
</p>
</div>

<div class="ecosystem-grid">
<div class="ecosystem-card">
<div class="ecosystem-card-tag">Core Engine</div>
<div class="ecosystem-card-name">reyhan-commerce/core</div>
<div class="ecosystem-card-desc">The immutable domain engine package containing actions, typed DTOs, and commercial calculation pipelines.</div>
</div>

<div class="ecosystem-card">
<div class="ecosystem-card-tag">Starter App</div>
<div class="ecosystem-card-name">reyhan-commerce/reyhan</div>
<div class="ecosystem-card-desc">The sovereign application skeleton with Filament v5 admin backoffice, configurations, and Pest 4 test suites.</div>
</div>

<div class="ecosystem-card">
<div class="ecosystem-card-tag">Global CLI</div>
<div class="ecosystem-card-name">reyhan-commerce/installer</div>
<div class="ecosystem-card-desc">Interactive terminal scaffolder powering <code>reyhan new my-store</code> with database selection and catalog seeding.</div>
</div>

<div class="ecosystem-card">
<div class="ecosystem-card-tag">Reactive Storefront</div>
<div class="ecosystem-card-name">storefront-nuxt</div>
<div class="ecosystem-card-desc">Decoupled reactive presentation layer built with Nuxt 4, Tailwind CSS v4, Pinia, and Nuxt UI components.</div>
</div>
</div>
</div>

<!-- =======================================================================
     Section 6: Bottom Hero Call To Action
     ======================================================================= -->
<div class="cta-banner">
<h2 style="font-size: 2.4rem; font-weight: 800; margin-bottom: 12px; border-top: none; letter-spacing: -0.03em;">
Ready to Build Sovereign Commerce?
</h2>
<p style="color: var(--vp-c-text-2); font-size: 1.15rem; max-width: 600px; margin: 0 auto 32px auto; line-height: 1.6;">
Read the official documentation, explore the architecture, and start building with Reyhan Commerce today.
</p>
<div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
<a href="/docs/v1/getting-started/installation" style="background: var(--vp-c-brand-1); color: #000; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 1.05rem; box-shadow: 0 10px 25px -5px rgba(0, 201, 117, 0.4);">
Get Started Now →
</a>
<a href="/docs/v1/customization/overview" style="background: var(--vp-c-bg); border: 1px solid var(--vp-c-gutter); color: var(--vp-c-text-1); font-weight: 600; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 1.05rem;">
Customization & Overrides
</a>
</div>
</div>

</div>
