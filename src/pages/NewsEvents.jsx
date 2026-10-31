import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { PageTitle } from './Services'
import { Thread } from '../components/Illus'
import Select from '../components/Select'
import { NEWS, SERVICES, GALLERY, img } from '../data/store'
import { useI18n, useT } from '../i18n'

const RW_MONTHS = ['Mutarama', 'Gashyantare', 'Werurwe', 'Mata', 'Gicurasi', 'Kamena', 'Nyakanga', 'Kanama', 'Nzeri', 'Ukwakira', 'Ugushyingo', 'Ukuboza']
// English dates come from the data as written; French and Kinyarwanda are formatted from the ISO date.
const niceDate = (n, lang) => {
  if (lang === 'fr') return new Date(n.iso + 'T00:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
  if (lang === 'rw') { const [y, m, d] = n.iso.split('-').map(Number); return `${d} ${RW_MONTHS[m - 1]} ${y}` }
  return n.date
}

export function News() {
  const { t, lang } = useI18n()
  const [open, setOpen] = useState(null)
  const [q, setQ] = useState('')
  const [tag, setTag0] = useState('All')
  const [sort, setSort0] = useState('new')
  const tools = useRef(null)
  // Choosing a topic or order glides back up to the filters, so the list starts at the top.
  const toTools = () => tools.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const setTag = (t) => { setTag0(t); toTools() }
  const setSort = (v) => { setSort0(v); toTools() }
  const tags = ['All', ...new Set(NEWS.map((n) => n.tag))]
  const list = useMemo(() => {
    const t = q.trim().toLowerCase()
    const l = NEWS.filter((n) => (tag === 'All' || n.tag === tag) && (!t || `${t(n.title)} ${t(n.summary)} ${t(n.body)}`.toLowerCase().includes(t)))
    return l.sort((a, b) => (sort === 'new' ? b.iso.localeCompare(a.iso) : a.iso.localeCompare(b.iso)))
  }, [q, tag, sort, t])
  return (
    <>
      <PageTitle eyebrow="News" a="What is happening" b="at Zanda." lead="Updates from the workshop, the programme and the people in it." />
      <section className="sec wrap">
        <div className="news-tools" ref={tools}>
          <form className="search" role="search" onSubmit={(e) => e.preventDefault()}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input type="search" placeholder={t('Search news')} value={q} onChange={(e) => setQ(e.target.value)} aria-label={t('Search news')} />
            {q && <button type="button" aria-label={t('Clear search')} onClick={() => setQ('')}>×</button>}
          </form>
          <div className="topics" role="radiogroup" aria-label={t('Topic')}>
            {tags.map((g) => <button key={g} role="radio" aria-checked={tag === g} className={'chip' + (tag === g ? ' on' : '')} onClick={() => setTag(g)}>{t(g)}</button>)}
          </div>
          <Select label={t('Sort')} value={sort} onChange={setSort} options={[{ value: 'new', label: t('Newest first') }, { value: 'old', label: t('Oldest first') }]} />
        </div>
        <p className="count" aria-live="polite">{list.length} {list.length === 1 ? t('story') : t('stories')}</p>
        <div className="news">
          {list.map((n, i) => (
            <Reveal as="article" key={n.slug} delay={i * 0.08} className="post">
              <img src={img(n.img)} alt="" loading="lazy" />
              <div>
                <div className="post-meta"><time>{niceDate(n, lang)}</time><span className="chip">{t(n.tag)}</span></div>
                <h2 className="caps">{t(n.title)}</h2>
                <p>{t(n.summary)}</p>
                <AnimatePresence initial={false}>
                  {open === n.slug && (
                    <motion.p key="b" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>{t(n.body)}</motion.p>
                  )}
                </AnimatePresence>
                <button className="btn line" aria-expanded={open === n.slug} onClick={() => setOpen(open === n.slug ? null : n.slug)}>
                  {open === n.slug ? t('Show less') : t('Read more')} <span className="arr">→</span>
                </button>
              </div>
            </Reveal>
          ))}
          {list.length === 0 && (
            <div className="none"><Thread className="none-illus" /><h2 className="caps">{t('No stories found.')}</h2><p>{t('Try another word or topic.')}</p><button className="btn" onClick={() => { setQ(''); setTag('All') }}>{t('Clear search')}</button></div>
          )}
        </div>
      </section>
    </>
  )
}

export function Events() {
  const t = useT()
  const visit = SERVICES.find((s) => s.id === 'workshop-visit')
  return (
    <>
      <PageTitle eyebrow="Events" a="Come and see" b="the workshop." lead="Meet the trainees and see Learn-and-Earn at work." />
      <section className="sec wrap">
        <div className="evs">
          <Reveal className="ev">
            <div className="eyebrow">{t('Regular')}</div>
            <h2 className="caps">{t(visit.name)}</h2>
            <p>{t(visit.d)}</p>
            <div className="svc-meta"><span className="chip on">{t(visit.mins)}</span><span className="chip">{t(visit.when)}</span></div>
            <Link className="btn" to="/book?service=workshop-visit">{t('Book a visit')} <span className="arr">→</span></Link>
          </Reveal>
          <Reveal className="ev alt" delay={0.1}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>{t('Upcoming')}</div>
            <h2 className="caps">{t('No public events announced yet.')}</h2>
            <p>{t('When we schedule open days, launches or cohort graduations, they will be listed here.')}</p>
            <Link className="btn gold" to="/contact">{t('Ask to be told')} <span className="arr">→</span></Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export function Gallery() {
  const t = useT()
  const [tag, setTag0] = useState('All')
  const [lb, setLb] = useState(null)
  const bar = useRef(null)
  const setTag = (t) => { setTag0(t); bar.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const list = GALLERY.filter((g) => tag === 'All' || g[2] === tag)
  const step = useCallback((d) => setLb((i) => (i === null ? i : (i + d + list.length) % list.length)), [list.length])

  useEffect(() => {
    if (lb === null) return
    const k = (e) => { if (e.key === 'Escape') setLb(null); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    window.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [lb, step])

  return (
    <>
      <PageTitle eyebrow="Gallery" a="Inside the workshop," b="and out in the world." lead="Training, clothing and bags, all made in Kigali." />
      <section className="sec wrap gal-bar" style={{ paddingBottom: 0 }} ref={bar}>
        <div className="topics" role="radiogroup" aria-label={t('Filter')}>
          {['All', 'Training', 'Bags', 'Clothing'].map((c) => (
            <button key={c} role="radio" aria-checked={tag === c} className={'chip' + (tag === c ? ' on' : '')} onClick={() => setTag(c)}>{t(c)}</button>
          ))}
          <span className="count" style={{ margin: '0 0 0 auto' }}>{list.length} {t('photos')}</span>
        </div>
      </section>
      <div className="ios">
        {list.map(([f, cap], i) => (
          <button key={f} className="ios-cell" onClick={() => setLb(i)} aria-label={t('Open {cap}', { cap: t(cap) })}>
            <motion.img layoutId={'g-' + f} src={img(f)} alt={t(cap)} loading="lazy" transition={{ type: 'spring', stiffness: 260, damping: 32 }} />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lb !== null && list[lb] && (
          <motion.div className="lb ios-lb" role="dialog" aria-modal="true" aria-label={t('Photo viewer')} initial={{ backgroundColor: 'rgba(0,0,0,0)' }} animate={{ backgroundColor: 'rgba(0,0,0,1)' }} exit={{ backgroundColor: 'rgba(0,0,0,0)' }} onClick={() => setLb(null)}>
            <div className="lb-bar" onClick={(e) => e.stopPropagation()}>
              <button className="lb-done" onClick={() => setLb(null)}>{t('Done')}</button>
              <span>{t('{n} of {total}', { n: lb + 1, total: list.length })}</span>
              <span style={{ width: 52 }} />
            </div>
            <motion.div className="lb-stage" drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.5} onDragEnd={(_, i) => { if (i.offset.x < -80) step(1); else if (i.offset.x > 80) step(-1) }} onClick={(e) => e.stopPropagation()}>
              <motion.img layoutId={'g-' + list[lb][0]} key={list[lb][0]} src={img(list[lb][0])} alt={t(list[lb][1])} transition={{ type: 'spring', stiffness: 260, damping: 32 }} draggable={false} />
            </motion.div>
            <p className="lb-cap" onClick={(e) => e.stopPropagation()}>{t(list[lb][1])}</p>
            <button className="lb-n prev ic" aria-label={t('Previous')} onClick={(e) => { e.stopPropagation(); step(-1) }}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button>
            <button className="lb-n next ic" aria-label={t('Next')} onClick={(e) => { e.stopPropagation(); step(1) }}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
