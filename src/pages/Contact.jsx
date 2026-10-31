import { useState } from 'react'
import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { Faq } from '../components/Sections'
import { Field, EMAIL_RE } from '../components/Field'
import { useT } from '../i18n'

const ease = [0.22, 0.8, 0.2, 1]
const TOPICS = ['An order or a bag', 'Donating or partnering', 'Training programme', 'Press or other']

// Phone and address are from the Zanda Initiative organisation record in this repository.
const DETAILS = [
  ['Visit', 'Kwa Mushimire, Gasabo District, Kigali, Rwanda'],
  ['Call or WhatsApp', '+250 780 162 164'],
  ['Languages', 'English, Français, Kinyarwanda'],
]

export default function Contact() {
  const t = useT()
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (form.name.trim().length < 2) er.name = 'Enter your name'
    if (!EMAIL_RE.test(form.email)) er.email = 'Enter an email address we can reply to'
    if (form.message.trim().length < 10) er.message = 'Tell us a little more, at least a sentence'
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) return document.getElementById(first)?.focus()
    setSent(true)
  }

  return (
    <>
      <section className="about-hero band">
        <div className="wrap">
          <div className="eyebrow" style={{ marginBottom: 22 }}>{t('Contact us')}</div>
          <h1 className="caps ah-title" aria-label={t("Let's talk about her future.")}>
            <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>{t("Let's talk about")}</motion.span></span>
            <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}>{t('her future.')}</motion.span></span>
          </h1>
        </div>
      </section>

      <section className="sec wrap">
        <div className="contact">
          <Reveal className="contact-info">
            <p className="lead">{t('Questions about an order, a bag, a donation or the training programme? Send a message and we will reply within two working days.')}</p>
            <dl>
              {DETAILS.map(([k, v]) => <div key={k}><dt>{t(k)}</dt><dd>{t(v)}</dd></div>)}
            </dl>
          </Reveal>

          {sent ? (
            <motion.div className="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
              <div className="tick" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></div>
              <h2 className="caps">{t('Thanks for reaching out.')}</h2>
              <p>{t("We'll be in touch soon, {name}. This is a design preview, so nothing was sent.", { name: form.name.split(' ')[0] })}</p>
              <button className="btn line" onClick={() => { setSent(false); setForm({ name: '', email: '', topic: TOPICS[0], message: '' }) }}>{t('Send another message')}</button>
            </motion.div>
          ) : (
            <Reveal as="div" delay={0.08}>
              <form className="cform" onSubmit={submit} noValidate>
                <div className="grid2">
                  <Field id="name" label={t('Name')} value={form.name} onChange={set('name')} error={errors.name && t(errors.name)} autoComplete="name" />
                  <Field id="email" label={t('Email')} type="email" value={form.email} onChange={set('email')} error={errors.email && t(errors.email)} autoComplete="email" />
                </div>
                <div className="topics" role="radiogroup" aria-label={t('Topic')}>
                  {TOPICS.map((tp) => (
                    <button key={tp} type="button" role="radio" aria-checked={form.topic === tp} className={'chip' + (form.topic === tp ? ' on' : '')} onClick={() => setForm((f) => ({ ...f, topic: tp }))}>{t(tp)}</button>
                  ))}
                </div>
                <Field id="message" label={t('Message')} textarea rows={6} value={form.message} onChange={set('message')} error={errors.message && t(errors.message)} />
                <button className="btn" type="submit" style={{ justifyContent: 'center' }}>{t('Send message')} <span className="arr">→</span></button>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">{t('FAQ')}</div><h2 className="caps">{t('Questions, answered')}</h2></div></Reveal>
        <Faq />
      </section>
    </>
  )
}
