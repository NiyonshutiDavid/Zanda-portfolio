import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { SLIDES, img } from '../data/store'

const DUR = 6000
const ease = [0.22, 0.8, 0.2, 1]
const pad = (n) => String(n).padStart(2, '0')

// One title line. Letters rise out of a mask one after another.
export function Line({ text, delay, reduce, small }) {
  return (
    <span className="ln" style={small ? { fontSize: '.5em', paddingTop: '.14em' } : undefined}>
      <span aria-hidden="true">
        {[...text].map((c, k) => (
          <motion.span
            key={k}
            className="ch"
            initial={reduce ? false : { y: '112%', rotate: 7 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.85, delay: delay + k * 0.04, ease }}
          >
            {c === ' ' ? ' ' : c}
          </motion.span>
        ))}
      </span>
    </span>
  )
}

export default function Hero() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()
  const nav = useNavigate()
  const s = SLIDES[i]

  const go = useCallback((n) => setI((n + SLIDES.length) % SLIDES.length), [])

  // Light photos need dark text, and the header over the hero follows the slide.
  useEffect(() => {
    document.documentElement.classList.toggle('hero-light', Boolean(s.light))
    return () => document.documentElement.classList.remove('hero-light')
  }, [s.light])

  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => go(i + 1), DUR)
    return () => clearTimeout(t)
  }, [i, paused, reduce, go])

  return (
    <section
      className={'hero' + (s.light ? ' light' : '')}
      aria-roledescription="carousel"
      aria-label="Featured collections"
    >
      <div className="slides" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={s.img}
            className="slide"
            style={{ '--focus': s.focus }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            <picture>
              {s.imgM && <source media="(max-aspect-ratio: 4/5)" srcSet={img(s.imgM)} />}
              <motion.img
                src={img(s.img)}
                alt=""
                initial={{ scale: reduce ? 1.02 : 1.14 }}
                animate={{ scale: 1.02 }}
                transition={{ duration: 9, ease: 'easeOut' }}
              />
            </picture>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="hero-shade" />

      <div className="wrap hero-in">
        <div className="hero-bottom">
          <div className="hero-text">
            <AnimatePresence mode="wait" initial>
              <motion.div key={s.l1 + s.l2} className="hero-copy-block" exit={{ opacity: 0, y: -14, transition: { duration: 0.3 } }}>
                <motion.div className="eyebrow" style={{ color: 'var(--gold)' }} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }}>
                  {s.eyebrow}
                </motion.div>
                <h1 className="caps" style={{ '--fit': `calc(var(--avail) / ${(Math.max(s.l1.length, s.l2.length * (s.small2 ? 0.5 : 1)) * 0.66).toFixed(1)})` }} aria-label={`${s.l1} ${s.l2}`}>
                  <Line text={s.l1} delay={0.05} reduce={reduce} />
                  <Line text={s.l2} delay={0.05 + s.l1.length * 0.04 * 0.6} reduce={reduce} small={s.small2} />
                </h1>
              </motion.div>
            </AnimatePresence>

            <div className="cta-row">
              <button className="btn gold" onClick={() => nav(s.cta[1])}>
                {s.cta[0]} <span className="arr">→</span>
              </button>
              <button className="btn line" onClick={() => (s.cta2 ? nav(s.cta2[1]) : document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }))}>
                {s.cta2 ? s.cta2[0] : 'All collections'}
              </button>
            </div>

            <div className="pager" aria-label="Slide controls">
              <button className="ic" aria-label="Previous slide" onClick={() => go(i - 1)}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button>
              <button className="ic" aria-label="Next slide" onClick={() => go(i + 1)}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
              <span className="count"><b>{pad(i + 1)}</b> / {pad(SLIDES.length)}</span>
            </div>
          </div>

          <div className="rail" role="tablist" aria-label="Choose slide" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
            {SLIDES.map((x, k) => (
              <button
                key={x.img}
                role="tab"
                aria-selected={k === i}
                aria-label={`${x.l1} ${x.l2}`}
                className={'th' + (k === i ? ' on' : '')}
                onClick={() => go(k)}
              >
                <img src={img(x.thumb)} alt="" />
                <em>{pad(k + 1)}</em>
                {k === i && !reduce && (
                  <i
                    key={i + String(paused)}
                    className="bar"
                    style={{ animationDuration: `${DUR}ms`, animationPlayState: paused ? 'paused' : 'running' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
