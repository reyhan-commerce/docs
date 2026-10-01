# Custom Layouts & Pages

Just like components, storefront layouts and routes can be customized or added without touching core engine files.

---

## 1. Overriding Core Layouts

Reyhan comes with standard e-commerce layouts:
* `layouts/default.vue`: Full store layout containing announcement bar, top navigation, category mega-menu, and footer.
* `layouts/checkout.vue`: Distraction-free, high-conversion layout stripped of distracting navigation links during final payment.
* `layouts/auth.vue`: Centered card layout for mobile OTP verification.

To customize any layout, create a file with the same name inside `frontend/app/layouts/`:

```vue
<!-- frontend/app/layouts/checkout.vue -->
<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-950">
    <header class="border-b border-border py-4">
      <div class="container mx-auto flex items-center justify-between px-4">
        <AppLogo />
        <div class="flex items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-lock" class="h-4 w-4 text-primary" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <slot />
    </main>
  </div>
</template>
```

---

## 2. Adding Custom Storefront Pages

To create custom landing pages (e.g. `/brand-story`, `/black-friday`, `/faq`):
Simply create the corresponding `.vue` file in `frontend/app/pages/`:

```vue
<!-- frontend/app/pages/about.vue -->
<script setup lang="ts">
useSeoMeta({
  title: 'About Our Story - Reyhan Store',
  description: 'Learn how our organic cosmetic brand was founded.',
})
</script>

<template>
  <div class="prose dark:prose-invert mx-auto py-12 px-4">
    <h1>Our Heritage & Vision</h1>
    <p>Crafted with pure ingredients and zero compromises...</p>
  </div>
</template>
```
