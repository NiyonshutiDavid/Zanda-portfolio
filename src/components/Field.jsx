import { useT } from '../i18n'

export function Field({ id, label, error, textarea, ...rest }) {
  const t = useT()
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label className={'fld' + (error ? ' bad' : '')} htmlFor={id}>
      <span>{t(label)}</span>
      <Tag id={id} name={id} {...rest} aria-invalid={!!error} />
      {error && <em>{t(error)}</em>}
    </label>
  )
}

export const PHONE_RE = /^(\+?250|0)?7\d{8}$/
export const EMAIL_RE = /^\S+@\S+\.\S+$/
