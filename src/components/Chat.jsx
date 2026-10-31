import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { COLS, PRODUCTS, SERVICES, fmt } from '../data/store'
import { useT } from '../i18n'

const PHONE = '+250 780 162 164'
const ease = [0.22, 0.8, 0.2, 1]

const TOPICS = [
  ['Delivery', 'How does delivery work?'],
  ['Book a fitting', 'I want to book a fitting'],
  ['Branded bags', 'Can I get branded bags?'],
  ['Payment', 'How can I pay?'],
  ['Training', 'Tell me about the training'],
  ['Talk to a person', 'I want to talk to a person'],
]

// A simple rule-based helper. It answers from the information on this website and hands over to people for anything else.
// `t` translates the answer into the visitor's language; the keywords are matched against the English question.
function reply(text, t = (s) => s) {
  const lc = text.toLowerCase()
  const has = (...w) => w.some((x) => lc.includes(x))

  const col = COLS.find((c) => lc.includes(c.n.toLowerCase()))
  if (col) {
    const n = PRODUCTS.filter((p) => p.col === col.n).length
    return { text: `${t('{name} is our {kind} collection.', { name: col.n, kind: t(col.kind).toLowerCase() })} ${t(col.blurb)} ${n === 1 ? t('We have 1 style right now.') : t('We have {n} styles right now.', { n })}`, links: [[t('Shop {name}', { name: col.n }), `/shop?col=${col.n}`]] }
  }
  const prod = PRODUCTS.find((p) => lc.includes(p.name.toLowerCase()))
  if (prod) return { text: `${t('{name} costs {price}.', { name: t(prod.name), price: fmt(prod.price) })} ${t(prod.d)}`, links: [[t('View it'), `/product/${prod.id}`]] }

  if (has('human', 'person', 'agent', 'someone', 'call', 'phone', 'whatsapp', 'contact', 'address', 'where are you', 'location', 'visit'))
    return { text: t('You can reach our team on {phone} or visit the workshop at Kwa Mushimire, Gasabo District, Kigali. You can also send a message and we reply within two working days.', { phone: PHONE }), links: [[t('Contact us'), '/contact'], [t('Book a workshop visit'), '/book?service=workshop-visit']] }
  if (has('deliver', 'shipping', 'ship', 'arrive', 'how long'))
    return { text: t('We deliver in Kigali within 2 days and across Rwanda in about a week. Delivery is free over 80,000 RWF and 3,000 RWF below that. Made-to-measure clothing takes 1 to 2 weeks.'), links: [[t('Go to checkout'), '/checkout']] }
  if (has('pay', 'momo', 'mtn', 'airtel', 'card', 'visa', 'mastercard'))
    return { text: t('You can pay with MTN MoMo, Airtel Money or a Visa or Mastercard card. For MoMo and Airtel you get a prompt on your phone.'), links: [[t('Go to checkout'), '/checkout']] }
  if (has('brand', 'logo', 'embroider', 'personali', 'corporate', 'bulk', 'custom bag'))
    return { text: t('Yes. Choose a Personal offer for 1 to 9 bags (a name, initials or a short message), or a Corporate offer for 10 or more with your logo and colours. We send a quote within two working days.'), links: [[t('Request branded bags'), '/branded']] }
  if (has('fitting', 'measure', 'uniform', 'tailor', 'cloth', 'shirt', 'sew', 'garment', 'school'))
    return { text: t('We tailor school uniforms, corporate clothing and shirts to measure. Book a 30-minute fitting at the workshop (Mon to Fri, and Saturday mornings), or see ready-made shirts in the shop. Made-to-measure takes 1 to 2 weeks.'), links: [[t('Book a fitting'), '/book?service=uniform-fitting'], [t('Shop clothing'), '/shop?cat=Clothing']] }
  if (has('session', 'workshop', 'learn to sew', 'hands-on'))
    return { text: t('The hands-on sewing session is two hours on Saturday mornings. You make a simple tote bag with a Zanda trainer. The fee is {fee} and it supports the training programme.', { fee: fmt(SERVICES.find((s) => s.id === 'sewing-session').price) }), links: [[t('Book a session'), '/book?service=sewing-session']] }
  if (has('train', 'apply', 'join', 'cohort', 'programme', 'program', 'learn-and-earn', 'enrol'))
    return { text: t('Learn-and-Earn is a six-month programme in tailoring, digital skills and entrepreneurship for girls and women aged 15 to 24 in Gasabo District, Kigali. Applications are closed right now. Register your interest and we will tell you when they reopen.'), links: [[t('About the training'), '/training'], [t('Register interest'), '/contact']] }
  if (has('donat', 'give', 'support', 'fund', 'help'))
    return { text: t('Thank you. Your gift funds training, real work and support after graduation for abandoned girls and women. You can give once or monthly with MoMo, Airtel or card.'), links: [[t('Donate'), '/donate']] }
  if (has('price', 'cost', 'how much', 'cheap', 'budget'))
    return { text: t('Our bags start around 28,000 RWF for clothing and 30,000 RWF for totes, up to about 76,000 RWF for sets. You can sort the shop by price and filter by budget.'), links: [[t('Browse the shop'), '/shop']] }
  if (has('tote', 'backpack', 'laptop', 'bag', 'collection', 'buy', 'shop', 'recommend'))
    return { text: t('We make tote bags, backpacks and laptop bags in three collections: Lumina (totes), Kamo (backpacks and laptop bags) and MwanaGo (kids).'), links: [[t('Browse the shop'), '/shop'], [t('Tote bags'), '/shop?cat=Tote Bags'], [t('Laptop bags'), '/shop?cat=Laptop Bags']] }
  if (has('order', 'track', 'status', 'refund', 'return', 'exchange'))
    return { text: t('For an existing order, a return or an exchange, please call or message {phone} with your order number, and our team will help.', { phone: PHONE }), links: [[t('Contact us'), '/contact']] }
  if (has('who', 'about', 'zanda', 'mission'))
    return { text: t('Zanda Initiative is a Kigali social enterprise that trains abandoned girls and women in tailoring, digital skills and entrepreneurship, then sells what they make. Every purchase supports the next trainee.'), links: [[t('About us'), '/about']] }
  if (has('hello', 'hi', 'hey', 'muraho', 'bonjour', 'good morning', 'good afternoon'))
    return { text: t('Hello! I can help with bags, clothing and fittings, delivery, payment, branded orders and the training programme. What would you like to know?') }
  if (has('thank', 'murakoze', 'merci'))
    return { text: t('You are welcome. Ask me anything else, or call us on {phone}.', { phone: PHONE }) }
  return { text: t('I am not sure about that one. I can help with bags, clothing and fittings, delivery, payment, branded orders and training. For anything else, our team is on {phone}.', { phone: PHONE }), links: [[t('Contact us'), '/contact']] }
}

export default function Chat() {
  const t = useT()
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState('unknown')
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([{ from: 'bot', hello: true, text: 'Muraho! I am the Zanda helper. Ask about bags, clothing and fittings, delivery or the training programme.' }])
  const log = useRef(null)
  const field = useRef(null)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }) }, [msgs, busy, open])
  useEffect(() => { if (open) setTimeout(() => field.current?.focus(), 250) }, [open])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    if (open) window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  const send = async (text, shown) => {
    const q = text.trim()
    if (!q || busy) return
    const history = [...msgs, { from: 'me', text: shown ?? q }]
    setMsgs(history)
    setInput('')
    setBusy(true)
    try {
      // Ask the AI endpoint first. It answers from the shop and organisation facts.
      const r = await fetch(`${import.meta.env.BASE_URL}api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.map((m) => ({ role: m.from === 'me' ? 'user' : 'assistant', content: m.text })) }),
      })
      if (!r.ok) throw new Error(String(r.status))
      const data = await r.json()
      setMode('ai')
      setMsgs((m) => [...m, { from: 'bot', text: data.text, links: data.links?.length ? data.links : undefined }])
    } catch {
      // No key configured or the service is busy: fall back to the built-in keyword helper.
      setMode('basic')
      const a = reply(q, t)
      await new Promise((res) => setTimeout(res, 550))
      setMsgs((m) => [...m, { from: 'bot', ...a }])
    } finally {
      setBusy(false)
    }
  }
  const go = (to) => { setOpen(false); nav(to) }

  return (
    <>
      <button className={'chat-fab' + (open ? ' on' : '')} aria-label={open ? t('Close chat') : t('Chat with us')} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="i-chat"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" /><path d="M8 10h8M8 13h5" /></svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="i-x"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.section className="chat" role="dialog" aria-label={t('Chat with Zanda')} initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }} transition={{ duration: 0.35, ease }}>
            <header>
              <img src={`${import.meta.env.BASE_URL}img/mark-white.png`} alt="" />
              <div><b>{t('Zanda helper')}</b><span><i aria-hidden="true" className={mode === 'basic' ? 'warn' : ''} /> {mode === 'ai' ? t('AI assistant') : mode === 'basic' ? t('Basic helper (AI offline)') : t('Ask me anything')}</span></div>
              <button className="chat-x" aria-label={t('Close chat')} onClick={() => setOpen(false)}><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
            </header>
            <div className="chat-log" ref={log} role="log" aria-live="polite">
              {msgs.map((m, i) => (
                <motion.div key={i} className={'msg ' + m.from} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                  <p>{m.hello ? t(m.text) : m.text}</p>
                  {m.links && <div className="msg-links">{m.links.map(([label, to]) => <button key={label} onClick={() => go(to)}>{label} <i aria-hidden="true">↗</i></button>)}</div>}
                </motion.div>
              ))}
              {busy && <div className="msg bot typing" aria-label={t('Typing')}><span /><span /><span /></div>}
            </div>
            <div className="chat-topics">
              {TOPICS.map(([label, q]) => <button key={label} onClick={() => send(q, t(q))}>{t(label)}</button>)}
            </div>
            <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input) }}>
              <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('Type your question')} aria-label={t('Your message')} autoComplete="off" />
              <button type="submit" aria-label={t('Send')} disabled={!input.trim() || busy}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </form>
            <p className="chat-note">{mode === 'basic' ? t('Keyword helper, not AI.') : t('Automated assistant, not a person.')} {t('Team: {phone}', { phone: PHONE })}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

export function BackToTop() {
  const t = useT()
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button className="to-top" aria-label={t('Back to top')} initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.9 }} transition={{ duration: 0.3, ease }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
