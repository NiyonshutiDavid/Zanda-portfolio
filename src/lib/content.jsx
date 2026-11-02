// Content from the Zanda backend, with the built-in data of src/data/store.js as the fallback for each resource on its own.
//
// - No VITE_API_URL: static mode, nothing is requested and every page shows the built-in data.
// - Otherwise each resource is read from the public API in the background and cached in localStorage (per resource and
//   language), so a returning visitor sees the last answer on the first paint. A resource that cannot be loaded (offline,
//   CORS, 404 on an older server, timeout) or comes back empty or invalid keeps its built-in data; the others still update.
// - Headings and hero slides never change in front of the visitor: they come from a snapshot taken once, either the cached
//   copy or the first answer (waiting at most 1.5 s), and later answers are only kept for the next visit.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useI18n } from '../i18n'
import * as S from '../data/store'
import { apiEnabled, API, getJson } from './api'
import { mapCategories, mapCollections, mapEvents, mapFaq, mapGallery, mapHeading, mapNews, mapPartners, mapPrograms, mapProductDetail, mapProducts, mapSlides, mapTeam, splitTitle } from './map'

const WAIT_MS = 1500
const REFRESH_MS = 60_000
const PREFIX = `zanda-proto:v1:${API}:`

const STATIC = {
  SLIDES: S.SLIDES, COLS: S.COLS, CATS: S.CATS, PRODUCTS: S.PRODUCTS, FEATURED: S.FEATURED, FAQ: S.FAQ, NEWS: S.NEWS,
  GALLERY: S.GALLERY, TEAM: S.TEAM, PROGRAMS: S.PROGRAMS, MODULES: S.MODULES, OUTCOMES: S.OUTCOMES, PARTNERS: S.PARTNERS,
  EVENTS: { upcoming: [], past: [] },
}
// The prototype's own copies of the real site's hero pictures.
const LOCAL_HERO = new Set(S.SLIDES.flatMap((s) => [s.img, s.imgM, s.thumb]))

// ---- cache ----
const cacheKey = (name, lang) => `${PREFIX}${name}:${lang || '-'}`
function readCache(name, lang) {
  try {
    const raw = localStorage.getItem(cacheKey(name, lang))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function writeCache(name, lang, data) {
  try { localStorage.setItem(cacheKey(name, lang), JSON.stringify(data)) } catch { /* storage blocked or full: the next visit waits for the answer */ }
}

// ---- resources: what to request and how to read it. `lang: false` resources hold every language in one answer. ----
const PRODUCT_PAGE = 48
async function loadProducts(lang) {
  const get = (page) => getJson('/shop/products', { lang, query: { page, page_size: PRODUCT_PAGE, currency: 'RWF' } })
  const first = await get(1)
  const items = [...(Array.isArray(first?.items) ? first.items : [])]
  for (let p = 2; p <= Math.min(Number(first?.pages) || 1, 4); p++) items.push(...((await get(p))?.items || []))
  return items
}
const RESOURCES = {
  collections: { load: (lang) => getJson('/shop/collections', { lang }), map: mapCollections },
  products: { load: loadProducts, map: mapProducts },
  categories: { load: (lang) => getJson('/shop/categories', { lang }), map: (x) => x },
  faq: { load: (lang) => getJson('/public/faqs', { lang }), map: mapFaq },
  news: { load: (lang) => getJson('/public/news', { lang, query: { page: 1, page_size: 48 } }), map: mapNews },
  events: { load: (lang) => getJson('/public/events', { lang }), map: mapEvents },
  team: { load: (lang) => getJson('/public/team', { lang }), map: mapTeam },
  gallery: { load: (lang) => getJson('/public/gallery', { lang }), map: mapGallery },
  partners: { load: (lang) => getJson('/public/partners', { lang }), map: mapPartners },
  programs: { load: (lang) => getJson('/public/programs', { lang }), map: mapPrograms },
}
const NAMES = Object.keys(RESOURCES)
const readAll = (lang) => Object.fromEntries(NAMES.map((n) => [n, readCache(n, lang)]).filter(([, v]) => v))

const Ctx = createContext({ ...STATIC, ready: true, heading: () => null, lang: 'en', lookup: (id) => STATIC.PRODUCTS.find((p) => p.id === id) })

export function ContentProvider({ children }) {
  const { lang } = useI18n()
  // Resource answers per language, filled from the cache straight away.
  const [store, setStore] = useState(() => ({ [lang]: readAll(lang) }))
  // Categories are mapped against the products, so keep the raw answer and map when assembling.
  // The sections snapshot (hero slides and headings): frozen once `ready`.
  const [snap, setSnap] = useState(() => (apiEnabled ? readCache('sections')?.sections ?? null : null))
  const [ready, setReady] = useState(() => !apiEnabled || Boolean(readCache('sections')))
  const decided = useRef(ready)
  const decide = useCallback((sections) => {
    if (decided.current) return
    decided.current = true
    if (sections) setSnap(sections)
    setReady(true)
  }, [])

  // Hero slides and headings: one request, and the visitor waits for it at most WAIT_MS when nothing is cached.
  useEffect(() => {
    if (!apiEnabled) return
    const ctl = new AbortController()
    const timer = setTimeout(() => decide(null), WAIT_MS)
    const run = () => getJson('/public/site-sections', { query: { site: 'initiative' }, signal: ctl.signal })
      .then((d) => {
        if (ctl.signal.aborted) return
        const sections = d && typeof d.sections === 'object' && !Array.isArray(d.sections) ? d.sections : null
        if (!sections) return decide(null)
        writeCache('sections', undefined, { sections })
        decide(sections)
      })
      .catch(() => { if (!ctl.signal.aborted) decide(null) })
    run()
    return () => { clearTimeout(timer); ctl.abort() }
  }, [decide])

  // Everything else, refreshed in the background when the language changes and when the tab comes back after a minute.
  useEffect(() => {
    if (!apiEnabled) return
    setStore((s) => (s[lang] ? s : { ...s, [lang]: readAll(lang) }))
    const ctl = new AbortController()
    let last = 0
    const refresh = () => {
      last = Date.now()
      for (const name of NAMES) {
        const r = RESOURCES[name]
        Promise.resolve().then(() => r.load(lang)).then((payload) => {
          if (ctl.signal.aborted) return
          const data = name === 'categories' ? (Array.isArray(payload) && payload.length ? payload : null) : r.map(payload)
          if (!data) return
          writeCache(name, lang, data)
          setStore((s) => ({ ...s, [lang]: { ...s[lang], [name]: data } }))
        }).catch(() => { /* keep the cached or built-in data */ })
      }
    }
    const visible = () => { if (document.visibilityState === 'visible' && Date.now() - last > REFRESH_MS) refresh() }
    refresh()
    document.addEventListener('visibilitychange', visible)
    return () => { ctl.abort(); document.removeEventListener('visibilitychange', visible) }
  }, [lang])

  const value = useMemo(() => {
    const d = store[lang] || readAll(lang)
    const products = d.products || STATIC.PRODUCTS
    const fromApi = Boolean(d.products)
    const featured = fromApi ? (products.filter((p) => p.feat).length ? products.filter((p) => p.feat) : products).slice(0, 8).map((p) => p.id) : STATIC.FEATURED
    const cats = fromApi ? mapCategories(d.categories, products) : null
    const program = d.programs?.[0]
    return {
      lang, ready, products,
      SLIDES: (snap && mapSlides(snap, lang, LOCAL_HERO)) || STATIC.SLIDES,
      COLS: d.collections || STATIC.COLS,
      CATS: cats || STATIC.CATS,
      PRODUCTS: products,
      FEATURED: featured,
      FAQ: d.faq || STATIC.FAQ,
      NEWS: d.news || STATIC.NEWS,
      EVENTS: d.events || STATIC.EVENTS,
      GALLERY: d.gallery || STATIC.GALLERY,
      TEAM: d.team || STATIC.TEAM,
      PARTNERS: d.partners || STATIC.PARTNERS,
      PROGRAMS: d.programs || STATIC.PROGRAMS,
      MODULES: program?.modules?.length ? program.modules : STATIC.MODULES,
      OUTCOMES: program?.outcomes?.length ? program.outcomes : STATIC.OUTCOMES,
      // The saved wording of a page title band ({ eyebrow, title, lead }, only what staff saved) or null.
      heading: (key) => (snap ? mapHeading(snap, key, lang) : null),
      lookup: (id) => products.find((p) => p.id === id) || STATIC.PRODUCTS.find((p) => p.id === id),
    }
  }, [store, lang, snap, ready])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useContent = () => useContext(Ctx)

// The saved title band for a page, shaped for PageTitle: { eyebrow, a, b, lead } with only the saved parts.
export function useHeading(key) {
  const { heading } = useContent()
  return useMemo(() => {
    const h = key ? heading(key) : null
    if (!h) return null
    const out = {}
    if (h.eyebrow) out.eyebrow = h.eyebrow
    if (h.title) [out.a, out.b] = splitTitle(h.title)
    if (h.lead) out.lead = h.lead
    return out
  }, [heading, key])
}

// One product with its full details (all photos, long description, facts). The list answer shows at once; the details
// arrive from /shop/products/{slug} and are remembered for the session.
const detailCache = new Map()
export function useProduct(id) {
  const { lang, lookup } = useContent()
  const base = lookup(id)
  const key = `${lang}:${id}`
  const [got, setGot] = useState(null)
  useEffect(() => {
    if (!apiEnabled || !base?.remote || detailCache.has(key)) return
    const ctl = new AbortController()
    getJson(`/shop/products/${encodeURIComponent(id)}`, { lang, query: { currency: 'RWF' }, signal: ctl.signal })
      .then((d) => { const p = mapProductDetail(d); if (p) { detailCache.set(key, p); setGot(key) } })
      .catch(() => {})
    return () => ctl.abort()
  }, [key, id, lang, base?.remote])
  const detail = detailCache.get(key)
  void got
  return base ? (detail && base.remote ? { ...base, ...detail, col: detail.col || base.col } : base) : null
}
