# Core vs. User-Land Boundary

The most distinctive architectural strength of **Reyhan Commerce** is the unyielding boundary between the **Framework Core** and **User Land**.

In traditional e-commerce projects, developers directly modify controller files, database seeders, or blade/vue templates. When the parent framework publishes a security patch or a major feature update, running `git merge` or updating packages results in merge conflicts, broken logic, and broken deployments.

Reyhan solves this permanently through structural decoupling:

```text
┌─────────────────────────────────────────────────────────────┐
│                 Reyhan Framework Core (Vendor)              │
│  - Immutable e-commerce engine                              │
│  - Standard REST API contracts & routes                     │
│  - Base models, migrations & admin panels                   │
│  - Upgraded via: ./reyhan update                            │
└──────────────────────────────┬──────────────────────────────┘
                               │
            Overrides & Extends via Clean Contracts
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  User-Land (Your Store Code)                │
│  - backend/config/reyhan.php (Dynamic Model Bindings)       │
│  - backend/extensions/ (Custom domain plugins)              │
│  - frontend/app/app.config.ts (Branding tokens)             │
│  - frontend/app/components/ (Cascading component overrides) │
│  - frontend/app/pages/ (Custom routes & views)              │
└─────────────────────────────────────────────────────────────┘
```

---

## The Golden Rules of Reyhan Development

### Rule 1: Never Touch Core Backend Code
Do not edit files inside the core engine namespace. If you need to:
* **Add extra fields to the Product model:** Extend the base model in `App\Models\CustomProduct` and register it in `config/reyhan.php`.
* **Add a new business workflow:** Create an Action in `backend/extensions/my-extension/` or `app/Actions/`.
* **Add a custom payment driver:** Register the driver class in `config/reyhan.php`.

### Rule 2: Never Touch Core Storefront Templates
Do not edit core components inside node modules or core layers. To customize a component:
* Place a file with the identical name in `frontend/app/components/` (e.g. `frontend/app/components/ProductCard.vue`).
* The build engine automatically gives precedence to your user-land file during compilation and SSR.

---

## Upgrade Safety Guarantee

Because user customizations live entirely within user-land directories (`extensions/`, `config/reyhan.php`, and `frontend/app/`), running:

```bash
./reyhan update
```

will:
1. Create a safe, automated PostgreSQL backup.
2. Upgrade core framework binaries and composer packages.
3. Run new database migrations idempotently.
4. Upgrade admin panel components.
5. Recompile frontend layers and flush caches.

All without touching or overwriting a single line of your custom business logic.
