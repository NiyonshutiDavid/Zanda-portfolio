import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { handleChat } from './server/chat.mjs'

// Serves POST /api/chat inside the dev and preview servers, so `npm run dev` is all you need.
const chatApi = () => ({
  name: 'zanda-chat-api',
  configureServer: (server) => { server.middlewares.use('/api/chat', handleChat) },
  configurePreviewServer: (server) => { server.middlewares.use('/api/chat', handleChat) },
})

export default defineConfig(({ mode }) => {
  // Server-only secrets from .env or .env.local. They are never sent to the browser.
  // `TUNNEL=1` is for sharing a test link over the internet: the AI key is not loaded (so strangers cannot spend it)
  // unless you also set `TUNNEL_AI=1`, and the tunnel's host name is allowed.
  const tunnel = Boolean(process.env.TUNNEL)
  if (!tunnel || process.env.TUNNEL_AI) {
    const env = loadEnv(mode, process.cwd(), '')
    for (const k of ['ANTHROPIC_API_KEY', 'ANTHROPIC_AUTH_TOKEN', 'ANTHROPIC_BASE_URL', 'CHAT_MODEL']) {
      if (env[k] && !process.env[k]) process.env[k] = env[k]
    }
  }
  const hosts = tunnel ? { allowedHosts: true } : {}
  // `VITE_BASE=/Zanda-portfolio/` is set by the GitHub Pages workflow; local work stays at "/".
  const base = process.env.VITE_BASE || '/'
  return { base, plugins: [react(), chatApi()], server: hosts, preview: hosts }
})
