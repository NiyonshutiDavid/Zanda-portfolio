import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getLang, setLang as keepLang } from '../lib/consent'

export const LANGS = [['en', 'EN', 'English'], ['fr', 'FR', 'Français'], ['rw', 'RW', 'Kinyarwanda']]
const CODES = LANGS.map((l) => l[0])

// Every file in ./dict exports { fr: {...}, rw: {...} } keyed by the English text.
const DICT = { fr: {}, rw: {} }
for (const m of Object.values(import.meta.glob('./dict/*.js', { eager: true }))) {
  for (const l of ['fr', 'rw']) Object.assign(DICT[l], m.default?.[l])
}

const initial = () => {
  const q = new URLSearchParams(window.location.search).get('lang')
  if (CODES.includes(q)) return q
  const saved = getLang()
  if (CODES.includes(saved)) return saved
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase()
  return nav === 'fr' ? 'fr' : nav === 'rw' ? 'rw' : 'en'
}

const Ctx = createContext({ lang: 'en', setLang: () => {}, t: (s) => s })

export function I18nProvider({ children }) {
  const [lang, set] = useState(initial)
  useEffect(() => {
    document.documentElement.lang = lang
    keepLang(lang)
    const again = () => keepLang(lang)
    window.addEventListener('zanda:consent', again)
    return () => window.removeEventListener('zanda:consent', again)
  }, [lang])

  // t('Hello {name}', { name }) falls back to the English text when a translation is missing.
  const t = useCallback((s, vars) => {
    if (typeof s !== 'string') return s
    let out = lang === 'en' ? s : DICT[lang][s] ?? s
    if (vars) out = out.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m))
    return out
  }, [lang])

  const value = useMemo(() => ({ lang, setLang: set, t }), [lang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
export const useT = () => useContext(Ctx).t
// Locale for dates and numbers.
export const LOCALE = { en: 'en-GB', fr: 'fr-FR', rw: 'en-GB' }
