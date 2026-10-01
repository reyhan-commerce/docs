# Branding & Theming (`app.config.ts`)

The storefront layer in Reyhan Commerce is built with a **Tokens-First Design Standard**. Store owners and developers can customize store identity, logos, top announcement banners, color palettes, and typography purely through configuration without modifying frontend source code.

---

## 1. The `app.config.ts` Manifest

Located at `frontend/app/app.config.ts`, this file defines the visual DNA of your storefront:

```ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'emerald',
      neutral: 'zinc',
    },
  },
  reyhan: {
    brand: {
      name: 'Reyhan Luxury Cosmetics',
      slogan: 'Pure Elegance, Fast Delivery 🌿',
      logoUrl: '/brand/logo.svg',
      faviconUrl: '/brand/favicon.ico',
    },
    header: {
      announcementBar: {
        enabled: true,
        text: '✨ Free express shipping on all orders over $50!',
        link: '/shipping-policy',
      },
      searchPlaceholder: 'Search over 2,000 beauty products...',
    },
    footer: {
      trustBadges: [
        { title: '100% Original Guarantee', icon: 'i-lucide-shield-check' },
        { title: '24/7 Priority Support', icon: 'i-lucide-headset' },
        { title: 'Instant Courier Delivery', icon: 'i-lucide-truck' },
      ],
      socialLinks: {
        instagram: 'https://instagram.com/reyhanofficial',
        telegram: 'https://t.me/reyhanofficial',
      },
    },
  },
})
```

---

## 2. Dynamic Dark and Light Mode

Reyhan includes zero-flash server-side evaluated theme switching:
* **Light Palette:** Crisp pearl white surfaces (`#FFFFFF`) with warm neutral accents.
* **Dark Palette:** Deep slate zinc surfaces (`#09090B`) designed for high contrast and reduced eye strain.
* **Semantic Utility Tokens:** Always use semantic tokens (`bg-default`, `bg-elevated`, `text-default`, `border-muted`) rather than hardcoded hex codes.
