import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { PRODUCTS } from '../data/store'

const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }) {
  const [lines, setLines] = useState([])
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState('')

  const add = useCallback((id, q = 1) => {
    setLines((ls) => (ls.some((l) => l.id === id) ? ls.map((l) => (l.id === id ? { ...l, q: l.q + q } : l)) : [...ls, { id, q }]))
    setToast('Added to your bag')
    clearTimeout(add.t)
    add.t = setTimeout(() => setToast(''), 2200)
  }, [])
  const remove = useCallback((id) => setLines((ls) => ls.filter((l) => l.id !== id)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, p: PRODUCTS.find((p) => p.id === l.id) }))
    return {
      items,
      count: lines.reduce((a, l) => a + l.q, 0),
      total: items.reduce((a, l) => a + l.q * l.p.price, 0),
      add, remove, clear, open, setOpen, toast,
    }
  }, [lines, open, toast, add, remove, clear])

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>
}
