// Resolves when the fonts the pages are set in are loaded (or after maxMs, so a blocked font never keeps the site blank).
// main.jsx calls it before the first render: text is drawn once, in its final font, with no switch from a stand-in.
const FACES = [
  ['500 1em "Jost Variable"', 'Aéèêï'],
  ['400 1em "Manrope Variable"', 'Aéèêï'],
  ['700 1em "Manrope Variable"', 'Aéèêï'],
  ['italic 400 1em "Fraunces Variable"', 'Aéèêï'],
]

export function waitForFonts(maxMs = 2500) {
  if (!document.fonts || !document.fonts.load) return Promise.resolve()
  const loaded = Promise.all(FACES.map(([font, sample]) => document.fonts.load(font, sample).catch(() => []))).then(() => undefined)
  const limit = new Promise((resolve) => setTimeout(resolve, maxMs))
  return Promise.race([loaded, limit])
}
