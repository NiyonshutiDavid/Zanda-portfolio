// Shared by the branded-bags form and the preview, so the form and the picture always agree.
// One entry per bag style (a colour or shape inside a collection), with the spot on its photo where a name or logo sits well.
export const PHOTOS = [
  { id: 'lumina-cream', col: 'Lumina', name: 'Cream', bag: 'Tote bag', label: 'Lumina cream tote', src: 'pv-lumina-cream.jpg', x: 48, y: 64, dark: false },
  { id: 'lumina-cocoa', col: 'Lumina', name: 'Cocoa', bag: 'Tote bag', label: 'Lumina cocoa tote', src: 'pv-lumina-cocoa.jpg', x: 48, y: 68, dark: true },
  { id: 'kamo-olive', col: 'Kamo', name: 'Olive', bag: 'Backpack', label: 'Kamo olive backpack', src: 'pv-kamo-olive.jpg', x: 46, y: 60, dark: true },
  { id: 'kamo-tan', col: 'Kamo', name: 'Tan', bag: 'Backpack', label: 'Kamo tan backpack', src: 'pv-kamo-tan.jpg', x: 47, y: 72, dark: false },
  { id: 'mwanago-lilac', col: 'MwanaGo', name: 'Lilac', bag: 'Backpack', label: 'MwanaGo lilac backpack', src: 'pv-mwanago-lilac.jpg', x: 49, y: 42, dark: false },
  { id: 'mwanago-bunny', col: 'MwanaGo', name: 'Bunny print', bag: 'Backpack', label: 'MwanaGo bunny-print backpack', src: 'pv-mwanago-bunny.jpg', x: 33, y: 40, dark: true },
]

// A shop product opens the form on its own style.
export const PRODUCT_STYLE = {
  'lumina-cream': 'lumina-cream', 'lumina-cocoa': 'lumina-cocoa', 'lumina-shoulder': 'lumina-cream', 'lumina-weekender': 'lumina-cocoa', 'lumina-duo': 'lumina-cream', 'lumina-message': 'lumina-cream',
  'kamo-olive': 'kamo-olive', 'kamo-olive-laptop': 'kamo-olive', 'kamo-tan': 'kamo-tan', 'kamo-tan-laptop': 'kamo-tan',
  'mwana-lilac': 'mwanago-lilac', 'mwana-bunny': 'mwanago-bunny',
  
}

export const COLOURS = [['Ivory', '#F7F3EC'], ['Gold', '#BCA879'], ['Navy', '#14263F'], ['Black', '#151515'], ['Forest', '#134E46'], ['Clay', '#BF7D3A']]

// [label, key, css family, weight, style, uppercase]
export const FONTS = [
  ['Caps', 'display', '"Jost", "Century Gothic", sans-serif', 500, 'normal', true],
  ['Script', 'serif', '"Fraunces", Georgia, serif', 400, 'italic', false],
  ['Bold', 'body', '"Manrope", system-ui, sans-serif', 800, 'normal', false],
]

// Ivory on dark bags and navy on light bags, unless the visitor chose another colour.
export const defaultColour = (c, photo) => (['#F7F3EC', '#14263F'].includes(c) ? (photo.dark ? '#F7F3EC' : '#14263F') : c)
