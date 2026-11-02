// Turns the backend's public API payloads into the shapes the pages already use (see src/data/store.js).
// Every mapper returns null when the payload is missing, malformed or empty, and the caller then keeps the built-in data.
// The API answers in the requested language, so these strings are used as they are.
import { mediaUrl } from './api'

const str = (v) => (typeof v === 'string' ? v.trim() : '')
const arr = (v) => (Array.isArray(v) ? v : [])
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : null)
const some = (list) => (list.length ? list : null)

// Light markdown to plain text, for long texts shown in a <p>.
export const plain = (md) => str(md).replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/^#{1,6}\s+/gm, '').replace(/[*_`>]+/g, '').replace(/\s*\n\s*/g, ' ').trim()

// ---------- site sections (hero slides and page headings) ----------

// A text saved per language ({ en, fr, rw }): the visitor's language, else English. Empty when nothing was saved.
const said = (value, lang) => {
  const v = obj(value)
  return v ? str(v[lang]) || str(v.en) : str(value)
}
// Page headings only use the visitor's own language, so that French and Kinyarwanda keep the translated built-in wording until staff translate it.
const saidIn = (value, lang) => {
  const v = obj(value)
  return v ? (lang === 'en' ? str(v.en) : str(v[lang])) : ''
}
const FOCUS = /^\s*\d{1,3}(\.\d+)?%\s+\d{1,3}(\.\d+)?%\s*$/
const HREF = /^(\/(?!\/)\S*|https:\/\/\S+)$/

// The hero slides staff saved (site section "home.slides"). `local` maps the real site's own hero pictures
// (/images/hero/hero-1.jpg ...) to the copies that ship with this prototype, which the API host may not serve.
export function mapSlides(sections, lang, local = new Set()) {
  const raw = arr(obj(sections?.['home.slides'])?.slides)
  const photo = (p) => {
    const path = str(p)
    const base = path.startsWith('/images/hero/') ? path.slice(13) : ''
    return base && local.has(base) ? base : mediaUrl(path)
  }
  const out = []
  for (const it of raw) {
    const s = obj(it)
    if (!s) continue
    const l1 = said(s.line1, lang), l2 = said(s.line2, lang), image = photo(s.image)
    if (!image || !(l1 || l2)) continue
    const href = (v, fallback) => (HREF.test(str(v)) ? str(v) : fallback)
    const label2 = said(s.secondaryLabel, lang)
    out.push({
      img: image,
      imgM: photo(s.imageMobile) || image,
      focus: FOCUS.test(str(s.focus)) ? str(s.focus) : '50% 50%',
      light: s.light === true,
      thumb: photo(s.thumb) || image,
      eyebrow: said(s.eyebrow, lang),
      l1, l2,
      small2: s.smallLine2 === true,
      cta: [said(s.primaryLabel, lang) || 'Shop', href(s.primaryHref, '/shop')],
      cta2: label2 && HREF.test(str(s.secondaryHref)) ? [label2, str(s.secondaryHref)] : undefined,
    })
  }
  return some(out)
}

// A page title band saved in Dashboard > Content > Site content (e.g. "news.hero"): { eyebrow, title, lead } with only the fields that were saved.
export function mapHeading(sections, key, lang) {
  const s = obj(sections?.[key])
  if (!s) return null
  const out = {}
  for (const f of ['eyebrow', 'title', 'lead']) {
    const v = saidIn(s[f], lang)
    if (v) out[f] = v
  }
  return Object.keys(out).length ? out : null
}

// A title splits over the two lines of the page title band at the space nearest its middle.
export function splitTitle(title) {
  const words = title.split(/\s+/)
  if (words.length < 3 && title.length < 16) return [title, '']
  let best = 1, gap = Infinity
  for (let i = 1; i < words.length; i++) {
    const g = Math.abs(words.slice(0, i).join(' ').length - words.slice(i).join(' ').length)
    if (g < gap) { gap = g; best = i }
  }
  return words.length < 2 ? [title, ''] : [words.slice(0, best).join(' '), words.slice(best).join(' ')]
}

// ---------- shop ----------

export function mapCollections(list) {
  return some(arr(list).filter((c) => str(c?.name)).map((c) => ({
    n: str(c.name),
    kind: str(c.kind),
    blurb: str(c.description),
    img: mediaUrl(c.image_url) || mediaUrl(c.card_image_url) || 'lumina-duo.jpg',
    card: mediaUrl(c.card_image_url) || undefined,
    pos: FOCUS.test(str(c.image_focus)) ? str(c.image_focus) : '50% 50%',
    count: Number(c.product_count) || 0,
  })))
}

export function mapProducts(items) {
  return some(arr(items).map((p) => {
    const price = Number(p?.on_sale && p.sale_price != null ? p.sale_price : p?.price)
    const name = str(p?.name), slug = str(p?.slug)
    if (!name || !slug || !Number.isFinite(price)) return null
    const first = mediaUrl(p.image?.url)
    return {
      id: slug,
      name,
      col: str(typeof p.collection === 'string' ? p.collection : p.collection?.name),
      cat: str(p.category?.name),
      price,
      imgs: [first || 'lumina-duo.jpg', mediaUrl(p.hover_image?.url)].filter(Boolean),
      d: str(p.short_description),
      f: [],
      feat: p.is_featured === true,
      remote: true,
    }
  }).filter(Boolean))
}

// The single product page: every photo, the long description and the facts.
export function mapProductDetail(d) {
  const first = mapProducts([d])?.[0]
  if (!first) return null
  const photos = arr(d.images).map((i) => mediaUrl(i?.url)).filter(Boolean)
  const a = obj(d.attributes) || {}
  const f = []
  const add = (k, v) => { if (v) f.push([k, v]) }
  add('Material', arr(a.materials).join(', '))
  add('Colour', arr(a.colors).join(', '))
  add('Size', arr(a.sizes).join(', '))
  add('SKU', str(d.sku))
  return { ...first, imgs: photos.length ? photos : first.imgs, d: plain(d.description) || first.d, f }
}

// The shop categories, only those with products. Products decide the filter names, so categories come along only with API products.
export function mapCategories(list, products) {
  const cats = arr(list).filter((c) => str(c?.name) && !c.parent_id)
  const inShop = (name) => products.some((p) => p.cat === name)
  const firstOf = (name) => products.find((p) => p.cat === name)?.imgs[0]
  const out = cats.filter((c) => inShop(str(c.name))).map((c) => ({ n: str(c.name), img: mediaUrl(c.image_url) || firstOf(str(c.name)), tag: str(c.description) }))
  if (out.length) return out
  const names = [...new Set(products.map((p) => p.cat).filter(Boolean))]
  return some(names.map((n) => ({ n, img: firstOf(n), tag: '' })))
}

// ---------- website content ----------

export function mapFaq(list) {
  return some(arr(list).filter((f) => str(f?.question) && str(f?.answer)).map((f) => [str(f.question), str(f.answer)]))
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const longDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}` }

export function mapNews(page) {
  return some(arr(page?.items).map((n) => {
    const title = str(n?.title), slug = str(n?.slug), iso = str(n?.published_at).slice(0, 10)
    if (!title || !slug || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
    const summary = plain(n.excerpt)
    const body = plain(n.body)
    return { slug, date: longDate(iso), iso, title, tag: str(n.category) || 'News', summary: summary || body.slice(0, 160), body: body || summary, img: mediaUrl(n.cover_image_url) || 'cutting-fabric.jpg' }
  }).filter(Boolean))
}

export function mapEvents(payload) {
  const one = (e) => {
    const title = str(e?.title), slug = str(e?.slug), iso = str(e?.date)
    if (!title || !slug || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
    return { slug, title, summary: plain(e.summary) || plain(e.body).slice(0, 200), iso, time: str(e.time), location: str(e.location), img: mediaUrl(e.image_url) || '' }
  }
  const upcoming = arr(payload?.upcoming).map(one).filter(Boolean)
  const past = arr(payload?.past).map(one).filter(Boolean)
  return upcoming.length || past.length ? { upcoming, past } : null
}

export function mapTeam(list) {
  return some(arr(list).filter((m) => str(m?.name)).map((m) => [str(m.name), str(m.role)]))
}

export function mapGallery(list) {
  return some(arr(list).map((g) => {
    const f = mediaUrl(g?.image_url)
    return f ? [f, str(g.caption) || str(g.alt_text), str(g.album)] : null
  }).filter(Boolean))
}

export function mapPartners(list) {
  return some(arr(list).filter((p) => str(p?.name) && str(p?.logo_url)).map((p) => ({ n: str(p.name), type: str(p.partner_type), logo: mediaUrl(p.logo_url), url: /^https?:\/\//i.test(str(p.website)) ? str(p.website) : '' })))
}

export function mapPrograms(list) {
  return some(arr(list).filter((p) => str(p?.name)).map((p) => ({
    id: str(p.slug) || str(p.name),
    name: str(p.name),
    duration: str(p.duration),
    who: str(p.audience),
    summary: str(p.summary) || plain(p.description).slice(0, 220),
    points: arr(p.modules).map((m) => str(m?.title)).filter(Boolean),
    status: p.applications_open ? 'Applications open' : 'Applications closed for now',
    open: p.applications_open === true,
    modules: arr(p.modules).filter((m) => str(m?.title)).map((m) => [str(m.title), str(m.description)]),
    outcomes: arr(p.outcomes).map(str).filter(Boolean),
  })))
}
