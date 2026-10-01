# Component Overriding System

Reyhan Commerce implements an automated **Cascading Component Resolution Engine**. When you want to redesign or alter the behavior of any core UI widget (such as a product card, price tag, or cart drawer), you do not fork or modify core files.

---

## 1. How Component Precedence Works

```text
┌─────────────────────────────────────────────────────────────┐
│             User-Land Directory: frontend/app/              │
│  - components/ProductCard.vue (Found! Takes Highest Priority)│
└──────────────────────────────┬──────────────────────────────┘
                               │
            Overwrites at Build Time
                               ▼
┌─────────────────────────────────────────────────────────────┐
│              Framework Core Layer (Default)                 │
│  - core/components/ProductCard.vue (Ignored)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Practical Walkthrough: Customizing `ProductCard.vue`

Suppose you wish to add a custom video badge or 3D view toggle to the default product card.

### Step 1: Create the file in `frontend/app/components/`
Create `frontend/app/components/ProductCard.vue`:

```vue
<script setup lang="ts">
interface Props {
  product: {
    id: number
    title: string
    slug: string
    price: number
    compareAtPrice?: number
    thumbnail: string
    isNew?: boolean
  }
}

const props = defineProps<Props>()
</script>

<template>
  <UCard class="group relative overflow-hidden transition-all hover:shadow-xl">
    <div class="relative aspect-square overflow-hidden rounded-xl bg-muted">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <UBadge
        v-if="product.isNew"
        color="primary"
        class="absolute start-3 top-3"
      >
        New Arrival
      </UBadge>
    </div>

    <div class="mt-4 space-y-2">
      <NuxtLink :to="`/products/${product.slug}`" class="block font-semibold hover:text-primary">
        {{ product.title }}
      </NuxtLink>
      <PriceTag :price="product.price" :compare-at="product.compareAtPrice" />
    </div>
  </UCard>
</template>
```

### Step 2: Immediate Compilation
That is all that is required. The compiler immediately replaces all usages of `<ProductCard />` across the catalog, homepage, search results, and category grids with your customized version.
