import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { ProductCard } from '../components/Sections'
import { PRODUCTS, fmt, img } from '../data/store'
import { Reveal } from '../components/Reveal'

export default function Product() {
  const { id } = useParams()
  const nav = useNavigate()
  const { add, setOpen } = useCart()
  const p = PRODUCTS.find((x) => x.id === id)
  const [cur, setCur] = useState(0)
  const [q, setQ] = useState(1)
  const [zoom, setZoom] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')
  useEffect(() => { setCur(0); setQ(1); setZoom(false) }, [id])

  if (!p) return <div className="wrap" style={{ padding: '80px 0' }}><p>That bag was not found.</p><Link className="btn" to="/shop">Back to shop</Link></div>
  const rel = PRODUCTS.filter((x) => x.id !== id && (x.col === p.col || x.cat === p.cat)).slice(0, 4)

  return (
    <div className="wrap">
      <div className="crumb">
        <Link to="/">Home</Link>/<Link to="/shop">Shop</Link>/<Link to={`/shop?cat=${p.cat}`}>{p.cat}</Link>/<span>{p.name}</span>
      </div>
      <div className="pv">
        <div className="gal">
          <div className="thumbs">
            {p.imgs.map((f, k) => (
              <button key={f} className={k === cur ? 'on' : ''} aria-label={`Photo ${k + 1}`} onClick={() => setCur(k)}><img src={img(f)} alt="" /></button>
            ))}
          </div>
          <div
            className={'main' + (zoom ? ' z' : '')}
            onClick={() => setZoom((z) => !z)}
            onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`) }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img key={p.imgs[cur]} src={img(p.imgs[cur])} alt={p.name} style={{ transformOrigin: origin }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
            </AnimatePresence>
          </div>
        </div>
        <div className="pinfo">
          <div><span className="chip on">{p.col} collection</span></div>
          <h1 className="caps">{p.name}</h1>
          <div className="price">{fmt(p.price)}</div>
          <p>{p.d}</p>
          <ul className="feat">{p.f.map(([a, b]) => <li key={a}><span>{a}</span><b style={{ fontWeight: 600 }}>{b}</b></li>)}</ul>
          <div className="buy">
            <div className="qty"><button aria-label="Less" onClick={() => setQ((x) => Math.max(1, x - 1))}>−</button><b>{q}</b><button aria-label="More" onClick={() => setQ((x) => x + 1)}>+</button></div>
            <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { add(p.id, q); setOpen(true) }}>Add to bag <span className="arr">→</span></button>
          </div>
          {p.cat !== 'Clothing' && <Link className="btn line" to={`/branded?bag=${p.id}`} style={{ justifyContent: 'center' }}>Request this bag branded <span className="arr">→</span></Link>}
          <p style={{ fontSize: 13 }}>Made by a Zanda trainee in Kigali. Free delivery in Kigali on orders over 80,000 RWF.</p>
        </div>
      </div>
      <Reveal className="sec" style={{ paddingTop: 24 }}>
        <div className="sec-head"><h2 className="caps" style={{ fontSize: 'clamp(32px,5vw,72px)' }}>You may also like</h2></div>
        <div className="pgrid">{rel.map((r, i) => <ProductCard key={r.id} p={r} i={i} />)}</div>
      </Reveal>
    </div>
  )
}
