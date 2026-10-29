import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { PageTitle } from './Services'
import { Field, PHONE_RE, EMAIL_RE } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { SewingMachine } from '../components/Illus'
import { SERVICES, fmt } from '../data/store'

const WORKSHOP = 'Zanda workshop, Kwa Mushimire, Kigali'
const pad = (n) => String(n).padStart(2, '0')
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))
const toTime = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const dayLabel = (d) => d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

// The next days this service runs, once the notice period has passed.
function openDays(svc, now = new Date()) {
  const out = []
  const earliest = new Date(now.getTime() + svc.notice * 3600 * 1000)
  for (let i = 0; i < 42 && out.length < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i)
    const windows = svc.avail[d.getDay()]
    if (!windows) continue
    const slots = []
    for (const [a, b] of windows) {
      for (let m = toMin(a); m + svc.dur <= toMin(b); m += svc.dur) {
        const at = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, m)
        if (at >= earliest) slots.push(toTime(m))
      }
    }
    if (slots.length) out.push({ d, slots })
  }
  return out
}

export default function Book() {
  const [params, setParams] = useSearchParams()
  const svc = SERVICES.find((s) => s.id === params.get('service')) || SERVICES[0]
  const days = useMemo(() => openDays(svc), [svc])
  const [dayK, setDayK] = useState(null)
  const [time, setTime] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', people: '1', notes: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  const day = days.find((x) => dayKey(x.d) === dayK)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const pick = (id) => { setParams({ service: id }, { replace: true }); setDayK(null); setTime(null) }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (!day) er.when = 'Choose a day and a time'
    else if (!time) er.when = 'Choose a time'
    if (form.name.trim().length < 2) er.name = 'Enter your full name'
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) er.phone = 'Enter a Rwandan mobile number, like 0788 000 000'
    if (form.email && !EMAIL_RE.test(form.email)) er.email = 'That email address looks incomplete'
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(first === 'when' ? 'when' : first)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setDone({ ref: 'BK-' + Math.floor(100000 + Math.random() * 900000), name: form.name.split(' ')[0], svc, when: `${dayLabel(day.d)} at ${time}` })
  }

  if (done) {
    return (
      <div className="wrap co-done">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}>
          <div className="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
          <div className="eyebrow">Request received</div>
          <h1 className="caps">See you soon, {done.name}.</h1>
          <p><b>{done.svc.name}</b> on {done.when}, at the {WORKSHOP}. Reference <b>{done.ref}</b>. {done.svc.confirm}.</p>
          <p className="note">This is a design preview, so nothing was booked.</p>
          <div className="cta-row"><Link className="btn" to="/services">Back to services <span className="arr">→</span></Link><Link className="btn line" to="/shop">Shop bags</Link></div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <PageTitle eyebrow="Book" a="Book a fitting," b="a visit or a session." lead="Pick a service, then a day and a time that suit you." />
      <section className="sec wrap">
        <form className="book" onSubmit={submit} noValidate>
          <div className="book-main">
            <fieldset>
              <legend>1 / Service</legend>
              <div className="bsvcs" role="radiogroup" aria-label="Service">
                {SERVICES.map((s) => (
                  <button key={s.id} type="button" role="radio" aria-checked={s.id === svc.id} className={'bsvc' + (s.id === svc.id ? ' on' : '')} onClick={() => pick(s.id)}>
                    <b>{s.name}</b>
                    <span>{s.mins} · {s.price ? fmt(s.price) : 'Free'}</span>
                    <small>{s.when}</small>
                  </button>
                ))}
              </div>
              <p className="hint">{svc.d}</p>
            </fieldset>

            <fieldset id="when">
              <legend>2 / Day and time</legend>
              <div className="days" role="radiogroup" aria-label="Day">
                {days.map(({ d }) => (
                  <button key={dayKey(d)} type="button" role="radio" aria-checked={dayKey(d) === dayK} className={'day' + (dayKey(d) === dayK ? ' on' : '')} onClick={() => { setDayK(dayKey(d)); setTime(null) }}>
                    <small>{d.toLocaleDateString('en-GB', { weekday: 'short' })}</small>
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString('en-GB', { month: 'short' })}</small>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {day && (
                  <motion.div key={dayK} className="times" role="radiogroup" aria-label="Time" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {day.slots.map((t) => (
                      <button key={t} type="button" role="radio" aria-checked={t === time} className={'chip' + (t === time ? ' on' : '')} onClick={() => setTime(t)}>{t}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {!day && <p className="hint">Choose a day to see the times.</p>}
              {errors.when && <p className="err">{errors.when}</p>}
            </fieldset>

            <fieldset>
              <legend>3 / Your details</legend>
              <div className="grid2">
                <Field id="name" label="Full name" value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field id="phone" label="Mobile number" value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="0788 000 000" />
              </div>
              <div className="grid2">
                <Field id="email" label="Email (optional)" type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                <Field id="people" label="Number of people" type="number" min="1" max="30" value={form.people} onChange={set('people')} />
              </div>
              <Field id="notes" label="Anything we should know? (fabric, style, quantity)" textarea rows={3} value={form.notes} onChange={set('notes')} />
            </fieldset>
          </div>

          <aside className="co-sum" aria-label="Booking summary">
            <SewingMachine className="sum-illus" />
            <h2 className="caps">Your booking</h2>
            <dl>
              <div><dt>Service</dt><dd>{svc.name}</dd></div>
              <div><dt>When</dt><dd>{day && time ? `${dayLabel(day.d)}, ${time}` : 'Not chosen yet'}</dd></div>
              <div><dt>Where</dt><dd>{WORKSHOP}</dd></div>
              <div><dt>Length</dt><dd>{svc.mins}</dd></div>
              <div className="grand"><dt>Fee</dt><dd>{svc.price ? fmt(svc.price) : 'Free'}</dd></div>
            </dl>
            <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>Request booking <span className="arr">→</span></button>
            <p className="hint" style={{ textAlign: 'center' }}>{svc.confirm}. Design preview: nothing is booked.</p>
          </aside>
        </form>
      </section>
    </>
  )
}
