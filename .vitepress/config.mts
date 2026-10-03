import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

const base = process.env.BASE_PATH || '/docs/'

export default withMermaid(
  defineConfig({
  title: 'Reyhan Commerce',
  titleTemplate: ':title | Reyhan Framework',
  description: 'Official Documentation for the Reyhan Commerce Framework — An enterprise full-stack, headless, and modular e-commerce engine.',
  lang: 'en-US',
  dir: 'ltr',
  base: base,
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}icon.svg` }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${base}favicon.ico` }],
    ['link', { rel: 'shortcut icon', href: `${base}favicon.ico` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}favicon-32x32.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${base}favicon-16x16.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}apple-touch-icon.png` }],
    ['meta', { property: 'og:image', content: 'https://reyhan-commerce.github.io/docs/og-image.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://reyhan-commerce.github.io/docs/og-image.png' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap' }],
    ['meta', { name: 'theme-color', content: '#00c975' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
  ],

  themeConfig: {
    siteTitle: 'Reyhan Commerce',
    logo: '/icon.svg',

    nav: [
      { text: 'Getting Started', link: '/v1/getting-started/overview' },
      { text: 'Architecture', link: '/v1/architecture/lifecycle' },
      { text: 'Backend Domain', link: '/v1/backend/domain-facades' },
      { text: 'Extensions', link: '/v1/extensions/plugin-architecture' },
      { text: 'CLI Reference', link: '/v1/cli/cli-reference' },
      { text: 'Storefront (Coming Soon)', link: '/v1/storefront/official-storefront' },
      {
        text: 'v1.x (Stable)',
        items: [
          { text: 'v1.x (Current Stable)', link: '/v1/getting-started/overview' },
          { text: 'Roadmap & Future', link: '/v1/roadmap' },
          { text: 'Changelog / Releases', link: 'https://github.com/reyhan-commerce/reyhan/releases' }
        ]
      }
    ],

    sidebar: {
      '/v1/': [
        {
          text: '🚀 Getting Started',
          collapsed: false,
          items: [
            { text: 'Overview & Philosophy', link: '/v1/getting-started/overview' },
            { text: 'Installation Guide', link: '/v1/getting-started/installation' },
            { text: 'Configuration & BYOD', link: '/v1/getting-started/configuration' },
            { text: 'Directory Anatomy', link: '/v1/getting-started/directory-structure' },
            { text: 'Upgrade Guide', link: '/v1/getting-started/upgrade-guide' }
          ]
        },
        {
          text: '🏛 Core Architecture',
          collapsed: false,
          items: [
            { text: 'Request Lifecycle', link: '/v1/architecture/lifecycle' },
            { text: 'Core vs. User Land Boundary', link: '/v1/architecture/core-vs-userland' },
            { text: 'Dynamic Model Swapping', link: '/v1/architecture/model-swapping' },
            { text: 'Multi-Auth & Guard Boundaries', link: '/v1/architecture/multi-auth-guards' }
          ]
        },
        {
          text: '⚙️ Backend Domain Logic',
          collapsed: false,
          items: [
            { text: 'First-Class Domain Facades', link: '/v1/backend/domain-facades' },
            { text: 'Hookable Commercial Pipelines', link: '/v1/backend/commercial-pipelines' },
            { text: 'Double-Entry Financial Ledger', link: '/v1/backend/financial-ledger' },
            { text: 'Actions & Strongly-Typed DTOs', link: '/v1/backend/actions-and-dtos' },
            { text: 'Catalog, Products & Variants', link: '/v1/backend/catalog-and-products' },
            { text: 'Cart, Checkout & Concurrency Locks', link: '/v1/backend/cart-and-checkout' },
            { text: 'Payment Gateway Drivers', link: '/v1/backend/payment-drivers' },
            { text: 'SMS Multi-Driver & Notifications', link: '/v1/backend/sms-and-notifications' },
            { text: 'Text & Digit Normalization Engine', link: '/v1/backend/text-normalization' }
          ]
        },
        {
          text: '🎨 Official Storefront',
          collapsed: false,
          items: [
            { text: 'Nuxt 4 Storefront (Coming Soon)', link: '/v1/storefront/official-storefront' }
          ]
        },
        {
          text: '🧩 Extensions & Modular Plugins',
          collapsed: false,
          items: [
            { text: 'Plugin Architecture & module.json', link: '/v1/extensions/plugin-architecture' },
            { text: 'Building Your First Extension', link: '/v1/extensions/creating-extension' },
            { text: 'Customizing the Admin Panel', link: '/v1/extensions/admin-customization' }
          ]
        },
        {
          text: '🛠 CLI Tools & Operations',
          collapsed: false,
          items: [
            { text: 'Orchestrator CLI Reference (./reyhan)', link: '/v1/cli/cli-reference' },
            { text: 'System Health Diagnostics (doctor)', link: '/v1/cli/health-check-doctor' },
            { text: 'Zero-Downtime Safe Updates', link: '/v1/cli/safe-updates' },
            { text: 'Production & Docker Deployment', link: '/v1/cli/production-deployment' }
          ]
        },
        {
          text: '🗺 Ecosystem & Evolution',
          collapsed: true,
          items: [
            { text: 'Roadmap & Milestones', link: '/v1/roadmap' }
          ]
        }
      ]
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/reyhan-commerce/reyhan' }
    ],

    outline: {
      level: [2, 3],
      label: 'On this page'
    },

    docFooter: {
      prev: 'Previous Page',
      next: 'Next Page'
    },

    editLink: {
      pattern: 'https://github.com/reyhan-commerce/docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Last updated'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 Reyhan Commerce Framework'
    }
  }
}))
