import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { Reveal, Counter } from '../components/Reveal'
import { Marquee } from '../components/Sections'
import { Line } from '../components/Hero'
import { ScrollWords, Mark } from '../components/TextFx'
import { TEAM, img } from '../data/store'

const ease = [0.22, 0.8, 0.2, 1]

const VALUES = [
  ['Economic empowerment', 'Practical skills that lead to income straight away, through Learn-and-Earn, and on to employment or a business of her own.'],
  ['Social reintegration', 'A safe, stigma-free community that restores dignity and confidence, and helps young women be welcomed back into their families and society.'],
  ['Continuous support', 'Tailoring, digital and business skills together, and a Zero Abandonment promise of incubation and mentorship after graduation.'],
]

const TIMELINE = [
  ['2025', 'Registered', 'On 12 August 2025, Zanda Initiative Ltd is registered in Rwanda, so we can work with partners, schools and companies.'],
  ['2025', 'The pilot', 'Our first trainees learn in the workshop, and the first bags and uniforms they make reach real customers.'],
  ['Next', 'A workshop of our own', 'We are building a dedicated workshop and preparing larger cohorts of trainees.'],
  ['Always', 'Zero Abandonment', 'Graduates keep their mentors, their network and a place to keep learning.'],
]

const initials = (n) => n.split(' ').map((w) => w[0]).slice(0, 2).join('')

function TitleLine({ text, delay }) {
  return (
    <span className="ln"><motion.span initial={{ y: '108%' }} animate={{ y: 0 }} transition={{ duration: 1, delay, ease }}>{text}</motion.span></span>
  )
}

export default function About() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const py = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40])

  return (
    <>
      <section className="hero about-full" aria-label="About Zanda Initiative">
        <div className="slides" aria-hidden="true">
          <div className="slide">
            <motion.img src={`${import.meta.env.BASE_URL}img/team.jpg`} alt="" initial={{ scale: reduce ? 1.02 : 1.12 }} animate={{ scale: 1.02 }} transition={{ duration: 9, ease: 'easeOut' }} />
          </div>
        </div>
        <div className="hero-shade" />
        <div className="wrap hero-in">
          <div className="hero-bottom">
            <div className="hero-text">
              <motion.div className="eyebrow" style={{ color: 'var(--gold)' }} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease }}>About us</motion.div>
              <h1 className="caps" style={{ '--fit': `calc(var(--avail) / ${(17 * 0.66).toFixed(1)})` }} aria-label="Where skills meet a second chance">
                <Line text="Where skills meet" delay={0.05} reduce={reduce} />
                <Line text="a second chance." delay={0.3} reduce={reduce} />
              </h1>
              <motion.p className="about-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
                A Kigali social enterprise that helps abandoned girls and women earn their independence through tailoring, digital skills and entrepreneurship.
              </motion.p>
              <div className="cta-row">
                <button className="btn gold" onClick={() => document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })}>Our story <span className="arr">→</span></button>
                <button className="btn line" onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}>Meet the team</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Marquee words={['Economic empowerment', 'Social reintegration', 'Continuous support', 'Learn and earn', 'Zero abandonment']} />

      <section className="sec wrap">
        <ScrollWords
          className="scrolltext about-text"
          text="A trade, an income and support for life, for girls and women left behind."
        />
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }} ref={ref} id="story">
        <div className="story">
          <div className="story-img">
            <motion.img style={{ y: py }} src={img('cutting-fabric.jpg')} alt="A trainee cutting fabric in the Zanda workshop" />
          </div>
          <div className="story-copy">
            <Reveal><div className="eyebrow" style={{ marginBottom: 16 }}>Our story</div></Reveal>
            <Reveal delay={0.06}><h2 className="caps" style={{ fontSize: 'clamp(34px,5vw,72px)', margin: '0 0 24px' }}>Skills and income, <Mark>from day one.</Mark></h2></Reveal>
            <Reveal delay={0.12}><p>Many abandoned girls and women in Rwanda face family rejection, exclusion from school and social stigma. Too often they are left without skills or an income.</p></Reveal>
            <Reveal delay={0.16}><p>Zanda Initiative was created to change that. Our six-month programme brings together tailoring, digital skills and entrepreneurship. Through Learn-and-Earn, trainees work on real customer orders from the start, so they earn and build confidence while they learn.</p></Reveal>
            <Reveal delay={0.2}><p>Our promise is <b>Zero Abandonment</b>: support does not end at graduation. Graduates can count on business incubation, mentorship and continued learning.</p></Reveal>
          </div>
        </div>
        <div className="astats">
          <Reveal className="astat"><Counter to={6} /><span>months of Learn-and-Earn</span></Reveal>
          <Reveal className="astat" delay={0.06}><span className="range"><b>15</b>–<b>24</b></span><span>age range we serve</span></Reveal>
          <Reveal className="astat" delay={0.12}><Counter to={2025} /><span>registered in Rwanda</span></Reveal>
          <Reveal className="astat" delay={0.18}><Counter to={2} /><span>young women trained in our pilot</span></Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <div className="mv">
          <Reveal className="mv-card"><div className="eyebrow">Our mission</div><p className="caps">Break the cycle of poverty.</p><span>To break the cycle of poverty for abandoned girls and women in Rwanda by providing them with integrated vocational, digital and business skills.</span></Reveal>
          <Reveal className="mv-card alt" delay={0.1}><div className="eyebrow" style={{ color: 'var(--gold)' }}>Our vision</div><p className="caps">Skilled, confident, independent.</p><span>To become a leading, trusted empowerment centre in Rwanda, known for helping marginalised young women become skilled, confident and financially independent, so they can support their families and communities.</span></Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">What we stand for</div><h2 className="caps">A triple promise</h2></div></Reveal>
        <div className="values">
          {VALUES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.08} className="value"><h3 className="caps">{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }} id="team">
        <Reveal className="sec-head"><div><div className="eyebrow">Our team</div><h2 className="caps">The people behind it</h2></div></Reveal>
        <div className="tgrid">
          {TEAM.map(([n, r], i) => (
            <Reveal key={n} delay={(i % 3) * 0.07} className="tcard">
              <div className="av" aria-hidden="true">{initials(n)}</div><div className="tinfo"><h3>{n}</h3><span>{r}</span></div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="band sec">
        <div className="wrap tl-wrap">
          <div className="tl-head">
            <Reveal><div className="eyebrow">Our journey</div><h2 className="caps" style={{ fontSize: 'clamp(38px,5.6vw,88px)', margin: '8px 0 0' }}>Where we are</h2></Reveal>
          </div>
          <ol className="tl">
            {TIMELINE.map(([d, t, text], i) => (
              <Reveal as="li" key={t} delay={i * 0.05}><b>{d}</b><div><h3 className="caps">{t}</h3><span>{text}</span></div></Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="cta wrap" style={{ borderTop: '1px solid var(--line)' }}>
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Be part of it</div>
          <h2 className="caps">Bags and clothes that give back.</h2>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/shop">Shop the collections <span className="arr">→</span></Link>
            <Link className="btn line" to="/donate">Donate</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
