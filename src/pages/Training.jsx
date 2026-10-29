import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { PageTitle } from './Services'
import { MODULES, OUTCOMES } from '../data/store'
import Impact from '../components/Impact'

const AFTER = [
  ['Business incubation', 'Support for graduates to start their own sewing cooperatives or small businesses.'],
  ['Mentorship network', 'Access to business professionals and programme alumni for ongoing guidance.'],
  ['Zanda Digital Platform', 'A bilingual platform for continued learning, progress tracking, mentor communication and online selling.'],
]

export default function Training() {
  return (
    <>
      <PageTitle eyebrow="Training" a="Six months to" b="a trade and an income." lead="The Learn-and-Earn Empowerment Programme takes young women from basic stitching to making bags, school uniforms and corporate clothing." />

      <section className="sec wrap">
        <div className="train-facts">
          <Reveal className="tf"><span>Length</span><b>6 months</b></Reveal>
          <Reveal className="tf" delay={0.06}><span>Who it is for</span><b>Girls and women aged 15 to 24</b></Reveal>
          <Reveal className="tf" delay={0.12}><span>Where</span><b>Gasabo District, Kigali</b></Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">What trainees learn</div><h2 className="caps">Four strands, one programme</h2></div></Reveal>
        <div className="mods">
          {MODULES.map(([t, d], i) => (
            <Reveal key={t} delay={(i % 2) * 0.08} className="mod"><h3 className="caps">{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">After the six months</div><h2 className="caps">What graduates take with them</h2></div></Reveal>
        <ul className="outs outs-grid">
          {OUTCOMES.map((o, i) => <Reveal as="li" key={o} delay={(i % 2) * 0.05}>{o}</Reveal>)}
        </ul>
      </section>

      <Impact />

      <section className="band sec">
        <div className="wrap">
          <Reveal className="sec-head"><div><div className="eyebrow">Zero Abandonment</div><h2 className="caps">Support after graduation</h2></div><p style={{ maxWidth: '40ch', margin: 0, color: 'rgba(247,243,236,.75)' }}>Graduation is not the end. Every graduate keeps the support she needs.</p></Reveal>
          <div className="steps three">
            {AFTER.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.08} className="step"><h3 className="caps">{t}</h3><p>{d}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta wrap">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Interested in joining?</div>
          <h2 className="caps">Applications are closed for now.</h2>
          <p style={{ maxWidth: '48ch', margin: '0 auto 28px', color: 'var(--muted)' }}>Tell us you are interested and we will let you know when applications for the next cohort open.</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/contact">Register interest <span className="arr">→</span></Link>
            <Link className="btn line" to="/donate">Fund a trainee</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
