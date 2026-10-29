// What the visitor allows us to keep on this device. Nothing optional is stored until they say yes.
const KEY = 'zanda-consent'
const SHIP = 'zanda-shipping'
const THEME = 'zanda-theme'

export const read = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}
export const allowed = (k) => Boolean(read()?.[k])

export function save(choice) {
  const c = { details: Boolean(choice.details), prefs: Boolean(choice.prefs), at: Date.now() }
  try {
    localStorage.setItem(KEY, JSON.stringify(c))
    if (!c.details) localStorage.removeItem(SHIP)
    if (!c.prefs) localStorage.removeItem(THEME)
  } catch { /* storage blocked */ }
  window.dispatchEvent(new Event('zanda:consent'))
  return c
}

export const openSettings = () => window.dispatchEvent(new Event('zanda:cookies'))

export function getShipping() {
  if (!allowed('details')) return null
  try { return JSON.parse(localStorage.getItem(SHIP)) } catch { return null }
}
export function setShipping(v) {
  try {
    if (allowed('details')) localStorage.setItem(SHIP, JSON.stringify(v))
  } catch { /* storage blocked */ }
}
export function forgetShipping() {
  try { localStorage.removeItem(SHIP) } catch { /* storage blocked */ }
}
export function setTheme(t) {
  try {
    if (allowed('prefs')) localStorage.setItem(THEME, t)
  } catch { /* storage blocked */ }
}
export function getTheme() {
  try { return allowed('prefs') ? localStorage.getItem(THEME) : null } catch { return null }
}

// Anything left from before the visitor made a choice is cleared.
if (!read()) { try { localStorage.removeItem(THEME); localStorage.removeItem(SHIP) } catch { /* storage blocked */ } }
