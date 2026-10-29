# Zanda storefront (design preview)

Vite + React 19 + React Router + Motion. Sample content and prices; real photos and brand assets.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Routes: `/` home (looping hero), `/shop` (`?cat=` and `?col=` filters), `/product/:id`, `/about`.
Edit products, collections, hero slides and team in `src/data/store.js`.
Hero images in `public/img/hero-*.jpg` are landscape composites of the real photos.

## Deploying

Pushing to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`). The AI chat needs the server in `server/`, which Pages cannot run, so the published site uses the built-in keyword helper instead.
