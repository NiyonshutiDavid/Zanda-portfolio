// Line illustrations in the Zanda palette. Stroke follows currentColor; fills use the brand tokens.
const base = { viewBox: '0 0 200 200', fill: 'none', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round', role: 'img' }

function Svg({ title, children, className = '', ...rest }) {
  return (
    <svg {...base} className={'illus ' + className} stroke="currentColor" aria-label={title} {...rest}>
      <title>{title}</title>
      {children}
    </svg>
  )
}

const Blob = ({ fill = 'var(--blush)' }) => (
  <path d="M38 96c-6-34 22-62 58-64 34-2 70 14 74 50 4 38-26 76-66 78-38 2-60-30-66-64z" fill={fill} stroke="none" />
)

export function Tote(props) {
  return (
    <Svg title="A tote bag" {...props}>
      <Blob />
      <path d="M72 82c0-30 12-44 28-44s28 14 28 44" />
      <path d="M52 82h96l8 86a6 6 0 0 1-6 6H50a6 6 0 0 1-6-6z" fill="var(--bg)" />
      <path d="M52 82h96" />
      <rect x="84" y="108" width="32" height="18" rx="3" fill="var(--gold)" />
      <path d="M90 117h20" strokeWidth="2.5" />
      <path d="M58 150h84" strokeDasharray="2 8" strokeWidth="2.5" />
    </Svg>
  )
}

export function Backpack(props) {
  return (
    <Svg title="A backpack" {...props}>
      <Blob fill="var(--bg2)" />
      <path d="M86 52c0-10 6-16 14-16s14 6 14 16" />
      <path d="M62 74c0-14 16-22 38-22s38 8 38 22v88a8 8 0 0 1-8 8H70a8 8 0 0 1-8-8z" fill="var(--bg)" />
      <path d="M62 92c6 10 22 16 38 16s32-6 38-16" fill="var(--gold)" />
      <rect x="76" y="116" width="48" height="36" rx="5" />
      <path d="M92 122v14M108 122v14" />
      <path d="M62 100c-14 6-20 22-18 44M138 100c14 6 20 22 18 44" />
    </Svg>
  )
}

export function Scissors(props) {
  return (
    <Svg title="Scissors" {...props}>
      <Blob fill="var(--blush)" />
      <circle cx="68" cy="140" r="16" fill="var(--bg)" />
      <circle cx="132" cy="140" r="16" fill="var(--bg)" />
      <path d="M78 127L128 48M122 127L72 48" />
      <path d="M128 48l10-10M72 48L62 38" />
      <circle cx="100" cy="88" r="4" fill="var(--clay, #BF7D3A)" stroke="none" />
    </Svg>
  )
}

export function TapeMeasure(props) {
  return (
    <Svg title="A measuring tape" {...props}>
      <Blob fill="var(--bg2)" />
      <circle cx="90" cy="92" r="46" fill="var(--bg)" />
      <circle cx="90" cy="92" r="22" fill="var(--gold)" />
      <circle cx="90" cy="92" r="6" fill="var(--bg)" />
      <path d="M130 124c14 8 30 6 42-2" />
      <path d="M126 134c14 10 36 8 52-4" />
      <path d="M146 123l4 8M156 124l3 9M166 122l3 9" strokeWidth="2.5" />
    </Svg>
  )
}

export function SewingMachine(props) {
  return (
    <Svg title="A sewing machine" {...props}>
      <Blob fill="var(--blush)" />
      <path d="M40 150h124" />
      <path d="M48 150v-20c0-8 6-14 14-14h74c10 0 18-8 18-18V70c0-8-6-14-14-14H92c-8 0-14 6-14 14v14" fill="var(--bg)" />
      <circle cx="150" cy="86" r="14" fill="var(--gold)" />
      <path d="M92 56V40h22" />
      <path d="M100 116v28" />
      <path d="M96 144h8" />
      <circle cx="68" cy="136" r="5" fill="var(--clay, #BF7D3A)" stroke="none" />
    </Svg>
  )
}

export function Thread(props) {
  return (
    <Svg title="A spool of thread and a needle" {...props}>
      <Blob fill="var(--bg2)" />
      <rect x="66" y="52" width="68" height="14" rx="5" fill="var(--bg)" />
      <rect x="66" y="134" width="68" height="14" rx="5" fill="var(--bg)" />
      <rect x="74" y="66" width="52" height="68" fill="var(--clay, #BF7D3A)" />
      <path d="M74 80h52M74 94h52M74 108h52M74 122h52" strokeWidth="2.5" />
      <path d="M126 100c20 4 26 18 22 36" />
      <path d="M156 40l-26 70" />
      <ellipse cx="157" cy="38" rx="2.4" ry="5" transform="rotate(20 157 38)" />
    </Svg>
  )
}

export function Dress(props) {
  return (
    <Svg title="A tailored shirt on a hanger" {...props}>
      <Blob fill="var(--blush)" />
      <path d="M100 44c0-8 6-12 10-12s8 4 8 10-6 8-10 10" />
      <path d="M100 52L50 80l12 22 16-8v66h44V94l16 8 12-22-50-28" fill="var(--bg)" />
      <path d="M100 52v114" strokeDasharray="2 7" strokeWidth="2.5" />
      <path d="M84 62l16 14 16-14" />
      <circle cx="100" cy="100" r="2.4" fill="currentColor" />
      <circle cx="100" cy="124" r="2.4" fill="currentColor" />
    </Svg>
  )
}

export function Heart(props) {
  return (
    <Svg title="A heart stitched with thread" {...props}>
      <Blob fill="var(--bg2)" />
      <path d="M100 150S52 118 52 84c0-18 13-30 28-30 9 0 16 5 20 12 4-7 11-12 20-12 15 0 28 12 28 30 0 34-48 66-48 66z" fill="var(--gold)" />
      <path d="M72 86c6 8 14 12 28 12s22-4 28-12" strokeDasharray="2 7" strokeWidth="2.5" />
    </Svg>
  )
}
