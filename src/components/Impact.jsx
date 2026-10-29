import { useRef } from 'react'
import { Reveal } from './Reveal'
import { Heart } from './Illus'
import { STORIES, img } from '../data/store'

export default function Impact() {
  const rail = useRef(null)
  const go = (d) => rail.current?.scrollBy({ left: d * Math.min(420, rail.current.clientWidth * 0.8), behavior: 'smooth' })
  return (
    <section className="sec impact-sec" id="impact">
      <div className="wrap">
        <Reveal className="sec-head">
          <div><div className="eyebrow">Our impact</div><h2 className="caps">Lives and livelihoods</h2></div>
          <div className="pager dark"><button className="ic" aria-label="Previous stories" onClick={() => go(-1)}><svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6" /></svg></button><button className="ic" aria-label="Next stories" onClick={() => go(1)}><svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" /></svg></button></div>
        </Reveal>
      </div>
      <div className="stories" ref={rail} tabIndex={0} aria-label="Stories">
        {STORIES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08} className={'story-card' + (s.img ? '' : ' empty')}>
            {s.img ? <img src={img(s.img)} alt="" loading="lazy" /> : <Heart className="story-illus" />}
            <div className="sc-body">
              <span className="chip on">{s.kind}</span>
              <h3 className="caps">{s.title}</h3>
              <p>{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
