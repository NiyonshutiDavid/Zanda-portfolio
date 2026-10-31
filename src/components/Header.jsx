import { getTheme, setTheme } from '../lib/consent'
import LangSwitch from './LangSwitch'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useCart } from '../context/CartContext'
import { useT } from '../i18n'

const LINKS = [
  ['Home', '/'],
  ['Shop', '/shop'],
  ['Services', '/services'],
  ['Training', '/training'],
  ['News & events', null],
  ['About', '/about'],
  ['Contact', '/contact'],
]
const NEWS_MENU = [['News', '/news'], ['Events', '/events'], ['Gallery', '/gallery']]

const Icon = ({ d }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>
)

export default function Header() {
  const t = useT()
  const { pathname } = useLocation()
  const nav = useNavigate()
  const { count, setOpen } = useCart()
  const [menu, setMenu] = useState(false)
  const [dd, setDd] = useState(false)
  const [y, setY] = useState(0)
  const [dark, setDark] = useState(() => {
    const saved = getTheme(); if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const overHero = (pathname === '/' || pathname === '/about') && y < window.innerHeight * 0.6

  useEffect(() => {
    const on = () => setY(window.scrollY)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMenu(false); setDd(false) }, [pathname])
  useEffect(() => {
    document.documentElement.classList.toggle('ov', overHero)
  }, [overHero])
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    setTheme(dark ? 'dark' : 'light')
    const again = () => setTheme(dark ? 'dark' : 'light')
    window.addEventListener('zanda:consent', again)
    return () => window.removeEventListener('zanda:consent', again)
  }, [dark])

  return (
    <>
      <header className="top">
        <div className="wrap nav">
          <Link className="logo" to="/" aria-label={t('Zanda Initiative home')}>
            <img className="b" src={`${import.meta.env.BASE_URL}img/logo.png`} alt={t('Zanda Initiative')} />
            <img className="w" src={`${import.meta.env.BASE_URL}img/logo-white.png`} alt="" />
          </Link>
          <nav className="links" aria-label={t('Main')}>
            {LINKS.map(([label, to]) =>
              to ? (
                <NavLink key={label} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{t(label)}</NavLink>
              ) : (
                <div
                  key={label}
                  className={'dd' + (dd ? ' open' : '') + (NEWS_MENU.some(([, p]) => p === pathname) ? ' cur' : '')}
                  onMouseEnter={() => setDd(true)}
                  onMouseLeave={() => setDd(false)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setDd(false) }}
                  onKeyDown={(e) => e.key === 'Escape' && setDd(false)}
                >
                  <button aria-haspopup="true" aria-expanded={dd} onClick={() => setDd((v) => !v)}>
                    {t(label)} <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  <div className="dd-panel" role="menu">
                    {NEWS_MENU.map(([n, path]) => (
                      <Link key={n} to={path} role="menuitem" onClick={() => setDd(false)}>{t(n)}</Link>
                    ))}
                  </div>
                </div>
              ),
            )}
          </nav>
          <div className="tools">
            <LangSwitch className="in-bar" />
            <Link className="btn gold nav-donate" to="/donate">{t('Donate')}</Link>
            <button className="ic theme" aria-label={dark ? t('Dark mode is on. Switch to light mode') : t('Light mode is on. Switch to dark mode')} title={dark ? t('Dark mode') : t('Light mode')} aria-pressed={dark} onClick={() => setDark((d) => !d)}>
              <span key={dark ? 'moon' : 'sun'} className="theme-ic">
                {dark ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" /></svg>
                )}
              </span>
            </button>
            <button className="ic" aria-label={t('Open cart')} onClick={() => setOpen(true)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11H6.2z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              <motion.span key={count} className="badge" initial={{ scale: 1.6 }} animate={{ scale: 1 }}>{count}</motion.span>
            </button>
            <button className="ic burger" aria-label={t('Open menu')} onClick={() => setMenu(true)}>
              <Icon d="M4 8h16M4 16h16" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="menu open"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}
          >
            <div className="menu-top">
              <img src={`${import.meta.env.BASE_URL}img/logo-white.png`} alt={t('Zanda Initiative')} style={{ height: 36, width: 'auto' }} />
              <button className="ic" aria-label={t('Close menu')} onClick={() => setMenu(false)} style={{ color: '#F7F3EC', boxShadow: 'inset 0 0 0 1.5px rgba(247,243,236,.4)' }}>
                <Icon d="M5 5l14 14M19 5L5 19" />
              </button>
            </div>
            <div className="big">
              {[['Home', '/'], ['Shop', '/shop'], ['Services', '/services'], ['Training', '/training'], ['News', '/news'], ['Events', '/events'], ['Gallery', '/gallery'], ['About', '/about'], ['Contact', '/contact'], ['Donate', '/donate']].map(([label, to], k) => (
                <motion.button key={label} onClick={() => nav(to)} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + k * 0.05, duration: 0.7, ease: [0.22, 0.8, 0.2, 1] }}>
                  <small>00{k + 1}</small>{t(label)}
                </motion.button>
              ))}
            </div>
            <LangSwitch className="in-menu" />
            <div className="quote" style={{ color: 'var(--gold)', fontSize: 20 }}>{t('Her future, our focus.')}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
