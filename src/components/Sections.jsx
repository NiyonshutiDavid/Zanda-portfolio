import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { CATS, COLS, FAQ, PRODUCTS, fmt, img } from '../data/store'
import { Reveal } from './Reveal'

export function ProductCard({ p, i = 0 }) {
  const { add } = useCart()
  return (
    <motion.div className="pc" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: Math.min(i, 8) * 0.05, ease: [0.22, 0.8, 0.2, 1] }}>
      <div className="im">
        <span className="col-tag">{p.col}</span>
        <Link className="hit" to={`/product/${p.id}`} aria-label={`View ${p.name}`}>
          <img src={img(p.imgs[0])} alt={p.name} loading="lazy" />
          {p.imgs[1] && <img src={img(p.imgs[1])} alt="" loading="lazy" />}
        </Link>
        <span className="price-tag" aria-label={`Price ${fmt(p.price)}`}>{p.price.toLocaleString('en-US')}<small>RWF</small></span>
        <button className="add" aria-label={`Add ${p.name} to your bag`} onClick={() => add(p.id)}><span>Quick add</span></button>
      </div>
      <div>
        <h4>{p.name}</h4>
        <div className="meta"><span>{p.cat}</span></div>
      </div>
    </motion.div>
  )
}

export function Marquee({ words = ['Tote bags', 'Backpacks', 'Laptop bags', 'Tailoring', 'School uniforms', 'Corporate clothing', 'Custom orders', 'Lumina', 'Kamo', 'MwanaGo'] }) {
  const row = (
    <span>{words.map((w) => <span key={w} style={{ display: 'contents' }}>{w}<i /></span>)}</span>
  )
  return <div className="mq" aria-hidden="true"><div className="mq-track">{row}{row}</div></div>
}

export function Categories() {
  const nav = useNavigate()
  return (
    <div className="cats">
      {CATS.map((c, i) => (
        <Reveal key={c.n} delay={i * 0.08}>
          <button className="cat" onClick={() => nav(`/shop?cat=${c.n}`)}>
            <img src={img(c.img)} alt="" loading="lazy" style={{ objectPosition: c.pos }} />
            <span className="tag">{c.tag}</span>
            <span className="row">
              <span>
                <span className="idx" style={{ color: 'var(--gold)' }}>00{i + 1}/</span>
                <h3 className="caps">{c.n}</h3>
                <span style={{ fontSize: 14, opacity: 0.85 }}>{PRODUCTS.filter((p) => p.cat === c.n).length} styles</span>
              </span>
              <span className="go"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M8 7h9v9" /></svg></span>
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  )
}

export function Collections() {
  const [on, setOn] = useState(0)
  const nav = useNavigate()
  return (
    <div className="cols">
      {COLS.map((c, i) => (
        <div
          key={c.n}
          className={'col' + (i === on ? ' on' : '')}
          tabIndex={0}
          role="button"
          aria-expanded={i === on}
          onMouseEnter={() => matchMedia('(hover:hover)').matches && innerWidth > 860 && setOn(i)}
          onFocus={() => setOn(i)}
          onClick={() => setOn(i)}
        >
          <img src={img(c.img)} alt="" loading="lazy" style={{ objectPosition: c.pos }} />
          <span className="n idx" style={{ color: 'var(--gold)' }}>00{i + 1}/</span>
          <h3 className="caps">{c.n}</h3>
          <div className="info">
            <span className="kind">{c.kind}</span>
            <p>{c.blurb}</p>
            <button className="chip" onClick={(e) => { e.stopPropagation(); nav(`/shop?col=${c.n}`) }}>Shop {c.n} →</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <div className="faq">
      {FAQ.map(([q, a], i) => (
        <div key={q} className={'q' + (open === i ? ' on' : '')}>
          <button aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="idx">00{i + 1}</span><h3>{q}</h3><span className="pl">+</span>
          </button>
          <div className="a"><div><p>{a}</p></div></div>
        </div>
      ))}
    </div>
  )
}

// The four bag collections, reused on the About, Services and Training pages.
export function CollectionsStrip() {
  return (
    <div className="cstrip">
      {COLS.map((c, i) => (
        <Reveal key={c.n} delay={i * 0.07}>
          <Link className="ccard" to={`/shop?col=${c.n}`}>
            <span className="ccard-img"><img src={img(c.card || c.img)} alt="" loading="lazy" style={{ objectPosition: c.card ? undefined : c.pos }} /></span>
            <span className="ccard-kind">{c.kind}</span>
            <h3 className="caps">{c.n}</h3>
            <p>{c.blurb}</p>
            <span className="ccard-go">Shop {c.n} <i aria-hidden="true">↗</i></span>
          </Link>
        </Reveal>
      ))}
    </div>
  )
}

// One row of products that drifts sideways on its own. It pauses while you hover, touch or tab through it,
// and you can drag, swipe or use the arrows at any time. The set is repeated once so the loop never shows an end.
export function MovingRow({ products, label = 'Featured products' }) {
  const reduce = useReducedMotion()
  const box = useRef(null)
  const state = useRef({ hold: 0, hover: false })
  const n = products.length

  // Measurements of the row: the distance from one card to the next, and the width of one full set.
  const dims = () => {
    const el = box.current
    const first = el?.children[0], second = el?.children[1], copy = el?.children[n]
    if (!first || !second || !copy) return { step: 0, loop: 0 }
    return { step: second.offsetLeft - first.offsetLeft, loop: copy.offsetLeft - first.offsetLeft }
  }

  // Every few seconds the row slides along by exactly one card. The repeated set makes it loop without a visible end.
  useEffect(() => {
    const el = box.current
    if (!el || reduce) return
    const st = state.current
    const hold = () => { st.hold = Date.now() + 5000 }
    const go = () => {
      if (st.hover || Date.now() < st.hold || document.hidden) return
      const { step, loop } = dims()
      if (!step || loop <= el.clientWidth) return
      if (el.scrollLeft >= loop - 1) el.scrollLeft -= loop
      const next = (Math.round(el.scrollLeft / step) + 1) * step
      el.scrollTo({ left: next, behavior: 'smooth' })
    }
    const timer = setInterval(go, 3400)
    for (const ev of ['pointerdown', 'wheel', 'touchstart', 'keydown']) el.addEventListener(ev, hold, { passive: true })
    return () => { clearInterval(timer); for (const ev of ['pointerdown', 'wheel', 'touchstart', 'keydown']) el.removeEventListener(ev, hold) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, n])

  const nudge = (d) => {
    const el = box.current
    if (!el) return
    const { step, loop } = dims()
    state.current.hold = Date.now() + 6000
    if (!step) return
    if (d < 0 && el.scrollLeft < step - 1 && loop) el.scrollLeft += loop
    else if (d > 0 && loop && el.scrollLeft >= loop - 1) el.scrollLeft -= loop
    el.scrollTo({ left: (Math.round(el.scrollLeft / step) + d) * step, behavior: 'smooth' })
  }

  return (
    <div className="mrow-wrap">
      <div className="mrow-ctl">
        <button className="ic" aria-label="Show earlier products" onClick={() => nudge(-1)}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button>
        <button className="ic" aria-label="Show more products" onClick={() => nudge(1)}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
      </div>
      <div
        className="mrow"
        ref={box}
        role="region"
        aria-label={label}
        tabIndex={0}
        onMouseEnter={() => { state.current.hover = true }}
        onMouseLeave={() => { state.current.hover = false }}
        onFocus={() => { state.current.hover = true }}
        onBlur={() => { state.current.hover = false }}
      >
        {products.map((p, i) => <div className="mrow-item" key={p.id}><ProductCard p={p} i={i} /></div>)}
        {!reduce && products.map((p) => <div className="mrow-item" key={p.id + '-copy'} aria-hidden="true" inert><ProductCard p={p} /></div>)}
      </div>
    </div>
  )
}
