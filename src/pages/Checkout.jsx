import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { fmt, img } from '../data/store'
import { Field } from '../components/Field'
import { Tote } from '../components/Illus'
import { downloadReceipt } from '../components/receipt'
import { allowed, forgetShipping, getShipping, openSettings, setShipping } from '../lib/consent'

const FREE_OVER = 80000
const FEE = 3000
const PAY = [
  ['momo', 'MTN MoMo', 'Pay from your phone with a prompt'],
  ['airtel', 'Airtel Money', 'Pay from your phone with a prompt'],
  ['card', 'Card', 'Visa or Mastercard'],
]

export default function Checkout() {
  const { items, total, clear, remove } = useCart()
  const [form, setForm] = useState(() => ({ name: '', phone: '', email: '', address: '', district: 'Gasabo', notes: '', pay: 'momo', ...(getShipping() || {}) }))
  const [remembered, setRemembered] = useState(() => Boolean(getShipping()))
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)
  const [busy, setBusy] = useState(false)

  const fee = total >= FREE_OVER || total === 0 ? 0 : FEE
  const grand = total + fee
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Enter your full name'
    if (!/^(\+?250|0)?7\d{8}$/.test(form.phone.replace(/\s/g, ''))) er.phone = 'Enter a Rwandan mobile number, like 0788 000 000'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'That email address looks incomplete'
    if (form.address.trim().length < 4) er.address = 'Enter your street or landmark'
    setErrors(er)
    if (Object.keys(er).length) {
      document.getElementById(Object.keys(er)[0])?.focus()
      return
    }
    setShipping({ name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim(), district: form.district })
    setDone({
      no: 'ZN-' + String(Math.floor(100000 + Math.random() * 900000)), grand, name: form.name.trim().split(' ')[0], pay: PAY.find((p) => p[0] === form.pay)[1],
      fullName: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(), address: form.address.trim(), district: form.district, notes: form.notes.trim(),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      subtotal: total, fee, lines: items.map((l) => ({ name: l.p.name, q: l.q, price: l.p.price })),
    })
    clear()
  }

  if (done) return <ThankYou done={done} busy={busy} onReceipt={async () => { setBusy(true); try { await downloadReceipt(done) } finally { setBusy(false) } }} />

  if (items.length === 0) {
    return (
      <div className="wrap co-done">
        <Tote className="none-illus" />
        <div className="eyebrow">Checkout</div>
        <h1 className="caps">Your bag is empty.</h1>
        <p>Add a bag from the shop and come back here to check out.</p>
        <Link className="btn" to="/shop">Go to the shop <span className="arr">→</span></Link>
      </div>
    )
  }

  return (
    <div className="wrap">
      <section className="shop-head" style={{ paddingBottom: 12 }}>
        <div className="eyebrow">Secure checkout</div>
        <h1 className="caps" style={{ fontSize: 'clamp(48px,9vw,140px)' }}>Checkout</h1>
      </section>
      <form className="co" onSubmit={submit} noValidate>
        <div className="co-main">
          <fieldset>
            <legend>1 / Contact</legend>
            <div className="grid2">
              <Field id="name" label="Full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
              <Field id="phone" label="Mobile number" value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="0788 000 000" />
            </div>
            <Field id="email" label="Email (optional)" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          </fieldset>

          <fieldset>
            <legend>2 / Delivery</legend>
            <Field id="address" label="Street or landmark" value={form.address} onChange={set('address')} error={errors.address} autoComplete="street-address" />
            <div className="grid2">
              <label className="fld" htmlFor="district"><span>District</span>
                <select id="district" value={form.district} onChange={set('district')}>
                  {['Gasabo', 'Kicukiro', 'Nyarugenge', 'Outside Kigali'].map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <Field id="notes" label="Delivery notes (optional)" value={form.notes} onChange={set('notes')} />
            </div>
            <p className="hint">
              {remembered
                ? <>We filled in your saved details. <button type="button" className="ck-link" onClick={() => { forgetShipping(); setRemembered(false); setForm((f) => ({ ...f, name: '', phone: '', email: '', address: '', district: 'Gasabo' })) }}>Forget them</button></>
                : allowed('details') ? 'Your details will be saved on this device for next time.' : <>Want a faster next order? <button type="button" className="ck-link" onClick={openSettings}>Allow saving my delivery details</button></>}
            </p>
            <p className="hint">Kigali in 2 days, the rest of Rwanda in about a week. Free delivery over {fmt(FREE_OVER)}.</p>
          </fieldset>

          <fieldset>
            <legend>3 / Payment</legend>
            <div className="pays" role="radiogroup" aria-label="Payment method">
              {PAY.map(([id, t, d]) => (
                <label key={id} className={'pay' + (form.pay === id ? ' on' : '')}>
                  <input type="radio" name="pay" value={id} checked={form.pay === id} onChange={set('pay')} />
                  <b>{t}</b><span>{d}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <aside className="co-sum" aria-label="Order summary">
          <h2 className="caps">Your order</h2>
          <ul>
            <AnimatePresence initial={false}>
              {items.map((l) => (
                <motion.li key={l.id} layout exit={{ opacity: 0, height: 0 }}>
                  <img src={img(l.p.imgs[0])} alt="" />
                  <div><b>{l.p.name}</b><small>{l.q} × {fmt(l.p.price)}</small><button type="button" className="rm" onClick={() => remove(l.id)}>Remove</button></div>
                  <span>{fmt(l.p.price * l.q)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <dl>
            <div><dt>Subtotal</dt><dd>{fmt(total)}</dd></div>
            <div><dt>Delivery</dt><dd>{fee ? fmt(fee) : 'Free'}</dd></div>
            <div className="grand"><dt>Total</dt><dd>{fmt(grand)}</dd></div>
          </dl>
          <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Place order <span className="arr">→</span></button>
          <p className="hint" style={{ textAlign: 'center' }}>Design preview: no payment is taken.</p>
        </aside>
      </form>
      <div style={{ height: 64 }} />
    </div>
  )
}

const ease = [0.22, 0.8, 0.2, 1]

// Full-screen confirmation. It covers the page, so scrolling is locked while it is open.
function ThankYou({ done, busy, onReceipt }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    return () => { document.body.style.overflow = prev }
  }, [])
  return (
    <motion.div className="ty" role="dialog" aria-modal="true" aria-labelledby="ty-h" initial={{ clipPath: 'circle(0% at 50% 60%)' }} animate={{ clipPath: 'circle(150% at 50% 60%)' }} transition={{ duration: 1, ease }}>
      <div className="ty-glow" aria-hidden="true" />
      <div className="ty-in">
        <motion.div className="ty-tick" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 14 }}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </motion.div>
        <motion.div className="eyebrow" style={{ color: 'var(--gold)' }} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6, ease }}>Order placed · {done.no}</motion.div>
        <h1 id="ty-h" className="caps" aria-label={`Thank you, ${done.name}.`}>
          <span className="ln"><motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1, duration: 0.9, ease }}>Thank you,</motion.span></span>
          <span className="ln"><motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 1.12, duration: 0.9, ease }}>{done.name}.</motion.span></span>
        </h1>
        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.7, ease }}>
          Your order is confirmed for <b>{fmt(done.grand)}</b> ({done.pay}). We will message you to confirm delivery. Your purchase helps fund the next trainee.
        </motion.p>
        <motion.div className="cta-row" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.75, duration: 0.7, ease }}>
          <button className="btn gold" type="button" onClick={onReceipt} disabled={busy}>{busy ? 'Preparing your receipt' : 'Download your order receipt'} <span className="arr">↓</span></button>
          <Link className="btn line" to="/shop">Keep shopping</Link>
        </motion.div>
        <motion.div className="ty-links" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.7 }}>
          <Link to="/about">About Zanda</Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
