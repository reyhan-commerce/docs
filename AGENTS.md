# AI Coding Agent Directives — Reyhan Commerce Docs (`reyhan-commerce/docs`)

This document guides AI coding agents writing, editing, or maintaining documentation in the `reyhan-commerce/docs` repository.

---

## 🏛️ Invariants & Rules

1. **100% English**:
   - All documentation pages, markdown files, headings, and code snippets must be written in English.
   - Persian is used only for localization examples or culture-specific explanations (such as Iranian payment gateways, SMS providers, or Shamsi calendar configuration).

2. **VitePress Conventions**:
   - Built with VitePress (`.vitepress/config.mts`).
   - All relative links must point to valid markdown files without `.md` extension in URLs.
   - Run `pnpm run build` to verify there are zero broken internal links before committing.

3. **Ecosystem Decoupling Consistency**:
   - Always accurately distinguish the 5 repositories:
     - `reyhan-commerce/core` (Framework Core Composer library)
     - `reyhan-commerce/reyhan` (Standard Laravel 13 Starter Application)
     - `reyhan-commerce/installer` (Composer Global CLI `reyhan new`)
     - `reyhan-commerce/storefront-nuxt` (Decoupled Nuxt 4 Storefront)
     - `reyhan-commerce/docs` (Documentation portal)

4. **Code Quality**:
   - All PHP code blocks must specify `declare(strict_types=1);` where complete files are shown.
   - Follow Farshid's Laravel Constitution for code examples: no repositories, modern `casts(): array`, Action pattern with `execute()`.
