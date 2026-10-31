import { LANGS, useI18n } from '../i18n'

// English, French and Kinyarwanda. The choice is remembered only if the visitor allows display choices.
export default function LangSwitch({ className = '' }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div className={'lang ' + className} role="group" aria-label={t('Language')}>
      {LANGS.map(([code, short, name]) => (
        <button key={code} type="button" lang={code} aria-pressed={lang === code} title={name} aria-label={name} className={lang === code ? 'on' : ''} onClick={() => setLang(code)}>{short}</button>
      ))}
    </div>
  )
}
