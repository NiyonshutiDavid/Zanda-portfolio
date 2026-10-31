import { openSettings } from '../lib/consent'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { fmt, img, COLS } from '../data/store'
import { Tote } from './Illus'
import { useT } from '../i18n'

export function CartDrawer() {
  const t = useT()
  const { open, setOpen, items, total, remove, toast } = useCart()
  const nav = useNavigate()
  return (
    <>
      <div className={'scrim' + (open ? ' on' : '')} onClick={() => setOpen(false)} />
      <aside className={'drawer' + (open ? ' on' : '')} aria-label={t('Cart')} aria-hidden={!open}>
        <header>
          <h3 className="caps">{t('Your bag')}</h3>
          <button className="ic" aria-label={t('Close cart')} onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </header>
        <div className="lines">
          {items.length === 0 && <div className="empty"><Tote className="empty-illus" /><p>{t('Your bag is empty.')}<br />{t('Add something from the shop.')}</p></div>}
          <AnimatePresence initial={false}>
            {items.map((l) => (
              <motion.div key={l.id} className="ln-item" layout initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}>
                <img src={img(l.p.imgs[0])} alt="" />
                <div>
                  <h4>{t(l.p.name)}</h4>
                  <small>{l.q} × {fmt(l.p.price)}</small><br />
                  <button className="rm" onClick={() => remove(l.id)}>{t('Remove')}</button>
                </div>
                <b>{fmt(l.p.price * l.q)}</b>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="tot"><span>{t('Total')}</span><span>{fmt(total)}</span></div>
        <button className="btn" disabled={items.length === 0} style={{ justifyContent: 'center' }} onClick={() => { setOpen(false); nav('/checkout') }}>{t('Checkout')} <span className="arr">→</span></button>
      </aside>
      <div className={'toast' + (toast ? ' on' : '')} role="status">{toast}</div>
    </>
  )
}

export function Footer() {
  const t = useT()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [state, setState] = useState('')
  const subscribe = (e) => {
    e.preventDefault()
    setState(/^\S+@\S+\.\S+$/.test(email) ? 'ok' : 'bad')
    if (/^\S+@\S+\.\S+$/.test(email)) setEmail('')
  }
  return (
    <footer className="foot">
      <div className="foot-wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <Link to="/" className="logo" style={{ marginBottom: 18 }}>
              <img className="w" style={{ display: 'block' }} src={`${import.meta.env.BASE_URL}img/logo-white.png`} alt={t('Zanda Initiative')} />
            </Link>
            <p>{t('Her future, our focus. Training young women in Kigali in tailoring, digital skills and entrepreneurship.')}</p>
            <form className="news-form" onSubmit={subscribe} noValidate>
              <label htmlFor="nl">{t('Get updates from the workshop')}</label>
              <div>
                <input id="nl" type="email" placeholder={t('Your email')} value={email} onChange={(e) => { setEmail(e.target.value); setState('') }} autoComplete="email" />
                <button className="btn gold" type="submit">{t('Subscribe')}</button>
              </div>
              <small role="status">{state === 'ok' ? t('Thanks, you are subscribed (preview only).') : state === 'bad' ? t('Enter a valid email address.') : ''}</small>
            </form>
          </div>
          <div className="foot-cols">
            <div><h5>{t('Shop')}</h5>
              <button onClick={() => nav('/shop')}>{t('All products')}</button>
              {['Tote Bags', 'Laptop Bags', 'Backpacks', 'Clothing'].map((c) => <button key={c} onClick={() => nav(`/shop?cat=${c}`)}>{t(c)}</button>)}
            </div>
            <div><h5>{t('Collections')}</h5>
              {COLS.map((c) => <button key={c.n} onClick={() => nav(`/shop?col=${c.n}`)}>{c.n}</button>)}
            </div>
            <div><h5>{t('What we do')}</h5>
              <Link to="/services">{t('Services')}</Link><Link to="/book">{t('Book a fitting')}</Link><Link to="/training">{t('Training')}</Link><Link to="/donate">{t('Donate')}</Link>
            </div>
            <div><h5>{t('News and events')}</h5>
              <Link to="/news">{t('News')}</Link><Link to="/events">{t('Events')}</Link><Link to="/gallery">{t('Gallery')}</Link>
            </div>
            <div><h5>Zanda</h5>
              <Link to="/about">{t('About')}</Link><Link to="/contact">{t('Contact')}</Link>
              <span className="addr">{t('Kwa Mushimire, Gasabo District, Kigali, Rwanda')}</span>
              <span className="addr">+250 780 162 164</span>
            </div>
          </div>
        </div>
        <div className="word" aria-hidden="true">Zanda</div>
        <div className="fine"><span>© 2026 Zanda Initiative Ltd · English · Français · Kinyarwanda · <button className="ck-link" onClick={openSettings}>{t('Cookie settings')}</button></span><span>{t('Kigali, Rwanda')}</span></div>
      </div>
    </footer>
  )
}
