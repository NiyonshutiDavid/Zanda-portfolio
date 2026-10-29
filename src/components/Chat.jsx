import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { COLS, PRODUCTS, SERVICES, fmt } from '../data/store'

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
function reply(text) {
  const t = text.toLowerCase()
  const has = (...w) => w.some((x) => t.includes(x))

  const col = COLS.find((c) => t.includes(c.n.toLowerCase()))
  if (col) {
    const n = PRODUCTS.filter((p) => p.col === col.n).length
    return { text: `${col.n} is our ${col.kind.toLowerCase()} collection. ${col.blurb} We have ${n} ${n === 1 ? 'style' : 'styles'} right now.`, links: [[`Shop ${col.n}`, `/shop?col=${col.n}`]] }
  }
  const prod = PRODUCTS.find((p) => t.includes(p.name.toLowerCase()))
  if (prod) return { text: `${prod.name} costs ${fmt(prod.price)}. ${prod.d}`, links: [['View it', `/product/${prod.id}`]] }

  if (has('human', 'person', 'agent', 'someone', 'call', 'phone', 'whatsapp', 'contact', 'address', 'where are you', 'location', 'visit'))
    return { text: `You can reach our team on ${PHONE} or visit the workshop at Kwa Mushimire, Gasabo District, Kigali. You can also send a message and we reply within two working days.`, links: [['Contact us', '/contact'], ['Book a workshop visit', '/book?service=workshop-visit']] }
  if (has('deliver', 'shipping', 'ship', 'arrive', 'how long'))
    return { text: 'We deliver in Kigali within 2 days and across Rwanda in about a week. Delivery is free over 80,000 RWF and 3,000 RWF below that. Made-to-measure clothing takes 1 to 2 weeks.', links: [['Go to checkout', '/checkout']] }
  if (has('pay', 'momo', 'mtn', 'airtel', 'card', 'visa', 'mastercard'))
    return { text: 'You can pay with MTN MoMo, Airtel Money or a Visa or Mastercard card. For MoMo and Airtel you get a prompt on your phone.', links: [['Go to checkout', '/checkout']] }
  if (has('brand', 'logo', 'embroider', 'personali', 'corporate', 'bulk', 'custom bag'))
    return { text: 'Yes. Choose a Personal offer for 1 to 9 bags (a name, initials or a short message), or a Corporate offer for 10 or more with your logo and colours. We send a quote within two working days.', links: [['Request branded bags', '/branded']] }
  if (has('fitting', 'measure', 'uniform', 'tailor', 'cloth', 'shirt', 'sew', 'garment', 'school'))
    return { text: 'We tailor school uniforms, corporate clothing and shirts to measure. Book a 30-minute fitting at the workshop (Mon to Fri, and Saturday mornings), or see ready-made shirts in the shop. Made-to-measure takes 1 to 2 weeks.', links: [['Book a fitting', '/book?service=uniform-fitting'], ['Shop clothing', '/shop?cat=Clothing']] }
  if (has('session', 'workshop', 'learn to sew', 'hands-on'))
    return { text: `The hands-on sewing session is two hours on Saturday mornings. You make a simple tote bag with a Zanda trainer. The fee is ${fmt(SERVICES.find((s) => s.id === 'sewing-session').price)} and it supports the training programme.`, links: [['Book a session', '/book?service=sewing-session']] }
  if (has('train', 'apply', 'join', 'cohort', 'programme', 'program', 'learn-and-earn', 'enrol'))
    return { text: 'Learn-and-Earn is a six-month programme in tailoring, digital skills and entrepreneurship for girls and women aged 15 to 24 in Gasabo District, Kigali. Applications are closed right now. Register your interest and we will tell you when they reopen.', links: [['About the training', '/training'], ['Register interest', '/contact']] }
  if (has('donat', 'give', 'support', 'fund', 'help'))
    return { text: 'Thank you. Your gift funds training, real work and support after graduation for abandoned girls and women. You can give once or monthly with MoMo, Airtel or card.', links: [['Donate', '/donate']] }
  if (has('price', 'cost', 'how much', 'cheap', 'budget'))
    return { text: 'Our bags start around 28,000 RWF for clothing and 30,000 RWF for totes, up to about 76,000 RWF for sets. You can sort the shop by price and filter by budget.', links: [['Browse the shop', '/shop']] }
  if (has('tote', 'backpack', 'laptop', 'bag', 'collection', 'buy', 'shop', 'recommend'))
    return { text: 'We make tote bags, backpacks and laptop bags in three collections: Lumina (totes), Kamo (backpacks and laptop bags) and MwanaGo (kids).', links: [['Browse the shop', '/shop'], ['Tote bags', '/shop?cat=Tote Bags'], ['Laptop bags', '/shop?cat=Laptop Bags']] }
  if (has('order', 'track', 'status', 'refund', 'return', 'exchange'))
    return { text: `For an existing order, a return or an exchange, please call or message ${PHONE} with your order number, and our team will help.`, links: [['Contact us', '/contact']] }
  if (has('who', 'about', 'zanda', 'mission'))
    return { text: 'Zanda Initiative is a Kigali social enterprise that trains abandoned girls and women in tailoring, digital skills and entrepreneurship, then sells what they make. Every purchase supports the next trainee.', links: [['About us', '/about']] }
  if (has('hello', 'hi', 'hey', 'muraho', 'bonjour', 'good morning', 'good afternoon'))
    return { text: 'Hello! I can help with bags, clothing and fittings, delivery, payment, branded orders and the training programme. What would you like to know?' }
  if (has('thank', 'murakoze', 'merci'))
    return { text: 'You are welcome. Ask me anything else, or call us on ' + PHONE + '.' }
  return { text: `I am not sure about that one. I can help with bags, clothing and fittings, delivery, payment, branded orders and training. For anything else, our team is on ${PHONE}.`, links: [['Contact us', '/contact']] }
}

export default function Chat() {
  const nav = useNavigate()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [mode, setMode] = useState('unknown')
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState([{ from: 'bot', text: 'Muraho! I am the Zanda helper. Ask about bags, clothing and fittings, delivery or the training programme.' }])
  const log = useRef(null)
  const field = useRef(null)

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: 'smooth' }) }, [msgs, busy, open])
  useEffect(() => { if (open) setTimeout(() => field.current?.focus(), 250) }, [open])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    if (open) window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  const send = async (text) => {
    const q = text.trim()
    if (!q || busy) return
    const history = [...msgs, { from: 'me', text: q }]
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
      const a = reply(q)
      await new Promise((res) => setTimeout(res, 550))
      setMsgs((m) => [...m, { from: 'bot', ...a }])
    } finally {
      setBusy(false)
    }
  }
  const go = (to) => { setOpen(false); nav(to) }

  return (
    <>
      <button className={'chat-fab' + (open ? ' on' : '')} aria-label={open ? 'Close chat' : 'Chat with us'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="i-chat"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" /><path d="M8 10h8M8 13h5" /></svg>
        <svg viewBox="0 0 24 24" aria-hidden="true" className="i-x"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.section className="chat" role="dialog" aria-label="Chat with Zanda" initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.96 }} transition={{ duration: 0.35, ease }}>
            <header>
              <img src={`${import.meta.env.BASE_URL}img/mark-white.png`} alt="" />
              <div><b>Zanda helper</b><span><i aria-hidden="true" className={mode === 'basic' ? 'warn' : ''} /> {mode === 'ai' ? 'AI assistant' : mode === 'basic' ? 'Basic helper (AI offline)' : 'Ask me anything'}</span></div>
              <button className="chat-x" aria-label="Close chat" onClick={() => setOpen(false)}><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
            </header>
            <div className="chat-log" ref={log} role="log" aria-live="polite">
              {msgs.map((m, i) => (
                <motion.div key={i} className={'msg ' + m.from} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }}>
                  <p>{m.text}</p>
                  {m.links && <div className="msg-links">{m.links.map(([t, to]) => <button key={t} onClick={() => go(to)}>{t} <i aria-hidden="true">↗</i></button>)}</div>}
                </motion.div>
              ))}
              {busy && <div className="msg bot typing" aria-label="Typing"><span /><span /><span /></div>}
            </div>
            <div className="chat-topics">
              {TOPICS.map(([t, q]) => <button key={t} onClick={() => send(q)}>{t}</button>)}
            </div>
            <form className="chat-form" onSubmit={(e) => { e.preventDefault(); send(input) }}>
              <input ref={field} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question" aria-label="Your message" autoComplete="off" />
              <button type="submit" aria-label="Send" disabled={!input.trim() || busy}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
            </form>
            <p className="chat-note">{mode === 'basic' ? 'Keyword helper, not AI. ' : 'Automated assistant, not a person. '}Team: {PHONE}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  )
}

export function BackToTop() {
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
        <motion.button className="to-top" aria-label="Back to top" initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.9 }} transition={{ duration: 0.3, ease }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
