import { Link, useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import { Reveal, Counter } from '../components/Reveal'
import { ScrollWords, Swap } from '../components/TextFx'
import { Categories, Collections, Faq, Marquee, MovingRow } from '../components/Sections'
import { FEATURED, PRODUCTS } from '../data/store'
import Impact from '../components/Impact'
import { Backpack, Dress, Heart, Scissors, SewingMachine, Tote } from '../components/Illus'

const STEPS = [
  ['Learn', 'Trainees begin with pattern drafting and cutting, guided by a Zanda trainer.', Scissors],
  ['Make', 'They sew real orders, from totes to uniforms, and every piece is quality checked.', SewingMachine],
  ['Sell', 'Bags and clothing are sold here, and each sale pays the maker for her work.', Tote],
  ['Give', 'Sales help fund the next cohort, and support continues after graduation.', Heart],
]

export default function Home() {
  const nav = useNavigate()
  const featured = FEATURED.map((id) => PRODUCTS.find((p) => p.id === id))
  return (
    <>
      <Hero />
      <Marquee />

      <section className="sec wrap about-sec">
        <Reveal><div className="eyebrow" style={{ marginBottom: 22 }}>About Zanda Initiative</div></Reveal>
        <ScrollWords
          className="scrolltext about-text"
          text="Young women learn a trade, earn while they learn, and sell what they make."
        />
        <div className="about-row">
          <Reveal className="about-copy">
            <p>Zanda is a Kigali social enterprise that helps abandoned girls and women build an income of their own, through tailoring, digital skills and enterprise. Every bag here is cut, sewn and checked by a trainee.</p>
            <Link to="/about" className="btn line">Our story <span className="arr">→</span></Link>
          </Reveal>
          <Reveal className="stats" delay={0.1}>
            <div className="stat"><Counter to={6} /><span>months of Learn-and-Earn</span></div>
            <div className="stat"><Counter to={2} /><span>young women trained in our pilot</span></div>
            <div className="stat"><Counter to={4} /><span>bag collections, one workshop</span></div>
          </Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head">
          <div><div className="eyebrow">Shop by category</div><h2 className="caps">Carry it. Wear it.</h2></div>
          <button className="btn line" onClick={() => nav('/shop')}>View all <span className="arr">→</span></button>
        </Reveal>
        <Categories />
      </section>

      <section className="sec wrap" id="collections" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head">
          <div><div className="eyebrow">Four bag collections</div><h2 className="caps">Choose your bag</h2></div>
          <p style={{ maxWidth: '38ch', color: 'var(--muted)', margin: 0 }}>Four bag collections, each with its own fabric and shape. Hover or tap a panel to see more.</p>
        </Reveal>
        <Collections />
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head">
          <div><div className="eyebrow">Featured</div><h2 className="caps">Fresh from the workshop</h2></div>
          <button className="btn line" onClick={() => nav('/shop')}>Shop all <span className="arr">→</span></button>
        </Reveal>
        <MovingRow products={featured} />
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head">
          <div><div className="eyebrow">Our services</div><h2 className="caps">Tailored for you</h2></div>
          <p style={{ maxWidth: '40ch', color: 'var(--muted)', margin: 0 }}>Our trainees also sew clothes to your measurements and put your name or logo on our bags.</p>
        </Reveal>
        <div className="duo">
          <Reveal className="duo-card">
            <Dress className="duo-illus" />
            <div><h3 className="caps">Tailoring of clothes</h3><p>School uniforms, corporate clothing and shirts, measured and sewn in our workshop.</p>
              <div className="cta-row"><Link className="btn" to="/book?service=uniform-fitting">Book a fitting <span className="arr">→</span></Link><Link className="btn line" to="/shop?cat=Clothing">See clothing</Link></div></div>
          </Reveal>
          <Reveal className="duo-card alt" delay={0.1}>
            <Backpack className="duo-illus" />
            <div><h3 className="caps">Custom and bulk bags</h3><p>Your name or logo on our totes and backpacks, for gifts, schools, teams and events.</p>
              <div className="cta-row"><Link className="btn gold" to="/branded">Request branded bags <span className="arr">→</span></Link><Link className="btn line" to="/services">All services</Link></div></div>
          </Reveal>
        </div>
      </section>

      <section className="band sec">
        <div className="wrap">
          <Reveal className="sec-head"><div><div className="eyebrow">How it works</div><h2 className="caps">From lesson to line</h2></div></Reveal>
          <div className="steps">
            {STEPS.map(([t, d, Ill], i) => (
              <Reveal key={t} delay={i * 0.08} className="step">
                <div className="no">0{i + 1}</div><Ill className="step-illus" /><h3 className="caps">{t}</h3><p>{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Impact />

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">Good to know</div><h2 className="caps">Questions, answered</h2></div></Reveal>
        <Faq />
      </section>

      <section className="cta wrap" style={{ borderTop: '1px solid var(--line)' }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Ready when you are</div>
          <h2 className="caps"><Swap words={['Carry', 'Wear']} /> something that gives back.</h2>
          <button className="btn" onClick={() => nav('/shop')}>Start shopping <span className="arr">→</span></button>
        </Reveal>
      </section>
    </>
  )
}
