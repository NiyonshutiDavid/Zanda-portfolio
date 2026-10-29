import { fmt, img } from '../data/store'

const FOREST = [19, 78, 70], DEEP = [7, 51, 44], GOLD = [188, 168, 121], SAND = [247, 243, 236], INK = [28, 38, 34], MUTED = [110, 118, 112]

const load = (src) => new Promise((res) => {
  const i = new Image()
  i.onload = () => res(i)
  i.onerror = () => res(null)
  i.src = src
})

// Branded A4 receipt, built in the browser and saved straight to the device.
export async function downloadReceipt(o) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight()
  const M = 48
  const logo = await load(img('logo-white.png'))

  doc.setFillColor(...FOREST); doc.rect(0, 0, W, 132, 'F')
  doc.setFillColor(...GOLD); doc.rect(0, 132, W, 4, 'F')
  if (logo) doc.addImage(logo, 'PNG', M, 36, 120, (120 * logo.height) / logo.width)
  doc.setTextColor(...SAND); doc.setFont('helvetica', 'bold'); doc.setFontSize(24)
  doc.text('RECEIPT', W - M, 66, { align: 'right' })
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...GOLD)
  doc.text(o.no, W - M, 86, { align: 'right' })
  doc.setTextColor(...SAND)
  doc.text(o.date, W - M, 102, { align: 'right' })

  let y = 176
  const label = (t, x, yy) => { doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...MUTED); doc.text(t.toUpperCase(), x, yy, { charSpace: 1.2 }) }
  const val = (t, x, yy, max = 220) => { doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...INK); const l = doc.splitTextToSize(t || '-', max); doc.text(l, x, yy); return l.length }

  label('Billed to', M, y); label('Delivery', M + 190, y); label('Payment', M + 390, y)
  y += 16
  const a = val(`${o.fullName}\n${o.phone}${o.email ? '\n' + o.email : ''}`, M, y, 170)
  const b = val(`${o.address}\n${o.district}${o.notes ? '\nNote: ' + o.notes : ''}`, M + 190, y, 180)
  val(o.pay, M + 390, y, 110)
  y += Math.max(a, b + 1, 3) * 14 + 22

  doc.setFillColor(...SAND); doc.rect(M, y, W - 2 * M, 26, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...FOREST)
  doc.text('ITEM', M + 10, y + 16, { charSpace: 1.2 })
  doc.text('QTY', M + 250, y + 16, { charSpace: 1.2 })
  doc.text('PRICE', M + 385, y + 16, { align: 'right', charSpace: 1.2 })
  doc.text('AMOUNT', W - M - 10, y + 16, { align: 'right', charSpace: 1.2 })
  y += 26

  o.lines.forEach((l) => {
    const nm = doc.splitTextToSize(l.name, 220)
    const h = Math.max(30, nm.length * 14 + 14)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(...INK)
    doc.text(nm, M + 10, y + 19)
    doc.text(String(l.q), M + 250, y + 19)
    doc.text(fmt(l.price), M + 385, y + 19, { align: 'right' })
    doc.text(fmt(l.price * l.q), W - M - 10, y + 19, { align: 'right' })
    doc.setDrawColor(228, 222, 210); doc.setLineWidth(0.6); doc.line(M, y + h, W - M, y + h)
    y += h
  })

  y += 18
  const row = (t, v, bold) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(bold ? 13 : 11); doc.setTextColor(...(bold ? FOREST : INK))
    doc.text(t, W - M - 200, y); doc.text(v, W - M - 10, y, { align: 'right' }); y += bold ? 0 : 20
  }
  row('Subtotal', fmt(o.subtotal)); row('Delivery', o.fee ? fmt(o.fee) : 'Free')
  doc.setDrawColor(...GOLD); doc.setLineWidth(1.2); doc.line(W - M - 200, y - 6, W - M, y - 6)
  y += 14; row('Total', fmt(o.grand), true)

  y += 44
  doc.setFillColor(...SAND); doc.roundedRect(M, y, W - 2 * M, 74, 8, 8, 'F')
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...FOREST)
  doc.text('Thank you for backing the next trainee.', M + 18, y + 28)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10); doc.setTextColor(...MUTED)
  doc.text(doc.splitTextToSize('Every Zanda bag is cut and sewn by young women in our Kigali workshop. What you paid for goes back into their training. We will message you to confirm delivery.', W - 2 * M - 36), M + 18, y + 46)

  doc.setFillColor(...DEEP); doc.rect(0, H - 56, W, 56, 'F')
  doc.setFontSize(9); doc.setTextColor(...SAND)
  doc.text('Zanda Initiative  |  Kwa Mushimire, Gasabo District, Kigali, Rwanda  |  +250 780 162 164', W / 2, H - 28, { align: 'center' })

  doc.save(`Zanda-receipt-${o.no}.pdf`)
}
