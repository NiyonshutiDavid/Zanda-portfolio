import { useEffect, useRef } from 'react'

const FINE = '(hover:hover) and (pointer:fine)'
// Anywhere you can click or type, the normal pointer comes back.
const NATIVE = 'a,button,[role="button"],[role="tab"],[role="radio"],summary,label,input,textarea,select,[contenteditable="true"],.hit,.cat,.pay,header,nav,.ck,.cart,.drawer,.chat,.chat-win'
const ZOOM = 2.2
const LENS = 150

// A bordered circle that trails the mouse. Over a plain picture it becomes a magnifier.
export default function Cursor() {
  const el = useRef(null)

  useEffect(() => {
    if (!window.matchMedia(FINE).matches) return
    const dot = el.current
    const root = document.documentElement
    root.classList.add('has-cursor')
    const to = { x: -100, y: -100 }, at = { x: -100, y: -100 }
    let raf = 0, seen = false, lens = null, native = false
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const paint = () => {
      if (!lens) return
      const { img, r, s, ox, oy, dw, dh } = lens
      const px = to.x - r.left, py = to.y - r.top
      // Point under the mouse in the picture's own pixels, scaled up and centred in the lens.
      const bx = -((px - ox) * ZOOM - LENS / 2), by = -((py - oy) * ZOOM - LENS / 2)
      dot.style.backgroundSize = `${dw * ZOOM}px ${dh * ZOOM}px`
      dot.style.backgroundPosition = `${bx}px ${by}px`
      void img; void s
    }
    const tick = () => {
      const k = reduce ? 1 : 0.22
      at.x += (to.x - at.x) * k
      at.y += (to.y - at.y) * k
      dot.style.transform = `translate3d(${at.x}px,${at.y}px,0) translate(-50%,-50%)`
      paint()
      raf = requestAnimationFrame(tick)
    }

    const lensFor = (img) => {
      if (!img.naturalWidth || !img.currentSrc) return null
      const r = img.getBoundingClientRect()
      const cs = getComputedStyle(img)
      const fit = cs.objectFit
      let s = r.width / img.naturalWidth
      if (fit === 'cover') s = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight)
      else if (fit === 'contain') s = Math.min(r.width / img.naturalWidth, r.height / img.naturalHeight)
      const dw = img.naturalWidth * s, dh = img.naturalHeight * s
      const [px, py] = cs.objectPosition.split(' ').map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5))
      return { img, r, s, dw, dh, ox: (r.width - dw) * px, oy: (r.height - dh) * py }
    }

    const move = (e) => {
      to.x = e.clientX; to.y = e.clientY
      if (!seen) { seen = true; at.x = to.x; at.y = to.y; dot.classList.add('on') }
      const t = e.target
      native = Boolean(t.closest?.(NATIVE))
      root.classList.toggle('cur-native', native)
      dot.classList.toggle('off', native)
      const img = !native && t.tagName === 'IMG' ? t : null
      if (img) {
        const next = lensFor(img)
        if (next && next.img !== lens?.img) dot.style.backgroundImage = `url("${img.currentSrc}")`
        lens = next
      } else lens = null
      dot.classList.toggle('zoom', Boolean(lens))
      if (!lens) { dot.style.backgroundImage = ''; dot.style.backgroundSize = ''; dot.style.backgroundPosition = '' }
    }
    const down = () => dot.classList.add('press')
    const up = () => dot.classList.remove('press')
    const leave = () => dot.classList.remove('on')
    const enter = () => seen && dot.classList.add('on')

    raf = requestAnimationFrame(tick)
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    root.addEventListener('pointerleave', leave)
    root.addEventListener('pointerenter', enter)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-cursor', 'cur-native')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      root.removeEventListener('pointerleave', leave)
      root.removeEventListener('pointerenter', enter)
    }
  }, [])

  return <div className="cur" ref={el} aria-hidden="true" />
}
