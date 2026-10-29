// Standalone API server for production: `ANTHROPIC_API_KEY=... node server/index.mjs`, then proxy /api to it.
import { createServer } from 'node:http'
import { handleChat } from './chat.mjs'

const port = Number(process.env.PORT || 8787)
createServer((req, res) => {
  if (req.url?.startsWith('/api/chat')) return handleChat(req, res)
  res.statusCode = 404
  res.end('Not found')
}).listen(port, () => console.log(`Zanda chat API on http://localhost:${port}/api/chat`))
