import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { ProductCard } from '../components/Sections'
import { Tote } from '../components/Illus'
import Select from '../components/Select'
import { Link } from 'react-router-dom'
import { CATS, COLS, PRODUCTS, img } from '../data/store'

const PRICES = [
  ['lt', 'Under 40,000 RWF', (p) => p < 40000],
  ['mid', '40,000 to 60,000 RWF', (p) => p >= 40000 && p <= 60000],
  ['gt', 'Over 60,000 RWF', (p) => p > 60000],
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const [panel, setPanel] = useState(false)
  const q = params.get('q') || ''
  const cat = params.get('cat') || 'all'
  const col = params.get('col') || 'all'
  const price = params.get('price') || 'all'
  const sort = params.get('sort') || 'feat'

  const set = (k, v) => {
    const n = new URLSearchParams(params)
    if (!v || v === 'all' || v === 'feat') n.delete(k)
    else n.set(k, v)
    setParams(n, { replace: true })
  }
  const clear = () => setParams({}, { replace: true })

  const matches = (p, skip) => {
    const t = q.trim().toLowerCase()
    return (
      (!t || `${p.name} ${p.col} ${p.cat} ${p.d}`.toLowerCase().includes(t)) &&
      (skip === 'cat' || cat === 'all' || p.cat === cat) &&
      (skip === 'col' || col === 'all' || p.col === col) &&
      (skip === 'price' || price === 'all' || PRICES.find((x) => x[0] === price)[2](p.price))
    )
  }
  const count = (key, val) => PRODUCTS.filter((p) => matches(p, key) && (key === 'cat' ? p.cat === val : p.col === val)).length

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) => matches(p))
    if (sort === 'lo') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'hi') l = [...l].sort((a, b) => b.price - a.price)
    return l
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, cat, col, price, sort])

  const colInfo = COLS.find((c) => c.n === col)
  const title = col !== 'all' ? col : cat !== 'all' ? cat : 'All products'
  const active = [
    q && ['q', `“${q}”`], cat !== 'all' && ['cat', cat], col !== 'all' && ['col', col],
    price !== 'all' && ['price', PRICES.find((x) => x[0] === price)[1]],
  ].filter(Boolean)

  const Group = ({ label, children }) => (<div className="fgroup"><h3>{label}</h3>{children}</div>)

  return (
    <>
      <section className="wrap shop-head">
        <div className="eyebrow">The Zanda shop</div>
        <h1 className="caps">{title}</h1>
        <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
          <input id="q" type="search" placeholder="Search bags, collections, clothing" value={q} onChange={(e) => set('q', e.target.value)} aria-label="Search the shop" />
          {q && <button type="button" aria-label="Clear search" onClick={() => set('q', '')}>×</button>}
        </form>
      </section>

      <div className="wrap shop">
        <div className={'scrim' + (panel ? ' on' : '')} onClick={() => setPanel(false)} style={{ zIndex: 85 }} />
        <aside className={'filters-side' + (panel ? ' on' : '')} aria-label="Filters">
          <div className="fs-head"><h2 className="caps">Filters</h2><button className="ic" aria-label="Close filters" onClick={() => setPanel(false)}><svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" /></svg></button></div>
          <Group label="Category">
            {['all', ...CATS.map((c) => c.n)].map((c) => (
              <label key={c} className="opt"><input type="radio" name="cat" checked={cat === c} onChange={() => set('cat', c)} /><span>{c === 'all' ? 'All categories' : c}</span>{c !== 'all' && <em>{count('cat', c)}</em>}</label>
            ))}
          </Group>
          <Group label="Collection">
            {['all', ...COLS.map((c) => c.n)].map((c) => (
              <label key={c} className="opt"><input type="radio" name="col" checked={col === c} onChange={() => set('col', c)} /><span>{c === 'all' ? 'All collections' : c}</span>{c !== 'all' && <em>{count('col', c)}</em>}</label>
            ))}
          </Group>
          <Group label="Price">
            {[['all', 'Any price'], ...PRICES].map(([k, t]) => (
              <label key={k} className="opt"><input type="radio" name="price" checked={price === k} onChange={() => set('price', k)} /><span>{t}</span></label>
            ))}
          </Group>
          <div className="fs-foot">
            <button className="btn line" onClick={clear} disabled={!active.length && sort === 'feat'}>Clear all</button>
            <button className="btn" onClick={() => setPanel(false)}>Show {list.length}</button>
          </div>
        </aside>

        <div className="shop-main">
          <div className="shop-bar">
            <button className="btn line open-filters" onClick={() => setPanel(true)}>Filters{active.length ? ` (${active.length})` : ''}</button>
            <p className="count" aria-live="polite">{list.length} {list.length === 1 ? 'product' : 'products'}</p>
            <Select label="Sort" value={sort} onChange={(v) => set('sort', v)} options={[{ value: 'feat', label: 'Featured' }, { value: 'lo', label: 'Price, low to high' }, { value: 'hi', label: 'Price, high to low' }]} />
          </div>
          {active.length > 0 && (
            <div className="active-filters">
              {active.map(([k, t]) => <button key={k} className="chip on" onClick={() => set(k, '')}>{t} <span aria-hidden="true">×</span><span className="sr">remove</span></button>)}
              <button className="chip" onClick={clear}>Clear all</button>
            </div>
          )}
          {colInfo && (
            <motion.div key={colInfo.n} className="colbanner" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <img src={img(colInfo.sq || colInfo.img)} alt="" style={{ objectPosition: colInfo.sq ? undefined : colInfo.pos }} />
              <div><div className="eyebrow">Collection</div><h3 className="caps">{colInfo.n}</h3><p>{colInfo.blurb}</p></div>
            </motion.div>
          )}
          <div className="pgrid shop-grid">
            {list.map((p, i) => <ProductCard key={p.id + cat + col + q + price} p={p} i={i} />)}
          </div>
          {list.length === 0 && (
            <div className="none">
              <Tote className="none-illus" />
              <h2 className="caps">Nothing matches yet.</h2>
              <p>Try a different word, or clear the filters.</p>
              <button className="btn" onClick={clear}>Clear all filters</button>
            </div>
          )}
          <div className="brand-banner">
            <Tote className="bb-illus" />
            <div><div className="eyebrow">Branded bags</div><h3 className="caps">Want it with your name or logo?</h3><p>Choose a personal or a corporate offer and we will send you a quote.</p></div>
            <Link className="btn" to="/branded">Request branded bags <span className="arr">→</span></Link>
          </div>
          <p className="note">Prices and descriptions are sample content for this design preview.</p>
        </div>
      </div>
      <div style={{ height: 64 }} />
    </>
  )
}
