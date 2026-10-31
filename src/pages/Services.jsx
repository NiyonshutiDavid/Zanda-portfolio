import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { SERVICES, MAKES, img } from '../data/store'
import { Dress, Tote, Backpack, Scissors } from '../components/Illus'
import { useT } from '../i18n'

const ease = [0.22, 0.8, 0.2, 1]
const STEPS = [
  ['Measure', 'We take your measurements, or your whole class or team, at the workshop.'],
  ['Design', 'Choose fabric, style, colours and any branding with our team.'],
  ['Sew', 'Trainees cut and sew your order, checked by a trainer at every stage.'],
  ['Deliver', 'We confirm a delivery date with you and bring it to your door.'],
]

export function PageTitle({ eyebrow, a: a0, b: b0, lead: lead0 }) {
  const t = useT()
  const a = t(a0), b = t(b0), lead = lead0 && t(lead0)
  // Size the title so its longest line always fits the screen width.
  const fit = { '--fs': `min(128px, calc((100vw - 2 * var(--pad)) / ${(Math.max(a.length, b.length) * 0.66).toFixed(1)}))` }
  return (
    <section className="about-hero band">
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 22 }}>{t(eyebrow)}</div>
        <h1 className="caps ah-title" style={fit} aria-label={`${a} ${b}`}>
          <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, ease }}>{a}</motion.span></span>
          <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.1, ease }}>{b}</motion.span></span>
        </h1>
        {lead && <motion.p className="ah-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.8 }}>{lead}</motion.p>}
      </div>
    </section>
  )
}

export default function Services() {
  const t = useT()
  return (
    <>
      <PageTitle eyebrow="Services" a="Made to measure," b="made by trainees." lead="Uniforms, clothing and custom bags, sewn in our Kigali workshop by young women learning a trade." />

      <section className="sec wrap">
        <div className="duo">
          <Reveal className="duo-card"><Dress className="duo-illus" /><div><h3 className="caps">{t('Tailoring of clothes')}</h3><p>{t('Uniforms, corporate clothing and shirts, cut and sewn to your measurements.')}</p><Link className="btn" to="/book?service=uniform-fitting">{t('Book a fitting')} <span className="arr">→</span></Link></div></Reveal>
          <Reveal className="duo-card alt" delay={0.1}><Tote className="duo-illus" /><div><h3 className="caps">{t('Bags we create')}</h3><p>{t('Totes, backpacks and laptop bags, ready-made or made to order with your colours and branding.')}</p><Link className="btn gold" to="/book?service=custom-order">{t('Plan an order')} <span className="arr">→</span></Link></div></Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">{t('What we make')}</div><h2 className="caps">{t('Clothes, bags and more')}</h2></div></Reveal>
        <div className="makes">
          {MAKES.map(({ t: mt, d, f, to }, i) => (
            <Reveal key={mt} delay={i * 0.06}>
              <Link to={to} className={'make' + (f ? '' : ' custom')}>
                <div className="make-img">{f ? <img src={img(f)} alt="" loading="lazy" /> : <Scissors className="make-illus" />}</div>
                <h3 className="caps">{t(mt)}</h3>
                <p>{t(d)}</p>
                <span className="make-go">{f ? t('Find out more') : t('Book to plan it')} <i aria-hidden="true">↗</i></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">{t('Work with us')}</div><h2 className="caps">{t('Ways to work with us')}</h2></div></Reveal>
        <div className="svcs">
          {SERVICES.filter((s) => ['uniform-fitting', 'custom-order'].includes(s.id)).map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.08} className="svc">
              <img src={img(s.img)} alt="" loading="lazy" />
              <div>
                <div className="svc-meta"><span className="chip on">{t(s.mins)}</span><span className="chip">{t(s.when)}</span></div>
                <h3 className="caps">{t(s.name)}</h3>
                <p className="sum">{t(s.summary)}</p>
                <p>{t(s.d)}</p>
                <Link className="btn line" to={`/book?service=${s.id}`}>{t('Book this')} <span className="arr">→</span></Link>
              </div>
            </Reveal>
          ))}
          <Reveal className="svc svc-wide" delay={0.05}>
            <Tote className="svc-illus" />
            <div>
              <div className="svc-meta"><span className="chip on">{t('Ready-made')}</span><span className="chip">{t('Delivered across Rwanda')}</span></div>
              <h3 className="caps">{t('Buy ready-made bags')}</h3>
              <p className="sum">{t('Shop totes, backpacks and laptop bags from our three collections.')}</p>
              <p>{t('Every bag is cut, sewn and checked by a trainee. Add it to your bag, check out, and we deliver.')}</p>
              <Link className="btn" to="/shop">{t('Shop bags')} <span className="arr">→</span></Link>
            </div>
          </Reveal>
          <Reveal className="svc svc-wide alt" delay={0.1}>
            <Backpack className="svc-illus" />
            <div>
              <div className="svc-meta"><span className="chip on">{t('Personal or corporate')}</span><span className="chip">{t('Quote in two days')}</span></div>
              <h3 className="caps">{t('Request branded bags')}</h3>
              <p className="sum">{t('Your name, initials or logo on our bags.')}</p>
              <p>{t('Choose a personal offer for one to nine bags, or a corporate offer for ten or more, and we send you a quote.')}</p>
              <Link className="btn gold" to="/branded">{t('Request branded bags')} <span className="arr">→</span></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band sec">
        <div className="wrap">
          <Reveal className="sec-head"><div><div className="eyebrow">{t('How an order works')}</div><h2 className="caps">{t('From fitting to delivery')}</h2></div></Reveal>
          <div className="steps">
            {STEPS.map(([h, d], i) => (
              <Reveal key={h} delay={i * 0.08} className="step"><div className="no">0{i + 1}</div><h3 className="caps">{t(h)}</h3><p>{t(d)}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta wrap">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>{t('Ordering for a school or company?')}</div>
          <h2 className="caps">{t("Let's plan your order.")}</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/contact">{t('Contact us')} <span className="arr">→</span></Link>
            <Link className="btn line" to="/shop">{t('Shop ready-made bags')}</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
