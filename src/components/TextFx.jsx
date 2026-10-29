import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'

// Types a word, holds, deletes it, then moves to the next one.
export function Typed({ words, speed = 70, hold = 1500 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref)
  const [w, setW] = useState(0)
  const [n, setN] = useState(words[0].length)
  const [del, setDel] = useState(false)

  useEffect(() => {
    if (reduce || !inView) return
    const word = words[w]
    let t
    if (!del && n < word.length) t = setTimeout(() => setN(n + 1), speed)
    else if (!del) t = setTimeout(() => setDel(true), hold)
    else if (n > 0) t = setTimeout(() => setN(n - 1), speed / 2)
    else { setDel(false); setW((w + 1) % words.length) }
    return () => clearTimeout(t)
  }, [n, del, w, words, speed, hold, reduce, inView])

  return (
    <span ref={ref} className="typed" aria-label={words.join(', ')}>
      <span aria-hidden="true">{words[w].slice(0, n)}</span>
      <span className="caret" aria-hidden="true" />
    </span>
  )
}

// A marker stroke that sweeps under the text when it scrolls into view.
export function Mark({ children, delay = 0.5 }) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      className="mark"
      initial={{ backgroundSize: reduce ? '100% 46%' : '0% 46%' }}
      whileInView={{ backgroundSize: '100% 46%' }}
      viewport={{ once: true, margin: '0px 0px -20% 0px' }}
      transition={{ duration: 1.1, delay, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.span>
  )
}

function Word({ w, range, progress }) {
  const o = useTransform(progress, range, [0.16, 1])
  return <motion.span style={{ opacity: o }}>{w}{' '}</motion.span>
}

// Words light up one after another as the paragraph scrolls through the screen.
export function ScrollWords({ text, className }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] })
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Word key={i} w={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 1.5) / words.length)]} />
      ))}
    </p>
  )
}

// A word that keeps swapping with another one, for example Carry and Wear.
export function Swap({ words, every = 2400 }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setI((x) => (x + 1) % words.length), every)
    return () => clearInterval(t)
  }, [words.length, every, reduce])
  const widest = words.reduce((a, b) => (b.length > a.length ? b : a), '')
  return (
    <span className="swap">
      <span className="sr">{words.join(' or ')}</span>
      <span className="swap-size" aria-hidden="true">{widest}</span>
      <AnimatePresence initial={false}>
        <motion.span key={words[i]} className="swap-word" aria-hidden="true" initial={{ y: '105%' }} animate={{ y: 0 }} exit={{ y: '-105%' }} transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}>
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
