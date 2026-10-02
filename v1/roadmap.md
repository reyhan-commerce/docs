# Framework Roadmap & Ecosystem

The long-term development of **Reyhan Commerce** is focused on architectural purity, headless performance, AI agent integrations, and omni-channel scale.

---

## 🎯 Version 1.x (Current Stable Core)
- [x] Action & Strongly-Typed DTO domain standard (Farshid's Laravel Constitution)
- [x] Dynamic Model Swapping engine (`Reyhan::useModel()`)
- [x] BYOD infrastructure architecture (PostgreSQL 17 + Redis 7)
- [x] Orchestrator CLI (`./reyhan`) and first-class Artisan commands (`reyhan:doctor`, `reyhan:install`)
- [x] Multi-driver Payment Gateway subsystem (Zarinpal, SEP, Mellat, Sandbox)
- [x] SMS Notification Manager with pattern routing (Kavenegar, FarazSMS, Ghasedak)
- [x] High-concurrency two-tier stock reservation engine (Redis mutex + PostgreSQL row locks)
- [x] Double-entry financial accounting ledger for transactions, refunds, and wallet balances
- [x] Modular extensions subsystem (`extensions/` with `module.json` auto-discovery)
- [x] Zero-downtime rolling updates with automatic backup protection

---

## 🚀 Version 2.x (Next Major Milestone)
- [ ] **Multi-Tenant / Multi-Storefront Architecture:** Run dozens of distinct branded storefronts off a single central inventory database.
- [ ] **Autonomous AI Agent Shopping API (`llms.txt` + JSON-LD):** Direct autonomous shopping agents checkout protocol.
- [ ] **Native Warehouse WMS & Barcode Scanner:** Real-time stock audit and order packaging mobile terminal.
- [ ] **Headless Mobile SDK (Flutter / React Native):** First-class mobile client libraries consuming Reyhan DTO contracts.
- [ ] **Global CDN Edge Caching:** Sub-20ms edge caching for product listings via Cloudflare Workers & Fastly.
