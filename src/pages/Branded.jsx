import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'motion/react'
import { PageTitle } from './Services'
import { Field, PHONE_RE, EMAIL_RE } from '../components/Field'
import { Tote, Backpack } from '../components/Illus'
import BagPreview from '../components/BagPreview'
import { COLOURS, FONTS, PHOTOS, PRODUCT_STYLE, defaultColour } from '../components/bagDesign'
import { COLS, PRODUCTS, img } from '../data/store'
import { useT } from '../i18n'

const KINDS = {
  personal: { t: 'Personal', d: 'For you, a gift or a small group. One to nine bags with a name, initials or a short message stitched on.', min: 1, max: 9, points: ['Name or initials embroidery', 'Gift packaging on request', 'Ready in about two weeks'] },
  corporate: { t: 'Corporate', d: 'For a company, school, NGO or event. Ten or more bags with your logo, colours and a quote on invoice.', min: 10, max: 5000, points: ['Logo embroidery or print', 'Colours matched to your brand', 'Quote and invoice, scheduled delivery'] },
}
const ease = [0.22, 0.8, 0.2, 1]

// The collection, the bag style inside it and the photo always agree. Kamo also comes as a laptop bag.
const styleOf = (id) => PHOTOS.find((p) => p.id === id)
const bagFor = (col, photo, bag) => (col === 'Kamo' && ['Backpack', 'Laptop bag'].includes(bag) ? bag : styleOf(photo).bag)
function sync(cur, ch) {
  let { col, photo, bag } = cur
  if (ch.col) {
    col = ch.col
    if (styleOf(photo).col !== col) photo = PHOTOS.find((p) => p.col === col).id
    bag = bagFor(col, photo, bag)
  }
  if (ch.photo) {
    photo = ch.photo
    col = styleOf(photo).col
    bag = bagFor(col, photo, bag)
  }
  if (ch.bag) bag = ch.bag
  return { col, photo, bag }
}

function useWide() {
  const q = '(min-width: 901px)'
  const [w, setW] = useState(() => window.matchMedia(q).matches)
  useEffect(() => {
    const m = window.matchMedia(q)
    const on = () => setW(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return w
}

export default function Branded() {
  const t = useT()
  const [params] = useSearchParams()
  const from = PRODUCTS.find((p) => p.id === params.get('bag'))
  const [kind, setKind] = useState('personal')
  const start = (() => {
    const photo0 = (from && PRODUCT_STYLE[from.id]) || 'lumina-cream'
    const st = styleOf(photo0)
    const bag0 = from?.cat === 'Laptop Bags' ? 'Laptop bag' : st.bag
    return { col: st.col, photo: photo0, bag: bag0 }
  })()
  const [sel, setSel] = useState(start)
  const { bag, col, photo } = sel
  const first = styleOf(start.photo)
  const styles = PHOTOS.filter((p) => p.col === col)
  const [design, setDesign] = useState({ finish: 'embroidery', font: 'display', colour: first.dark ? '#F7F3EC' : '#14263F', size: 7, pos: { x: first.x, y: first.y }, logo: null })
  const patch = (d) => setDesign((cur) => ({ ...cur, ...d }))
  // Change the bag type, collection or photo together; a new photo puts the design back in its natural spot.
  const apply = (change) => {
    const next = sync(sel, change)
    setSel(next)
    if (next.photo !== sel.photo) {
      const p = styleOf(next.photo)
      setDesign((cur) => ({ ...cur, pos: { x: p.x, y: p.y }, colour: defaultColour(cur.colour, p) }))
    }
  }
  useEffect(() => () => { if (design.logo) URL.revokeObjectURL(design.logo) }, [design.logo])
  const upload = (e) => {
    const f = e.target.files?.[0]
    if (f && f.type.startsWith('image/')) patch({ logo: URL.createObjectURL(f) })
  }
  const wide = useWide()
  const [form, setForm] = useState({ qty: '1', text: '', colours: '', name: '', org: '', phone: '', email: '', by: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)
  const k = KINDS[kind]
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const choose = (key) => { setKind(key); setForm((f) => ({ ...f, qty: String(KINDS[key].min) })) }

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    const q = Number(form.qty)
    if (!q || q < k.min) er.qty = kind === 'corporate' ? t('Corporate orders start at 10 bags') : t('Enter at least 1 bag')
    else if (q > k.max) er.qty = kind === 'personal' ? t('For ten or more, choose Corporate') : t('Please call us for orders this large')
    if (form.text.trim().length < 2) er.text = t('Tell us what to put on the bag')
    if (form.name.trim().length < 2) er.name = t('Enter your full name')
    if (kind === 'corporate' && form.org.trim().length < 2) er.org = t('Enter the company or school name')
    if (!PHONE_RE.test(form.phone.replace(/\s/g, ''))) er.phone = t('Enter a Rwandan mobile number, like 0788 000 000')
    if (form.email && !EMAIL_RE.test(form.email)) er.email = t('That email address looks incomplete')
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(first)?.focus()
    setDone({ ref: 'BR-' + Math.floor(100000 + Math.random() * 900000), name: form.name.split(' ')[0], kind, q })
  }

  if (done) {
    return (
      <div className="wrap co-done">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }}>
          <div className="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
          <div className="eyebrow">{t('Request received')}</div>
          <h1 className="caps">{t('Thank you, {name}.', { name: done.name })}</h1>
          <p>{t('We have your {kind} request for {q} {bags}', { kind: t(done.kind), q: done.q, bags: t(done.q === 1 ? 'branded bag' : 'branded bags') })} ({t('reference')} <b>{done.ref}</b>). {t('We will reply within two working days with a quote and a sample plan.')}</p>
          <p className="note">{t('This is a design preview, so nothing was sent.')}</p>
          <div className="cta-row"><Link className="btn" to="/shop">{t('Keep shopping')} <span className="arr">→</span></Link><Link className="btn line" to="/services">{t('Our services')}</Link></div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <PageTitle eyebrow={t('Branded bags')} a={t('Your name or logo,')} b={t('on our bags.')} lead={t('Choose a personal or corporate offer, tell us what you need, and we will send a quote.')} />
      <section className="sec wrap">
        <form className="book" onSubmit={submit} noValidate>
          <div className="book-main">
            <fieldset>
              <legend>{t('1 / Choose your offer')}</legend>
              <div className="offers" role="radiogroup" aria-label={t('Offer')}>
                {Object.entries(KINDS).map(([key, o]) => (
                  <button key={key} type="button" role="radio" aria-checked={kind === key} className={'offer' + (kind === key ? ' on' : '')} onClick={() => choose(key)}>
                    {key === 'personal' ? <Tote className="offer-illus" /> : <Backpack className="offer-illus" />}
                    <b className="caps">{t(o.t)}</b>
                    <span>{t(o.d)}</span>
                    <ul>{o.points.map((p) => <li key={p}>{t(p)}</li>)}</ul>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend>{t('2 / The bags')}</legend>
              <div className="pick">
                <span className="bp-lbl">{t('Collection')}</span>
                <div className="colpick" role="radiogroup" aria-label={t('Collection')}>
                  {COLS.map((c) => (
                    <button key={c.n} type="button" role="radio" aria-checked={col === c.n} className={col === c.n ? 'on' : ''} onClick={() => apply({ col: c.n })}>
                      <img src={img(c.sq || c.img)} alt="" style={{ objectPosition: c.sq ? undefined : c.pos }} />
                      <b>{c.n}</b>
                      <small>{t(c.kind)}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pick">
                <span className="bp-lbl">{t('Choose a bag from {col}', { col })}</span>
                <div className="stylepick" role="radiogroup" aria-label={t('{col} bags', { col })}>
                  {styles.map((st) => (
                    <button key={st.id} type="button" role="radio" aria-checked={photo === st.id} className={photo === st.id ? 'on' : ''} onClick={() => apply({ photo: st.id })}>
                      <img src={img(st.src)} alt="" />
                      <b>{t(st.name)}</b>
                    </button>
                  ))}
                </div>
              </div>
              {col === 'Kamo' && (
                <div className="pick">
                  <span className="bp-lbl">{t('Kamo comes as')}</span>
                  <div className="bp-seg" role="radiogroup" aria-label={t('Kamo type')}>
                    {['Backpack', 'Laptop bag'].map((b) => <button key={b} type="button" role="radio" aria-checked={bag === b} className={bag === b ? 'on' : ''} onClick={() => apply({ bag: b })}>{t(b)}</button>)}
                  </div>
                </div>
              )}
              <div className="grid2">
                <Field id="qty" label={t('How many? ({range})', { range: t(kind === 'personal' ? '1 to 9' : '10 or more') })} type="number" min={k.min} value={form.qty} onChange={set('qty')} error={errors.qty} />
                <Field id="by" label={t('Needed by (optional)')} type="date" value={form.by} onChange={set('by')} />
              </div>
              <Field id="text" label={kind === 'personal' ? t('Name, initials or message') : t('Logo or text to put on the bags')} value={form.text} onChange={set('text')} error={errors.text} placeholder={kind === 'personal' ? t('e.g. Aline U.') : t('e.g. Company name and logo')} />
              <div className="cfg">
                <div className="cfg-group">
                  <span className="bp-lbl">{t('Finish')}</span>
                  <div className="bp-seg" role="radiogroup" aria-label={t('Finish')}>
                    {[['embroidery', 'Embroidered'], ['print', 'Printed']].map(([k2, fl]) => <button key={k2} type="button" role="radio" aria-checked={design.finish === k2} className={design.finish === k2 ? 'on' : ''} onClick={() => patch({ finish: k2 })}>{t(fl)}</button>)}
                  </div>
                </div>
                <div className="cfg-group">
                  <span className="bp-lbl">{t('Lettering')}</span>
                  <div className="bp-seg" role="radiogroup" aria-label={t('Lettering')}>
                    {FONTS.map(([fl, k2]) => <button key={k2} type="button" role="radio" aria-checked={design.font === k2} className={design.font === k2 ? 'on' : ''} onClick={() => patch({ font: k2 })}>{t(fl)}</button>)}
                  </div>
                </div>
                <div className="cfg-group">
                  <span className="bp-lbl">{t('Thread or ink colour')}</span>
                  <div className="bp-sw" role="radiogroup" aria-label={t('Thread or ink colour')}>
                    {COLOURS.map(([n, c]) => <button key={c} type="button" role="radio" aria-checked={design.colour === c} aria-label={t(n)} title={t(n)} className={design.colour === c ? 'on' : ''} style={{ background: c }} onClick={() => patch({ colour: c })} />)}
                  </div>
                </div>
                <div className="cfg-group">
                  <span className="bp-lbl">{kind === 'corporate' ? t('Company logo') : t('Logo (optional)')}</span>
                  <div className="bp-logo-row">
                    <label className="btn line bp-up">{design.logo ? t('Change logo') : t('Upload logo')}<input type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" onChange={upload} /></label>
                    {design.logo && <button type="button" className="chip" onClick={() => patch({ logo: null })}>{t('Remove')}</button>}
                  </div>
                </div>
              </div>
              <Field id="colours" label={t('Notes on colours (optional)')} value={form.colours} onChange={set('colours')} placeholder={t('e.g. navy thread with gold outline')} />
              {kind === 'corporate' && <p className="hint">{t('After you send this, we will ask you to share your logo file by email or WhatsApp.')}</p>}
            </fieldset>

            {!wide && (
              <fieldset>
                <legend>{t('3 / See it on the bag')}</legend>
                <BagPreview text={form.text} photoId={photo} design={design} onDesign={patch} />
              </fieldset>
            )}

            <fieldset>
              <legend>{t(wide ? '3 / Your details' : '4 / Your details')}</legend>
              <div className="grid2">
                <Field id="name" label={t('Full name')} value={form.name} onChange={set('name')} error={errors.name} autoComplete="name" />
                <Field id="phone" label={t('Mobile number')} value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" inputMode="tel" placeholder="0788 000 000" />
              </div>
              {kind === 'corporate' && <Field id="org" label={t('Company, school or organisation')} value={form.org} onChange={set('org')} error={errors.org} autoComplete="organization" />}
              <Field id="email" label={t('Email (optional)')} type="email" value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" />
              <Field id="notes" label={t('Anything else we should know?')} textarea rows={3} value={form.notes} onChange={set('notes')} />
            </fieldset>

            <aside className="co-sum" aria-label={t('Request summary')}>
            <h2 className="caps">{t('Your request')}</h2>
            <dl>
              <div><dt>{t('Offer')}</dt><dd>{t(k.t)}</dd></div>
              <div><dt>{t('Bags')}</dt><dd>{form.qty || 0} × {t(bag)}</dd></div>
              <div><dt>{t('Collection')}</dt><dd>{col}</dd></div>
              <div><dt>{t('Style')}</dt><dd>{t(styleOf(photo).name)}</dd></div>
              <div><dt>{t('Branding')}</dt><dd>{form.text || t('Not entered yet')}</dd></div>
            </dl>
            <button className="btn" type="submit" style={{ width: '100%', justifyContent: 'center' }}>{t('Request a quote')} <span className="arr">→</span></button>
            <p className="hint" style={{ textAlign: 'center' }}>{t('We reply within two working days.')} {t('Design preview: nothing is sent.')}</p>
            </aside>
          </div>

          {wide && (
          <div className="book-side">
            <section className="bp-card" aria-label={t('See it on the bag')}>
              <BagPreview text={form.text} photoId={photo} design={design} onDesign={patch} />
            </section>
          </div>
          )}
        </form>
      </section>
    </>
  )
}
