import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// Forest-green curtain with the logo. It covers the screen on first load and on every page change.
export default function Curtain({ pathname }) {
  const reduce = useReducedMotion()
  const first = useRef(true)
  const initial = first.current
  useEffect(() => { first.current = false }, [])
  if (reduce) return null

  return (
    <motion.div
      key={pathname}
      className="curtain"
      aria-hidden="true"
      initial={{ y: initial ? '0%' : '100%' }}
      animate={{ y: initial ? ['0%', '0%', '-100%'] : ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: initial ? 1.3 : 1.15, times: initial ? [0, 0.55, 1] : [0, 0.4, 0.55, 1], ease: 'easeInOut' }}
    >
      <motion.img
        src={`${import.meta.env.BASE_URL}img/logo-white.png`}
        alt=""
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1.04] }}
        transition={{ duration: initial ? 1.3 : 1.15, times: [0, 0.3, 0.6, 0.9] }}
      />
    </motion.div>
  )
}
