import { motion, useInView, useReducedMotion, animate } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

// Gentle fade-and-rise as a block scrolls into view. Used sparingly.
export function Reveal({ children, delay = 0, y = 28, as = 'div', className, style }) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </Tag>
  )
}

export function Counter({ to, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const [v, setV] = useState(reduce ? to : 0)
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(0, to, { duration: 1.4, ease: [0.22, 0.8, 0.2, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to, reduce])
  return <b ref={ref}>{v}{suffix}</b>
}
