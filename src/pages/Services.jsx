import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { Reveal } from '../components/Reveal'
import { SERVICES, MAKES, img } from '../data/store'
import { Dress, Tote, Backpack, Scissors } from '../components/Illus'

const ease = [0.22, 0.8, 0.2, 1]
const STEPS = [
  ['Measure', 'We take your measurements, or your whole class or team, at the workshop.'],
  ['Design', 'Choose fabric, style, colours and any branding with our team.'],
  ['Sew', 'Trainees cut and sew your order, checked by a trainer at every stage.'],
  ['Deliver', 'We confirm a delivery date with you and bring it to your door.'],
]

export function PageTitle({ eyebrow, a, b, lead }) {
  // Size the title so its longest line always fits the screen width.
  const fit = { '--fs': `min(128px, calc((100vw - 2 * var(--pad)) / ${(Math.max(a.length, b.length) * 0.66).toFixed(1)}))` }
  return (
    <section className="about-hero band">
      <div className="wrap">
        <div className="eyebrow" style={{ marginBottom: 22 }}>{eyebrow}</div>
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
  return (
    <>
      <PageTitle eyebrow="Services" a="Made to measure," b="made by trainees." lead="Uniforms, clothing and custom bags, sewn in our Kigali workshop by young women learning a trade." />

      <section className="sec wrap">
        <div className="duo">
          <Reveal className="duo-card"><Dress className="duo-illus" /><div><h3 className="caps">Tailoring of clothes</h3><p>Uniforms, corporate clothing and shirts, cut and sewn to your measurements.</p><Link className="btn" to="/book?service=uniform-fitting">Book a fitting <span className="arr">→</span></Link></div></Reveal>
          <Reveal className="duo-card alt" delay={0.1}><Tote className="duo-illus" /><div><h3 className="caps">Bags we create</h3><p>Totes, backpacks and laptop bags, ready-made or made to order with your colours and branding.</p><Link className="btn gold" to="/book?service=custom-order">Plan an order <span className="arr">→</span></Link></div></Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">What we make</div><h2 className="caps">Clothes, bags and more</h2></div></Reveal>
        <div className="makes">
          {MAKES.map(({ t, d, f, to }, i) => (
            <Reveal key={t} delay={i * 0.06}>
              <Link to={to} className={'make' + (f ? '' : ' custom')}>
                <div className="make-img">{f ? <img src={img(f)} alt="" loading="lazy" /> : <Scissors className="make-illus" />}</div>
                <h3 className="caps">{t}</h3>
                <p>{d}</p>
                <span className="make-go">{f ? 'Find out more' : 'Book to plan it'} <i aria-hidden="true">↗</i></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">Work with us</div><h2 className="caps">Ways to work with us</h2></div></Reveal>
        <div className="svcs">
          {SERVICES.filter((s) => ['uniform-fitting', 'custom-order'].includes(s.id)).map((s, i) => (
            <Reveal key={s.id} delay={(i % 2) * 0.08} className="svc">
              <img src={img(s.img)} alt="" loading="lazy" />
              <div>
                <div className="svc-meta"><span className="chip on">{s.mins}</span><span className="chip">{s.when}</span></div>
                <h3 className="caps">{s.name}</h3>
                <p className="sum">{s.summary}</p>
                <p>{s.d}</p>
                <Link className="btn line" to={`/book?service=${s.id}`}>Book this <span className="arr">→</span></Link>
              </div>
            </Reveal>
          ))}
          <Reveal className="svc svc-wide" delay={0.05}>
            <Tote className="svc-illus" />
            <div>
              <div className="svc-meta"><span className="chip on">Ready-made</span><span className="chip">Delivered across Rwanda</span></div>
              <h3 className="caps">Buy ready-made bags</h3>
              <p className="sum">Shop totes, backpacks and laptop bags from our three collections.</p>
              <p>Every bag is cut, sewn and checked by a trainee. Add it to your bag, check out, and we deliver.</p>
              <Link className="btn" to="/shop">Shop bags <span className="arr">→</span></Link>
            </div>
          </Reveal>
          <Reveal className="svc svc-wide alt" delay={0.1}>
            <Backpack className="svc-illus" />
            <div>
              <div className="svc-meta"><span className="chip on">Personal or corporate</span><span className="chip">Quote in two days</span></div>
              <h3 className="caps">Request branded bags</h3>
              <p className="sum">Your name, initials or logo on our bags.</p>
              <p>Choose a personal offer for one to nine bags, or a corporate offer for ten or more, and we send you a quote.</p>
              <Link className="btn gold" to="/branded">Request branded bags <span className="arr">→</span></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="band sec">
        <div className="wrap">
          <Reveal className="sec-head"><div><div className="eyebrow">How an order works</div><h2 className="caps">From fitting to delivery</h2></div></Reveal>
          <div className="steps">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="step"><div className="no">0{i + 1}</div><h3 className="caps">{t}</h3><p>{d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta wrap">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Ordering for a school or company?</div>
          <h2 className="caps">Let's plan your order.</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/contact">Contact us <span className="arr">→</span></Link>
            <Link className="btn line" to="/shop">Shop ready-made bags</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
