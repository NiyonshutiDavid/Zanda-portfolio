// Read-only access to the Zanda backend's public API. Everything here is optional: with no VITE_API_URL
// (static mode) nothing is requested, and every failure ends in a thrown error the caller turns into "use the built-in data".

// Origin of the backend, e.g. https://zandainitiative.org or http://localhost:4000. Empty means static mode.
export const API = String(import.meta.env?.VITE_API_URL ?? '').trim().replace(/\/+$/, '')
export const apiEnabled = API !== ''

const TIMEOUT_MS = 4000

// A media path the API returns (/uploads/... for files staff uploaded, /images/... for files shipped with the real
// website) becomes an absolute URL on the API origin. Full URLs, data: URLs and anything else pass through unchanged.
export function mediaUrl(path) {
  if (typeof path !== 'string' || !path) return ''
  if (/^(https?:)?\/\//i.test(path) || /^(data|blob):/i.test(path)) return path
  if (apiEnabled && (path.startsWith('/uploads/') || path.startsWith('/images/'))) return API + path
  return path
}

// True for a value that is already a usable URL or an API path, so img() must not prefix it with the local image folder.
export const isRemote = (f) => typeof f === 'string' && (/^(https?:)?\/\//i.test(f) || /^(data|blob):/i.test(f) || f.startsWith('/uploads/') || f.startsWith('/images/'))

// GET {API}/api{path}?... as JSON. Public endpoints only: no cookies, no credentials, no custom headers (so the browser
// sends a plain cross-origin request without a preflight). The language goes in the ?lang= query, like the real site's API client.
export async function getJson(path, { query, lang, timeout = TIMEOUT_MS, signal } = {}) {
  if (!apiEnabled) throw new Error('API not configured')
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries({ ...query, lang })) if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  const qs = params.toString()
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), timeout)
  const stop = () => ctl.abort()
  signal?.addEventListener('abort', stop)
  try {
    const res = await fetch(`${API}/api${path}${qs ? `?${qs}` : ''}`, { method: 'GET', headers: { Accept: 'application/json' }, credentials: 'omit', signal: ctl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    if (!(res.headers.get('content-type') || '').includes('json')) throw new Error('Not JSON')
    const text = await res.text()
    try { return JSON.parse(text) } catch { throw new Error('Invalid JSON') }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', stop)
  }
}
