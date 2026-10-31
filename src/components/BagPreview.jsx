import { useEffect, useRef, useState } from 'react'
import { img } from '../data/store'
import { FONTS, PHOTOS } from './bagDesign'
import { useT } from '../i18n'

const MIN = 3, MAX = 14
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))

// The picture only: the design is moved and resized directly on the bag. Everything else is set in the form.
export default function BagPreview({ text, photoId, design, onDesign }) {
  const t = useT()
  const photo = PHOTOS.find((p) => p.id === photoId)
  const { pos, size, colour, finish, font, logo } = design
  const F = FONTS.find((f) => f[1] === font)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [busy, setBusy] = useState(false)
  const stage = useRef(null)
  const layer = useRef(null)
  const item = useRef(null)
  const mode = useRef(null) // 'move' | 'resize' | 'pan'

  useEffect(() => { setZoom(1); setPan({ x: 0, y: 0 }) }, [photoId])

  const shown = text.trim() || t('Your name')
  const empty = !text.trim() && !logo
  // Long names shrink so they always stay on the bag.
  const eff = Math.min(size, 80 / (Math.max(6, shown.length) * 0.62))
  const dark = (c) => ['#151515', '#14263F', '#134E46'].includes(c)

  const clampPan = (p, z) => {
    const W = stage.current?.clientWidth || 0, H = stage.current?.clientHeight || 0
    return { x: Math.min(0, Math.max(-(z - 1) * W, p.x)), y: Math.min(0, Math.max(-(z - 1) * H, p.y)) }
  }
  const zoomTo = (z, cx, cy) => {
    const nz = clamp(Math.round(z * 100) / 100, 1, 3)
    const W = stage.current?.clientWidth || 0, H = stage.current?.clientHeight || 0
    const ax = cx ?? W / 2, ay = cy ?? H / 2
    setPan((p) => clampPan({ x: ax - ((ax - p.x) / zoom) * nz, y: ay - ((ay - p.y) / zoom) * nz }, nz))
    setZoom(nz)
  }

  const down = (e) => {
    const onItem = e.target.closest('.bp-item')
    const onHandle = e.target.closest('.bp-handle')
    if (e.target.closest('.bp-zoom-ctl')) return
    if (onHandle) {
      const r = item.current.getBoundingClientRect()
      mode.current = { t: 'resize', sx: e.clientX, w: r.width, size }
    } else if (onItem) {
      mode.current = { t: 'move' }
    } else if (zoom > 1) {
      mode.current = { t: 'pan', sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y }
    } else return
    stage.current.setPointerCapture?.(e.pointerId)
    e.preventDefault()
  }
  const move = (e) => {
    const m = mode.current
    if (!m) return
    if (m.t === 'pan') return setPan(clampPan({ x: m.px + (e.clientX - m.sx), y: m.py + (e.clientY - m.sy) }, zoom))
    if (m.t === 'resize') return onDesign({ size: clamp(m.size * ((m.w + (e.clientX - m.sx)) / m.w), MIN, MAX) })
    const r = layer.current.getBoundingClientRect()
    onDesign({ pos: { x: clamp(((e.clientX - r.left) / r.width) * 100, 5, 95), y: clamp(((e.clientY - r.top) / r.height) * 100, 5, 95) } })
  }
  const up = () => { mode.current = null }
  const key = (e) => {
    const step = e.shiftKey ? 5 : 1
    const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key]
    if (d) { e.preventDefault(); return onDesign({ pos: { x: clamp(pos.x + d[0], 5, 95), y: clamp(pos.y + d[1], 5, 95) } }) }
    if (e.key === '+' || e.key === '=') { e.preventDefault(); onDesign({ size: clamp(size + 0.5, MIN, MAX) }) }
    if (e.key === '-' || e.key === '_') { e.preventDefault(); onDesign({ size: clamp(size - 0.5, MIN, MAX) }) }
  }
  const dbl = (e) => {
    if (e.target.closest('.bp-item')) return
    const r = stage.current.getBoundingClientRect()
    if (zoom > 1) { setZoom(1); setPan({ x: 0, y: 0 }) } else zoomTo(2.4, e.clientX - r.left, e.clientY - r.top)
  }
  useEffect(() => {
    const el = stage.current
    const wheel = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return
      e.preventDefault()
      const r = el.getBoundingClientRect()
      zoomTo(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), e.clientX - r.left, e.clientY - r.top)
    }
    el.addEventListener('wheel', wheel, { passive: false })
    return () => el.removeEventListener('wheel', wheel)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoom, pan])

  // Draw the same design onto a canvas so it can be saved and sent to the team.
  const save = async () => {
    setBusy(true)
    try {
      const W = 800, H = 1000
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H
      const ctx = cv.getContext('2d')
      const base = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = img(photo.src) })
      ctx.drawImage(base, 0, 0, W, H)
      try { await document.fonts.load(`${F[3]} ${F[4]} 40px ${F[2]}`) } catch { /* use fallback */ }
      ctx.save()
      ctx.translate((pos.x / 100) * W, (pos.y / 100) * H)
      let y = 0
      if (logo) {
        const li = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = logo })
        const lw = size * 5 * (W / 100), lh = (li.height / li.width) * lw
        ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 3; ctx.shadowOffsetY = 1.5
        if (finish === 'print') ctx.globalCompositeOperation = 'multiply'
        ctx.drawImage(li, -lw / 2, -lh / 2 - (text.trim() ? size * 4 : 0), lw, lh)
        ctx.globalCompositeOperation = 'source-over'; ctx.shadowColor = 'transparent'
        y = lh / 2 + size * 4
      }
      if (text.trim()) {
        ctx.font = `${F[4]} ${F[3]} ${eff * (W / 100)}px ${F[2]}`
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
        const tx = F[5] ? text.toUpperCase() : text
        if (finish === 'embroidery') {
          ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillText(tx, 0, y - 1.5)
          ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillText(tx, 0, y + 1.5)
          ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2
        } else if (!photo.dark && dark(colour)) ctx.globalCompositeOperation = 'multiply'
        ctx.fillStyle = colour; ctx.fillText(tx, 0, y)
      }
      ctx.restore()
      const a = document.createElement('a')
      a.download = `zanda-branded-${photo.id}.png`
      a.href = cv.toDataURL('image/png')
      a.click()
    } finally { setBusy(false) }
  }

  return (
    <div className="bp bp-only">
      <div className={'bp-stage' + (zoom > 1 ? ' zoomed' : '')} ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onDoubleClick={dbl}>
        <div className="bp-zl" ref={layer} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
          <img src={img(photo.src)} alt={t(photo.label)} draggable={false} />
          <div
            ref={item}
            className={'bp-item ' + finish + (empty ? ' ghost' : '') + (!photo.dark && finish === 'print' && dark(colour) ? ' mult' : '')}
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, '--c': colour, '--sz': eff, '--ff': F[2], '--fw': F[3], '--fs': F[4], textTransform: F[5] ? 'uppercase' : 'none', transform: 'translate(-50%,-50%)' }}
            tabIndex={0}
            role="group"
            aria-label={t('Your design on the bag. Drag to move it, drag the corner to resize. Arrow keys move it, plus and minus resize it.')}
            onKeyDown={key}
          >
            {logo && <img className="bp-logo" src={logo} alt="" draggable={false} style={{ width: `calc(${size * 5} * 1cqw)` }} />}
            {(text.trim() || !logo) && <span className="bp-text">{shown}</span>}
            <span className="bp-handle" aria-hidden="true" />
          </div>
        </div>
        <div className="bp-zoom-ctl" role="group" aria-label={t('Zoom')}>
          <button type="button" aria-label={t('Zoom out')} disabled={zoom <= 1} onClick={() => zoomTo(zoom - 0.4)}>−</button>
          <button type="button" className="lvl" aria-label={t('Reset zoom')} disabled={zoom === 1} onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }) }}>{zoom.toFixed(1)}×</button>
          <button type="button" aria-label={t('Zoom in')} disabled={zoom >= 3} onClick={() => zoomTo(zoom + 0.4)}>+</button>
        </div>
        <button type="button" className="bp-save" onClick={save} disabled={busy} aria-label={t('Save preview as an image')}>{busy ? t('Saving') : t('Save image')} <i aria-hidden="true">↓</i></button>
      </div>
      <p className="bp-cap">{t('Drag to move. Drag the corner to resize.')}</p>
    </div>
  )
}
