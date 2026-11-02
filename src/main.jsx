import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { I18nProvider } from './i18n'
import '@fontsource-variable/jost/index.css'
import '@fontsource-variable/manrope/index.css'
import '@fontsource-variable/fraunces/wght-italic.css'
import { waitForFonts } from './lib/fonts'
import './base.css'
import './hero-about.css'

// The first render waits for the fonts (at most 2.5 s), so no text is drawn in a stand-in font and then switched.
waitForFonts().then(() => createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
))
