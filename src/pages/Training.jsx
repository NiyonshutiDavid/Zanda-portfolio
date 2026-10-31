import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { PageTitle } from './Services'
import { MODULES, OUTCOMES, PROGRAMS } from '../data/store'
import Impact from '../components/Impact'
import { useT } from '../i18n'

const AFTER = [
  ['Business incubation', 'Support for graduates to start their own sewing cooperatives or small businesses.'],
  ['Mentorship network', 'Access to business professionals and programme alumni for ongoing guidance.'],
  ['Zanda Digital Platform', 'A bilingual platform for continued learning, progress tracking, mentor communication and online selling.'],
]

export default function Training() {
  const t = useT()
  return (
    <>
      <PageTitle eyebrow="Training" a="Six months to" b="a trade and an income." lead="The Learn-and-Earn Empowerment Programme takes young women from basic stitching to making bags, school uniforms and corporate clothing." />

      <section className="sec wrap">
        <div className="train-facts">
          <Reveal className="tf"><span>{t('Length')}</span><b>{t('6 months')}</b></Reveal>
          <Reveal className="tf" delay={0.06}><span>{t('Who it is for')}</span><b>{t('Girls and women aged 15 to 24')}</b></Reveal>
          <Reveal className="tf" delay={0.12}><span>{t('Where')}</span><b>{t('Gasabo District, Kigali')}</b></Reveal>
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }} id="programmes">
        <Reveal className="sec-head"><div><div className="eyebrow">{t('Our programmes')}</div><h2 className="caps">{t('Learn, earn, and keep growing')}</h2></div></Reveal>
        <div className="progs">
          {PROGRAMS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08} className="prog">
              <div className="prog-top"><span className="prog-dur">{t(p.duration)}</span><span className={'prog-st' + (i === 0 ? ' closed' : '')}>{t(p.status)}</span></div>
              <h3 className="caps">{t(p.name)}</h3>
              <p>{t(p.summary)}</p>
              <dl><dt>{t('Who it is for')}</dt><dd>{t(p.who)}</dd></dl>
              <ul>{p.points.map((x) => <li key={x}>{t(x)}</li>)}</ul>
              <Link className="btn line" to="/contact">{i === 0 ? t('Ask about the next intake') : t('Talk to us')} <span className="arr">→</span></Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">{t('What trainees learn')}</div><h2 className="caps">{t('Four strands, one programme')}</h2></div></Reveal>
        <div className="mods">
          {MODULES.map(([h, d], i) => (
            <Reveal key={h} delay={(i % 2) * 0.08} className="mod"><h3 className="caps">{t(h)}</h3><p>{t(d)}</p></Reveal>
          ))}
        </div>
      </section>

      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <Reveal className="sec-head"><div><div className="eyebrow">{t('After the six months')}</div><h2 className="caps">{t('What graduates take with them')}</h2></div></Reveal>
        <ul className="outs outs-grid">
          {OUTCOMES.map((o, i) => <Reveal as="li" key={o} delay={(i % 2) * 0.05}>{t(o)}</Reveal>)}
        </ul>
      </section>

      <Impact />

      <section className="band sec">
        <div className="wrap">
          <Reveal className="sec-head"><div><div className="eyebrow">{t('Zero Abandonment')}</div><h2 className="caps">{t('Support after graduation')}</h2></div><p style={{ maxWidth: '40ch', margin: 0, color: 'rgba(247,243,236,.75)' }}>{t('Graduation is not the end. Every graduate keeps the support she needs.')}</p></Reveal>
          <div className="steps three">
            {AFTER.map(([h, d], i) => (
              <Reveal key={h} delay={i * 0.08} className="step"><h3 className="caps">{t(h)}</h3><p>{t(d)}</p></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta wrap">
        <Reveal>
          <div className="eyebrow" style={{ marginBottom: 18 }}>{t('Interested in joining?')}</div>
          <h2 className="caps">{t('Applications are closed for now.')}</h2>
          <p style={{ maxWidth: '48ch', margin: '0 auto 28px', color: 'var(--muted)' }}>{t('Tell us you are interested and we will let you know when applications for the next cohort open.')}</p>
          <div className="cta-row" style={{ justifyContent: 'center' }}>
            <Link className="btn" to="/contact">{t('Register interest')} <span className="arr">→</span></Link>
            <Link className="btn line" to="/donate">{t('Fund a trainee')}</Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
