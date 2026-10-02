# Contributing to Reyhan Commerce Documentation (`reyhan-commerce/docs`)

Thank you for contributing to the official documentation of **Reyhan Commerce**!

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/reyhan-commerce/docs.git
cd docs

# Install dependencies with pnpm
pnpm install

# Start local VitePress server
pnpm run dev

# Verify static build
pnpm run build
```

---

## 📝 Writing Guidelines

1. **English Only**: All documentation must be written in clear, concise English.
2. **Copy-Pasteable Code**: Ensure all configuration snippets, shell commands, and PHP/TypeScript classes are functional and modern.
3. **No Broken Links**: Always verify with `pnpm run build` before pushing.

---

## 🌿 Pull Requests

1. Fork the repository and create a branch (`git checkout -b docs/add-payment-guide`).
2. Make your documentation improvements.
3. Run `pnpm run build` to confirm zero build errors.
4. Submit a Pull Request targeting `main`.
