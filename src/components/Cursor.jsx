import { useEffect } from 'react'

const FINE = '(hover:hover) and (pointer:fine)'

// Custom pointer in Zanda brand green with khaki/gold border.
// Activates on fine-pointer devices (mouse/trackpad).
export default function Cursor() {
  useEffect(() => {
    if (!window.matchMedia(FINE).matches) return
    const root = document.documentElement
    root.classList.add('has-cursor')
    return () => {
      root.classList.remove('has-cursor')
    }
  }, [])

  return null
}
