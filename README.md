# Reyhan Commerce Documentation (`docs`)

Official documentation website for the **Reyhan Commerce Framework**.

Built with [VitePress](https://vitepress.dev/) and deployed automatically to GitHub Pages.

---

## 🛠 Local Development

```bash
# Install dependencies
pnpm install

# Start local development server
pnpm run dev

# Build static assets
pnpm run build

# Preview build locally
pnpm run preview
```

---

## 🚀 Deployment to GitHub Pages

This repository includes a pre-configured GitHub Actions workflow in `.github/workflows/deploy.yml`.

To deploy:
1. Push to `main` branch.
2. In GitHub repository settings, navigate to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. The documentation will deploy automatically to `https://<org>.github.io/<repo>/`.
