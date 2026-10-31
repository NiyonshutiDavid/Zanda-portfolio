import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { read, save } from '../lib/consent'
import { useT } from '../i18n'

const OPTIONS = [
  ['essential', 'Essential', 'Keeps your bag working while you browse. Always on, and nothing is kept after you close the tab.', true],
  ['details', 'Delivery details', 'Remembers your name, phone, email and address on this device so your next order is faster.'],
  ['prefs', 'Display choices', 'Remembers your language and whether you prefer the light or dark look.'],
]
const ease = [0.22, 0.8, 0.2, 1]

export default function Cookies() {
  const t = useT()
  const [shown, setShown] = useState(() => !read())
  const [manage, setManage] = useState(false)
  const [pick, setPick] = useState(() => ({ details: Boolean(read()?.details), prefs: Boolean(read()?.prefs) }))

  useEffect(() => {
    const open = () => { setPick({ details: Boolean(read()?.details), prefs: Boolean(read()?.prefs) }); setManage(true); setShown(true) }
    window.addEventListener('zanda:cookies', open)
    return () => window.removeEventListener('zanda:cookies', open)
  }, [])

  const done = (c) => { save(c); setShown(false); setManage(false) }

  return (
    <AnimatePresence>
      {shown && (
        <motion.div className={'ck' + (manage ? ' open' : '')} role="dialog" aria-label={t('Cookie choices')} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.5, ease }}>
          {!manage ? (
            <>
              <div className="ck-t">
                <b>{t('You choose what we keep.')}</b>
                <p>{t('We can remember your delivery details and display choices on this device. Nothing optional is saved unless you say yes.')}</p>
              </div>
              <div className="ck-b">
                <button className="btn" onClick={() => done({ details: true, prefs: true })}>{t('Allow all')}</button>
                <button className="btn line" onClick={() => setManage(true)}>{t('Choose')}</button>
                <button className="btn line" onClick={() => done({ details: false, prefs: false })}>{t('Essential only')}</button>
              </div>
            </>
          ) : (
            <>
              <div className="ck-t">
                <b>{t('Cookie choices')}</b>
                <ul>
                  {OPTIONS.map(([k, title, d, locked]) => (
                    <li key={k}>
                      <label>
                        <input type="checkbox" checked={locked ? true : pick[k]} disabled={locked} onChange={(e) => setPick((p) => ({ ...p, [k]: e.target.checked }))} />
                        <span><b>{t(title)}</b><small>{t(d)}</small></span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ck-b">
                <button className="btn" onClick={() => done(pick)}>{t('Save my choices')}</button>
                <button className="btn line" onClick={() => done({ details: true, prefs: true })}>{t('Allow all')}</button>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
