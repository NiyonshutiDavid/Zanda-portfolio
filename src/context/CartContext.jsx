import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { useContent } from '../lib/content'

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }) {
  const { lookup } = useContent()
  const [lines, setLines] = useState([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')

  const add = useCallback((id, q = 1) => {
    // The product is kept with the line, so the bag still shows it if the shop list changes underneath it.
    const p = lookup(id)
    setLines((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, q: l.q + q } : l)) : [...ls, { id, q, p }]))
    setToast('Added to your bag')
    clearTimeout(add.t)
    add.t = setTimeout(() => setToast(''), 2200)
  }, [lookup])
  const remove = useCallback((id) => setLines((ls) => ls.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, p: lookup(l.id) || l.p })).filter((l) => l.p)
    return {
      items,
      count: items.reduce((a, l) => a + l.q, 0),
      total: items.reduce((a, l) => a + l.q * l.p.price, 0),
      add, remove, clear, open, setOpen, toast,
    }
  }, [lines, open, toast, add, remove, clear, lookup])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}
