import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// A designed dropdown that replaces the browser's default select.
export default function Select({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [hot, setHot] = useState(0)
  const ref = useRef(null)
  const id = useId()
  const cur = options.find((o) => o.value === value) || options[0]

  useEffect(() => {
    if (!open) return
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', off)
    document.addEventListener('touchstart', off)
    return () => { document.removeEventListener('mousedown', off); document.removeEventListener('touchstart', off) }
  }, [open])

  const pick = (o) => { onChange(o.value); setOpen(false) }
  const onKey = (e) => {
    if (e.key === 'Escape') return setOpen(false)
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) { setHot(options.indexOf(cur)); return setOpen(true) }
      setHot((h) => (h + (e.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
    }
    if ((e.key === 'Enter' || e.key === ' ') && open) { e.preventDefault(); pick(options[hot]) }
  }

  return (
    <div className="dsel" ref={ref} onKeyDown={onKey}>
      {label && <span className="dsel-label" id={id}>{label}</span>}
      <button type="button" className={'dsel-btn' + (open ? ' open' : '')} aria-haspopup="listbox" aria-expanded={open} aria-labelledby={label ? id : undefined} onClick={() => { setHot(options.indexOf(cur)); setOpen((o) => !o) }}>
        <span>{cur.label}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul className="dsel-list" role="listbox" tabIndex={-1} initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.22, ease: [0.22, 0.8, 0.2, 1] }}>
            {options.map((o, i) => (
              <li key={o.value} role="option" aria-selected={o.value === value} className={(o.value === value ? 'sel ' : '') + (i === hot ? 'hot' : '')} onMouseEnter={() => setHot(i)} onClick={() => pick(o)}>
                <span>{o.label}</span>
                {o.value === value && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
