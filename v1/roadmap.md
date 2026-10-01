# Framework Roadmap & Ecosystem

The long-term development of **Reyhan Commerce** is focused on architectural purity, headless performance, AI agent integrations, and omni-channel scale.

---

## 🎯 Version 1.x (Current Stable Core)
- [x] Action & Strongly-Typed DTO domain standard
- [x] Dynamic Model Swapping engine (`Reyhan::model()`)
- [x] BYOD infrastructure architecture (PostgreSQL 17 + Redis 7)
- [x] Orchestrator CLI (`./reyhan`) with `doctor`, `install`, `update`, `dev`
- [x] Multi-driver Payment Gateway subsystem
- [x] SMS Notification Manager with pattern routing
- [x] Cascading Storefront component and layout overriding engine
- [x] Tokenized branding via `app.config.ts`
- [x] Modular extensions subsystem (`backend/extensions/`)
- [x] Zero-downtime rolling updates with automatic backup protection

---

## 🚀 Version 2.x (Next Major Milestone)
- [ ] **Multi-Tenant / Multi-Storefront Architecture:** Run dozens of distinct branded storefronts off a single central inventory database.
- [ ] **Autonomous AI Agent Shopping API (`llms.txt` + JSON-LD):** Direct autonomous shopping agents checkout protocol.
- [ ] **Native Warehouse WMS & Barcode Scanner:** Real-time stock audit and order packaging mobile terminal.
- [ ] **Headless Mobile SDK (Flutter / React Native):** First-class mobile client libraries consuming Reyhan DTO contracts.
- [ ] **Global CDN Edge Caching:** Sub-20ms edge caching for product listings via Cloudflare Workers & Fastly.
