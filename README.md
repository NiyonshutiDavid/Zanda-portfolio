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

## Content from the Zanda backend

The copy can show what staff edit in the Zanda dashboard. Set `VITE_API_URL` to the backend's origin (see `.env.example`) and the site reads its public content from it; leave it empty and it stays fully static, showing `src/data/store.js`. The GitHub Pages build uses `https://zandainitiative.org`, or the repository variable `ZANDA_API_URL` when set (Settings > Secrets and variables > Actions > Variables).

```bash
VITE_API_URL=http://localhost:4000 npm run dev    # against a local backend
npm run dev                                       # static, no requests
```

What is pulled (public `GET` endpoints only, with `?lang=` for the visitor's language):

| Shown on the site | Endpoint |
| --- | --- |
| Home hero slides (title lines, buttons, photos) | `/api/public/site-sections?site=initiative`, section `home.slides` |
| Page title bands (News, Events, Gallery, Training, Book, Donate, Contact) | the same call, sections `news.hero`, `events.hero`, `gallery.hero`, `programs.hero`, `book.hero`, `donate.hero`, `contact.hero` |
| Collections | `/api/shop/collections` |
| Products, prices, categories, product page details | `/api/shop/products`, `/api/shop/products/{slug}`, `/api/shop/categories` |
| FAQ, news, events, team, gallery, partners | `/api/public/faqs`, `news`, `events`, `team`, `gallery`, `partners` |
| Programmes, modules and outcomes (Training page) | `/api/public/programs` |

Not pulled, so still static: stories, the branded-bag designer, services and bookings, impact figures, the partner ways and all other page texts.

Fallbacks, for each resource on its own: with no `VITE_API_URL`, an unreachable server, a CORS error, a 404 (the live server runs an older API without `/api/shop/collections` or the `home.slides` section), a response slower than 4 seconds, or an empty or invalid answer, that resource keeps its built-in data and the rest still update. The last answer is cached in `localStorage` (per resource and language) so a returning visitor sees it on the first paint, and it is refreshed in the background.

Headings never change after the first paint. The hero and the page title bands use a snapshot of the saved wording: the cached copy if there is one, otherwise the first answer, waiting at most 1.5 seconds (`data-wait` in `src/wait.css` keeps them hidden until then). A heading edited in the dashboard shows from the next visit. Product, news and other lists update as soon as they arrive. Only headings staff actually saved replace the built-in ones.

The copy's own cart, checkout, booking, donation and contact forms stay as they are: nothing is sent to the API, and requests carry no cookies or credentials.

For the server's operator: add `https://niyonshutidavid.github.io` (the origin only, without `/Zanda-portfolio`) to `CORS_ORIGINS` in the server's `.env`, then restart the API. The collections and hero slides need the API version that has `/api/shop/collections` and the `home.slides` site section.
