import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { Field, PHONE_RE, EMAIL_RE } from '../components/Field'
import { fmt, img } from '../data/store'

const ease = [0.22, 0.8, 0.2, 1]
const AMOUNTS = [5000, 10000, 25000, 50000]
const PAY = [['momo', 'MTN MoMo'], ['airtel', 'Airtel Money'], ['card', 'Card']]
const SUPPORTS = [
  ['Learn', 'Tailoring, digital and business training for girls and women aged 15 to 24 in the six-month Learn-and-Earn programme.'],
  ['Earn', 'Real customer orders from the start, so every trainee earns while she learns.'],
  ['Stay supported', 'Our Zero Abandonment promise: business incubation, mentorship and continued learning after graduation.'],
]

export default function Donate() {
  const [freq, setFreq] = useState('once')
  const [amount, setAmount] = useState(10000)
  const [custom, setCustom] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', pay: 'momo', anon: false })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const value = custom ? Number(custom.replace(/\D/g, '')) : amount
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!value || value < 1000) er.amount = 'Choose an amount of at least 1,000 RWF'
    if (!form.anon && form.name.trim().length < 2) er.name = 'Enter your name, or give anonymously'
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) er.phone = 'Enter a Rwandan mobile number, like 0788 000 000'
    if (form.email && !EMAIL_RE.test(form.email)) er.email = 'That email address looks incomplete'
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(first === 'amount' ? 'custom' : first)?.focus()
    setDone({ value, freq, name: form.anon ? 'friend' : form.name.split(' ')[0], no: 'ZD-' + Math.floor(100000 + Math.random() * 900000) })
  }

  if (done) {
    return (
      <div className="wrap co-done">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <div className="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
          <div className="eyebrow">Gift received</div>
          <h1 className="caps">Thank you, {done.name}.</h1>
          <p>Your {done.freq === 'monthly' ? 'monthly gift' : 'gift'} of <b>{fmt(done.value)}</b> (reference {done.no}) helps a young woman learn a trade and keep the support she needs afterwards.</p>
          <p className="note">This is a design preview, so no payment was taken.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/shop">Shop the collections <span className="arr">→</span></Link>
            <Link className="btn line" to="/about">About Zanda</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <section className="about-hero band">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 22 }}>Donate</div>
          <h1 className="caps ah-title" aria-label="Give a young woman a trade.">
            <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>Give a young woman</motion.span></span>
            <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}>a trade.</motion.span></span>
          </h1>
          <motion.p className="ah-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>
            Your gift funds training, real work and lasting support for abandoned girls and women in Kigali.
          </motion.p>
        </div>
      </section>

      <section className="sec wrap">
        <div className="don">
          <div className="don-side">
            <Reveal><div className="eyebrow">Where it goes</div></Reveal>
            <ul className="supports">
              {SUPPORTS.map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 0.07}><h3 className="caps">{t}</h3><p>{d}</p></Reveal>
              ))}
            </ul>
            <Reveal><img className="don-img" src={img('pressing-seams.jpg')} alt="A trainee pressing seams in the Zanda workshop" /></Reveal>
          </div>

          <form className="don-form" onSubmit={submit} noValidate>
            <fieldset>
              <legend>1 / Your gift</legend>
              <div className="seg" role="radiogroup" aria-label="Frequency">
                {[['once', 'Give once'], ['monthly', 'Monthly']].map(([k, t]) => (
                  <button key={k} type="button" role="radio" aria-checked={freq === k} className={freq === k ? 'on' : ''} onClick={() => setFreq(k)}>{t}</button>
                ))}
              </div>
              <div className="amts">
                {AMOUNTS.map((a) => (
                  <button key={a} type="button" className={'chip' + (!custom && amount === a ? ' on' : '')} onClick={() => { setAmount(a); setCustom('') }}>{fmt(a)}</button>
                ))}
              </div>
              <Field id="custom" label="Or enter your own amount (RWF)" inputMode="numeric" value={custom} onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ''))} error={errors.amount} placeholder="e.g. 15000" />
            </fieldset>

            <fieldset>
              <legend>2 / About you</legend>
              <div className="grid2">
                <Field id="name" label="Full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" disabled={form.anon} />
                <Field id="phone" label="Mobile number" value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="0788 000 000" />
              </div>
              <Field id="email" label="Email for your receipt (optional)" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              <label className="check"><input type="checkbox" checked={form.anon} onChange={set('anon')} /> Give anonymously</label>
            </fieldset>

            <fieldset>
              <legend>3 / Payment</legend>
              <div className="pays" role="radiogroup" aria-label="Payment method">
                {PAY.map(([id, t]) => (
                  <label key={id} className={'pay' + (form.pay === id ? ' on' : '')}>
                    <input type="radio" name="pay" value={id} checked={form.pay === id} onChange={set('pay')} />
                    <b>{t}</b><span>{id === 'card' ? 'Visa or Mastercard' : 'You will get a prompt on your phone'}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button className="btn gold" type="submit" style={{ justifyContent: 'center' }}>
              Give {fmt(value || 0)}{freq === 'monthly' ? ' every month' : ''} <span className="arr">→</span>
            </button>
            <p className="hint">Design preview: no payment is taken.</p>
          </form>
        </div>
      </section>
    </>
  )
}
