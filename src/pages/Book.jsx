import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { PageTitle } from './Services'
import { Field, PHONE_RE, EMAIL_RE } from '../components/Field'
import { Reveal } from '../components/Reveal'
import { SewingMachine } from '../components/Illus'
import { SERVICES, fmt } from '../data/store'
import { useI18n, LOCALE } from '../i18n'

const WORKSHOP = 'Zanda workshop, Kwa Mushimire, Kigali'
const pad = (n) => String(n).padStart(2, '0')
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3))
const toTime = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const dayLabel = (d, loc = 'en-GB') => d.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' })

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
  const { t, lang } = useI18n()
  const loc = LOCALE[lang]
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
    if (!day) er.when = t('Choose a day and a time')
    else if (!time) er.when = t('Choose a time')
    if (form.name.trim().length < 2) er.name = t('Enter your full name')
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) er.phone = t('Enter a Rwandan mobile number, like 0788 000 000')
    if (form.email && !EMAIL_RE.test(form.email)) er.email = t('That email address looks incomplete')
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(first === 'when' ? 'when' : first)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setDone({ ref: 'BK-' + Math.floor(100000 + Math.random() * 900000), name: form.name.split(' ')[0], svc, day: day.d, time })
  }

  if (done) {
    return (
      <div className="wrap co-done">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}>
          <div className="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
          <div className="eyebrow">{t('Request received')}</div>
          <h1 className="caps">{t('See you soon, {name}.', { name: done.name })}</h1>
          <p><b>{t(done.svc.name)}</b> {t('on {when}, at the {place}.', { when: t('{day} at {time}', { day: dayLabel(done.day, loc), time: done.time }), place: t(WORKSHOP) })} {t('Reference')} <b>{done.ref}</b>. {t(done.svc.confirm)}.</p>
          <p className="note">{t('This is a design preview, so nothing was booked.')}</p>
          <div className="cta-row"><Link className="btn" to="/services">{t('Back to services')} <span className="arr">→</span></Link><Link className="btn line" to="/shop">{t('Shop bags')}</Link></div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <PageTitle eyebrow={t('Book')} a={t('Book a fitting,')} b={t('a visit or a session.')} lead={t('Pick a service, then a day and a time that suit you.')} />
      <section className="sec wrap">
        <form className="book" onSubmit={submit} noValidate>
          <div className="book-main">
            <fieldset>
              <legend>{t('1 / Service')}</legend>
              <div className="bsvcs" role="radiogroup" aria-label={t('Service')}>
                {SERVICES.map((s) => (
                  <button key={s.id} type="button" role="radio" aria-checked={s.id === svc.id} className={'bsvc' + (s.id === svc.id ? ' on' : '')} onClick={() => pick(s.id)}>
                    <b>{t(s.name)}</b>
                    <span>{t(s.mins)} · {s.price ? fmt(s.price) : t('Free')}</span>
                    <small>{t(s.when)}</small>
                  </button>
                ))}
              </div>
              <p className="hint">{t(svc.d)}</p>
            </fieldset>

            <fieldset id="when">
              <legend>{t('2 / Day and time')}</legend>
              <div className="days" role="radiogroup" aria-label={t('Day')}>
                {days.map(({ d }) => (
                  <button key={dayKey(d)} type="button" role="radio" aria-checked={dayKey(d) === dayK} className={'day' + (dayKey(d) === dayK ? ' on' : '')} onClick={() => { setDayK(dayKey(d)); setTime(null) }}>
                    <small>{d.toLocaleDateString(loc, { weekday: 'short' })}</small>
                    <b>{d.getDate()}</b>
                    <small>{d.toLocaleDateString(loc, { month: 'short' })}</small>
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {day && (
                  <motion.div key={dayK} className="times" role="radiogroup" aria-label={t('Time')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {day.slots.map((sl) => (
                      <button key={sl} type="button" role="radio" aria-checked={sl === time} className={'chip' + (sl === time ? ' on' : '')} onClick={() => setTime(sl)}>{sl}</button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {!day && <p className="hint">{t('Choose a day to see the times.')}</p>}
              {errors.when && <p className="err">{errors.when}</p>}
            </fieldset>

            <fieldset>
              <legend>{t('3 / Your details')}</legend>
              <div className="grid2">
                <Field id="name" label={t('Full name')} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field id="phone" label={t('Mobile number')} value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="0788 000 000" />
              </div>
              <div className="grid2">
                <Field id="email" label={t('Email (optional)')} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
                <Field id="people" label={t('Number of people')} type="number" min="1" max="30" value={form.people} onChange={set('people')} />
              </div>
              <Field id="notes" label={t('Anything we should know? (fabric, style, quantity)')} textarea rows={3} value={form.notes} onChange={set('notes')} />
            </fieldset>
          </div>

          <aside className="co-sum" aria-label={t('Booking summary')}>
            <SewingMachine className="sum-illus" />
            <h2 className="caps">{t('Your booking')}</h2>
            <dl>
              <div><dt>{t('Service')}</dt><dd>{t(svc.name)}</dd></div>
              <div><dt>{t('When')}</dt><dd>{day && time ? `${dayLabel(day.d, loc)}, ${time}` : t('Not chosen yet')}</dd></div>
              <div><dt>{t('Where')}</dt><dd>{t(WORKSHOP)}</dd></div>
              <div><dt>{t('Length')}</dt><dd>{t(svc.mins)}</dd></div>
              <div className="grand"><dt>{t('Fee')}</dt><dd>{svc.price ? fmt(svc.price) : t('Free')}</dd></div>
            </dl>
            <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>{t('Request booking')} <span className="arr">→</span></button>
            <p className="hint" style={{ textAlign: 'center' }}>{t(svc.confirm)}. {t('Design preview: nothing is booked.')}</p>
          </aside>
        </form>
      </section>
    </>
  )
}
