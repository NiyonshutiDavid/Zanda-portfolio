import { useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import { CartDrawer, Footer } from './components/Chrome'
import Cookies from './components/Cookies'
import Cursor from './components/Cursor'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import About from './pages/About'
import Checkout from './pages/Checkout'
import Donate from './pages/Donate'
import Contact from './pages/Contact'
import Curtain from './components/Curtain'
import Chat, { BackToTop } from './components/Chat'
import Services from './pages/Services'
import Book from './pages/Book'
import Branded from './pages/Branded'
import Training from './pages/Training'
import { News, Events, Gallery } from './pages/NewsEvents'

function Page({ children }) {
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.6, ease: [0.22, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.main>
  )
}

export default function App() {
  const location = useLocation()
  const prev = useRef({ path: location.pathname, search: location.search })
  useEffect(() => { if ('scrollRestoration' in history) history.scrollRestoration = 'manual' }, [])
  // Every navigation starts at the top. Choosing a filter (which only changes the query) glides back to the top too.
  useEffect(() => {
    const was = prev.current
    if (was.path !== location.pathname) window.scrollTo({ top: 0, behavior: 'instant' })
    else if (was.search !== location.search) window.scrollTo({ top: 0, behavior: 'smooth' })
    prev.current = { path: location.pathname, search: location.search }
  }, [location.pathname, location.search])
  return (
    <CartProvider>
      <div className="shell">
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/shop" element={<Page><Shop /></Page>} />
          <Route path="/product/:id" element={<Page><Product /></Page>} />
          <Route path="/about" element={<Page><About /></Page>} />
          <Route path="/checkout" element={<Page><Checkout /></Page>} />
          <Route path="/donate" element={<Page><Donate /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/services" element={<Page><Services /></Page>} />
          <Route path="/book" element={<Page><Book /></Page>} />
          <Route path="/branded" element={<Page><Branded /></Page>} />
          <Route path="/training" element={<Page><Training /></Page>} />
          <Route path="/news" element={<Page><News /></Page>} />
          <Route path="/events" element={<Page><Events /></Page>} />
          <Route path="/gallery" element={<Page><Gallery /></Page>} />
          <Route path="*" element={<Page><Home /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      </div>
      <CartDrawer />
      <BackToTop />
      <Chat />
      <Cookies />
      <Cursor />
      <Curtain pathname={location.pathname} />
    </CartProvider>
  )
}
