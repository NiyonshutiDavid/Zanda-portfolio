export const img = (f) => `${import.meta.env.BASE_URL}img/${f}`
export const fmt = (n) => `${n.toLocaleString('en-US')} RWF`

export const CATS = [
  { n: 'Tote Bags', img: 'lumina-duo.jpg', pos: '70% 60%', tag: 'Everyday carry' },
  { n: 'Laptop Bags', img: 'kamo-duo.jpg', pos: '100% 62%', tag: 'Work ready' },
  { n: 'Backpacks', img: 'k03.jpg', tag: 'Daily and school' },
  { n: 'Clothing', img: 'shirt-sky-panel.jpg', tag: 'Tailored to measure' },
]

export const COLS = [
  { n: 'Lumina', kind: 'Tote bags', img: 'lumina-duo.jpg', pos: '68% 55%', blurb: 'Roomy canvas totes in cream and cocoa with side pockets and leather-look bases.' },
  { n: 'Kamo', kind: 'Backpacks and laptop bags', img: 'kamo-duo.jpg', pos: '85% 50%', blurb: 'Olive and tan woven backpacks with buckle straps, side pockets and a padded laptop sleeve.' },
  { n: 'MwanaGo', kind: 'Backpacks for kids', img: 'mwanago-wide.jpg', card: 'mwanago-card.jpg', sq: 'mwanago-sq.jpg', pos: '95% 50%', blurb: 'Playful, light backpacks and matching sets sized for children.' },
]

// Hero slides. Each title is exactly two lines.
export const SLIDES = [
  { img: 'hero-1.jpg', imgM: 'hero-1-m.jpg', focus: '100% 50%', thumb: 'th-lumina.jpg', col: 'Lumina', eyebrow: 'Lumina collection', l1: 'Lumina', l2: 'Tote bags', cta: ['Shop Lumina', '/shop?col=Lumina'] },
  { img: 'hero-2.jpg', imgM: 'hero-2-m.jpg', focus: '100% 50%', thumb: 'th-kamo.jpg', col: 'Kamo', eyebrow: 'Kamo collection', l1: 'Kamo', l2: 'Backpacks & laptop bags', small2: true, cta: ['Shop Kamo', '/shop?col=Kamo'] },
  { img: 'hero-10.jpg', imgM: 'hero-10-m.jpg', focus: '100% 50%', light: true, thumb: 'th-mwanago.jpg', col: 'MwanaGo', eyebrow: 'MwanaGo collection', l1: 'MwanaGo', l2: 'Backpacks for kids', small2: true, cta: ['Shop MwanaGo', '/shop?col=MwanaGo'] },
  { img: 'hero-9.jpg', imgM: 'hero-9-m.jpg', focus: '100% 50%', light: true, thumb: 'th-tailor.jpg', col: 'Tailoring', eyebrow: 'We do', l1: 'Tailoring', l2: 'Made for you', small2: true, cta: ['Book a fitting', '/book?service=uniform-fitting'], cta2: ['Shop clothing', '/shop?cat=Clothing'] },
  { img: 'hero-8.jpg', imgM: 'hero-8-m.jpg', focus: '100% 50%', light: true, thumb: 'th-uniforms.jpg', col: 'Clothing', eyebrow: 'We make', l1: 'Uniforms', l2: 'And shirts', cta: ['Shop clothing', '/shop?cat=Clothing'], cta2: ['Book a fitting', '/book?service=uniform-fitting'] },
]

export const PRODUCTS = [
  { id: 'lumina-cream', name: 'Lumina Cream Tote', col: 'Lumina', cat: 'Tote Bags', price: 38000, imgs: ['t01.jpg', 't09.jpg', 't03.jpg', 't15.jpg'], d: 'Cream canvas tote with navy handles, two side pockets and a ZANDA label. Fits a laptop and a lunch box.', f: [['Material', 'Heavy canvas'], ['Size', '42 x 32 x 14 cm'], ['Pockets', '2 side, 1 inner']] },
  { id: 'lumina-cocoa', name: 'Lumina Cocoa Tote', col: 'Lumina', cat: 'Tote Bags', price: 42000, imgs: ['t21.jpg', 't11.jpg', 't14.jpg', 't23.jpg'], d: 'Cocoa-brown canvas with drawstring side pockets and a wipe-clean base.', f: [['Material', 'Canvas, PU base'], ['Size', '42 x 32 x 14 cm'], ['Pockets', '2 side, 1 inner']] },
  { id: 'lumina-shoulder', name: 'Lumina Shoulder Tote', col: 'Lumina', cat: 'Tote Bags', price: 40000, imgs: ['t16.jpg', 't24.jpg', 't25.jpg', 't02.jpg'], d: 'Long straps for carrying on the shoulder or cross-body. Cream with navy trim.', f: [['Material', 'Heavy canvas'], ['Strap drop', '28 cm'], ['Closure', 'Open top']] },
  { id: 'lumina-weekender', name: 'Lumina Weekender', col: 'Lumina', cat: 'Tote Bags', price: 52000, imgs: ['t12.jpg', 't17.jpg', 't19.jpg', 't18.jpg'], d: 'A deeper cocoa tote that holds a weekend of clothes. Reinforced stitching on every strap.', f: [['Material', 'Canvas, PU base'], ['Size', '48 x 34 x 18 cm'], ['Pockets', '3']] },
  { id: 'lumina-duo', name: 'Lumina Duo Set', col: 'Lumina', cat: 'Tote Bags', price: 76000, imgs: ['t22.jpg', 't20.jpg', 't10.jpg'], d: 'The cream and cocoa totes together, at a set price.', f: [['Includes', '2 totes'], ['Material', 'Canvas'], ['Gift box', 'Yes']] },
  { id: 'lumina-message', name: 'Made With Love Tote', col: 'Lumina', cat: 'Tote Bags', price: 30000, imgs: ['tote-made-with-love.jpg', 'tote-zanda-signature.jpg', 'tote-pray-without-ceasing.jpg'], d: 'Two-tone teal and grey tote printed with a hand-lettered message.', f: [['Material', 'Cotton canvas'], ['Print', 'Screen print'], ['Size', '40 x 36 cm']] },
  { id: 'kamo-olive', name: 'Kamo Olive Backpack', col: 'Kamo', cat: 'Backpacks', price: 58000, imgs: ['k03.jpg', 'k07.jpg', 'k04.jpg', 'k05.jpg', 'k06.jpg'], d: 'Woven olive backpack with a fold-over flap, twin buckle straps, side pocket and a stitched ZANDA label.', f: [['Material', 'Woven fabric, PU base'], ['Capacity', '22 L'], ['Closure', 'Flap + buckles']] },
  { id: 'kamo-tan', name: 'Kamo Tan Backpack', col: 'Kamo', cat: 'Backpacks', price: 58000, imgs: ['k21.jpg', 'k14.jpg', 'k15.jpg', 'k16.jpg'], d: 'The same Kamo shape in warm tan, with black buckles and trim. Comfortable padded straps.', f: [['Material', 'Woven fabric, PU base'], ['Capacity', '22 L'], ['Closure', 'Flap + buckles']] },
  { id: 'kamo-olive-laptop', name: 'Kamo Olive Laptop Pack', col: 'Kamo', cat: 'Laptop Bags', price: 62000, imgs: ['k10.jpg', 'k09.jpg', 'k11.jpg', 'k13.jpg'], d: 'Kamo with a padded laptop sleeve that fits screens up to 15 in.', f: [['Fits', '15 in laptop'], ['Padding', 'Sleeve + back'], ['Pockets', '3']] },
  { id: 'kamo-tan-laptop', name: 'Kamo Tan Laptop Pack', col: 'Kamo', cat: 'Laptop Bags', price: 62000, imgs: ['k19.jpg', 'k20.jpg', 'k21.jpg'], d: 'Tan Kamo with a padded laptop sleeve and an easy-reach side pocket for a bottle.', f: [['Fits', '15 in laptop'], ['Padding', 'Sleeve + back'], ['Pockets', '3']] },
  { id: 'mwana-lilac', name: 'MwanaGo Lilac Backpack', col: 'MwanaGo', cat: 'Backpacks', price: 28000, imgs: ['bag-4.jpg'], d: 'Soft lilac backpack with a pom-pom charm, sized for small shoulders.', f: [['Capacity', '8 L'], ['Ages', '4 to 9'], ['Wash', 'Wipe clean']] },
  { id: 'mwana-bunny', name: 'MwanaGo Bunny Set', col: 'MwanaGo', cat: 'Backpacks', price: 34000, imgs: ['bag-5.jpg', 'bag-6.jpg'], d: 'Printed backpack with a matching lunch bag and pencil case.', f: [['Includes', '3 pieces'], ['Capacity', '12 L'], ['Ages', '5 to 10']] },
  { id: 'shirt-sky', name: 'Sky Panel Shirt', col: 'Tailoring', cat: 'Clothing', price: 28000, imgs: ['shirt-sky-panel.jpg'], d: 'White shirt with a sky-blue panel and a crest, made to measure. Also offered as a school or corporate uniform.', f: [['Made', 'To measure'], ['Fabric', 'Cotton blend'], ['Lead time', '1 to 2 weeks']] },
  { id: 'shirt-navy', name: 'Navy Panel Shirt', col: 'Tailoring', cat: 'Clothing', price: 28000, imgs: ['shirt-navy-panel.jpg'], d: 'White shirt with a navy panel and embroidered mark. Good for company uniforms and teams.', f: [['Made', 'To measure'], ['Fabric', 'Cotton blend'], ['Lead time', '1 to 2 weeks']] },
  { id: 'shirt-stripe', name: 'Striped Sleeve Shirt', col: 'Tailoring', cat: 'Clothing', price: 30000, imgs: ['shirt-striped-sleeve.jpg'], d: 'White shirt with twin navy stripes down the sleeves and a school-style crest.', f: [['Made', 'To measure'], ['Fabric', 'Cotton blend'], ['Lead time', '1 to 2 weeks']] },
]

export const FEATURED = ['lumina-cream', 'kamo-olive', 'lumina-cocoa', 'kamo-tan', 'mwana-lilac', 'mwana-bunny', 'kamo-olive-laptop', 'lumina-weekender']

export const FAQ = [
  ['Who makes the bags?', 'Young women in our Learn-and-Earn programme in Kigali. Every bag is cut, sewn and checked in our workshop.'],
  ['Where do you deliver?', 'Across Kigali within two days and across Rwanda within a week. International orders are on request.'],
  ['Which collection should I choose?', 'Lumina for everyday totes, Kamo for work and school backpacks and laptop bags, and MwanaGo for children.'],
  ['Does my purchase support the programme?', 'Yes. Sales pay the trainees for their work and help cover the cost of training the next cohort.'],
]

// Facts below come from the Zanda Initiative seed content in this repository.
export const TEAM = [
  ['Daniel Iryivuze', 'Chief Executive Officer and Founder'],
  ['Jean Paul Bukuru', 'Chief Operating Officer'],
  ['Chanceline Niyotugendana', 'Chief of Finance'],
  ['Elvine Mugisha', 'Marketing Manager'],
  ['Prencia Arakaza', 'Business Analyst'],
  ['Raissa Mpawenayo', 'Product Manager'],
]

// Services, programmes, news and gallery come from the Zanda Initiative seed content in this repository.
export const SERVICES = [
  { id: 'uniform-fitting', name: 'Uniform fitting and measurements', summary: 'Come to the workshop to be measured for school or corporate uniforms.', d: 'Our trainees take measurements with a trainer and note your fabric and style choices, so your uniforms fit well.', mins: '30 min', when: 'Mon to Fri, and Saturday mornings', img: 'shirt-sky-panel.jpg', dur: 30, notice: 2, price: 0, avail: { 1: [['09:00', '12:00'], ['14:00', '17:00']], 2: [['09:00', '12:00'], ['14:00', '17:00']], 3: [['09:00', '12:00'], ['14:00', '17:00']], 4: [['09:00', '12:00'], ['14:00', '17:00']], 5: [['09:00', '12:00'], ['14:00', '17:00']], 6: [['09:00', '12:00']] }, confirm: 'We confirm by SMS' },
  { id: 'custom-order', name: 'Custom and bulk orders', summary: 'Bags, uniforms or branded items for your school, company or event.', d: 'We look at designs, fabrics, quantities, prices and delivery dates together. Every order is made by young women in our Learn-and-Earn programme.', mins: '45 min', when: 'Mon to Fri', img: 'shirt-navy-panel.jpg', dur: 45, notice: 2, price: 0, avail: { 1: [['09:00', '17:00']], 2: [['09:00', '17:00']], 3: [['09:00', '17:00']], 4: [['09:00', '17:00']], 5: [['09:00', '17:00']] }, confirm: 'We confirm by SMS' },
  { id: 'workshop-visit', name: 'Workshop visit', summary: 'For schools, companies, NGOs and community groups.', d: 'Visit the workshop, meet the trainees and see Learn-and-Earn at work. Our team confirms each visit by phone, and we ask for 48 hours notice.', mins: '60 min', when: 'Tuesdays and Thursdays', img: 'cut-panels.jpg', dur: 60, notice: 48, price: 0, avail: { 2: [['10:00', '12:00'], ['14:00', '16:00']], 4: [['10:00', '12:00'], ['14:00', '16:00']] }, confirm: 'Our team confirms each visit by phone' },
  { id: 'sewing-session', name: 'Hands-on sewing session', summary: 'Sew your own simple bag with a Zanda trainer.', d: 'Two hours in the workshop learning to sew a simple bag, guided by a Zanda trainer.', mins: '2 hours', when: 'Saturday mornings', img: 'garment-panel.jpg', dur: 120, notice: 24, price: 10000, avail: { 6: [['09:00', '13:00']] }, confirm: 'We confirm by SMS' },
]

export const MAKES = [
  { t: 'School uniforms', d: 'Measured and sewn for pupils, classes and whole schools.', f: 'shirt-sky-panel.jpg', to: '/book?service=uniform-fitting' },
  { t: 'Corporate clothing', d: 'Shirts and uniforms for teams, with your colours and crest.', f: 'shirt-navy-panel.jpg', to: '/book?service=custom-order' },
  { t: 'Bags', d: 'Totes, backpacks and laptop bags, ready-made from three collections.', f: 't22.jpg', to: '/shop' },
  { t: 'Custom yours', d: 'Something else in mind? Tell us and book a time to plan it.', f: null, to: '/book?service=custom-order' },
]

export const MODULES = [
  ['Vocational tailoring', 'Practical skills from basic stitching to producing marketable goods like bags, school uniforms and corporate attire.'],
  ['Digital skills', 'Computer basics, social media marketing, online sales and mobile money transactions.'],
  ['Entrepreneurship', 'Business planning, cost calculation, pricing and customer service.'],
  ['Learn-and-Earn', 'Paid work on real customer orders from schools, companies and individuals, from the start of training.'],
]

export const OUTCOMES = [
  'Tailoring skills that lead to an income',
  'Confidence with computers, social media and mobile money',
  'The know-how to plan, price and sell',
  'Income from real orders during training',
  'Mentorship and incubation after graduation',
]

export const NEWS = [
  { slug: 'our-pilot', date: '10 October 2025', title: 'Our pilot: first trainees, first orders', tag: 'Programme', summary: 'Our pilot trained our first trainees, who made bags and company uniforms for real customers.', body: 'During our pilot we trained our first trainees in our workshop. Working on real orders, they made products that were sold to customers. The pilot showed that Learn-and-Earn works: trainees gain skills and confidence while earning. We are now preparing a dedicated workshop and our first full cohort.', img: 'cutting-fabric.jpg', iso: '2025-10-10' },
  { slug: 'registered', date: '12 August 2025', title: 'Zanda Initiative is officially registered', tag: 'Organisation', summary: 'On 12 August 2025, Zanda Initiative was registered in Rwanda as a social enterprise.', body: 'On 12 August 2025, Zanda Initiative Ltd was registered in Rwanda. Registration lets us work with partners, schools and companies, and build a programme where abandoned girls and women learn a trade, earn an income and gain their independence.', img: 'pattern-drafting.jpg', iso: '2025-08-12' },
]

export const GALLERY = [
  ['pattern-drafting.jpg', 'Drafting a pattern before cutting', 'Training'],
  ['cutting-fabric.jpg', 'Cutting fabric to size', 'Training'],
  ['cut-panels.jpg', 'Cut panels ready for sewing', 'Training'],
  ['garment-panel.jpg', 'Assembling a garment', 'Training'],
  ['pressing-seams.jpg', 'Pressing seams for a clean finish', 'Training'],
  ['t16.jpg', 'Lumina cream tote', 'Bags'], ['t11.jpg', 'Lumina cocoa tote', 'Bags'], ['t22.jpg', 'Lumina duo', 'Bags'],
  ['k10.jpg', 'Kamo olive pack', 'Bags'], ['k19.jpg', 'Kamo tan pack', 'Bags'], ['k21.jpg', 'Kamo tan pack, back view', 'Bags'], ['k09.jpg', 'Kamo olive laptop pack', 'Bags'],
  ['t09.jpg', 'Lumina cream tote, side view', 'Bags'], ['t17.jpg', 'Lumina weekender', 'Bags'], ['t24.jpg', 'Lumina shoulder tote', 'Bags'],
  ['shirt-sky-panel.jpg', 'Panel shirt in sky blue', 'Clothing'], ['shirt-navy-panel.jpg', 'Panel shirt in navy', 'Clothing'], ['shirt-striped-sleeve.jpg', 'Shirt with striped sleeves', 'Clothing'],
  ['tote-zanda-signature.jpg', 'Zanda signature tote', 'Bags'], ['tote-made-with-love.jpg', 'Made With Love tote', 'Bags'],
]

// Pilot figures from the Zanda Initiative seed content. Graduate stories must be written with each person's consent.
export const IMPACT = [
  [2, 'Young women trained', 'Our first two students completed the pilot.'],
  [14, 'Bags sold', 'Made during the pilot and sold to customers.'],
  [3, 'Company uniforms made', 'Sewn and sold during the pilot.'],
]

export const STORIES = [
  { kind: 'Pilot', title: 'First trainees, first orders', text: 'Our first two students learned in the workshop and worked on real orders from day one. The bags and company uniforms they made reached paying customers.', img: 'cutting-fabric.jpg' },
  { kind: 'After graduation', title: 'Support that does not stop', text: 'Graduates can count on business incubation, mentors from the programme network and continued learning. Finishing the course is where support continues, not where it ends.', img: 'pressing-seams.jpg' },
  { kind: 'Coming soon', title: 'Graduate stories', text: 'As each cohort graduates, their own words and photos will appear here, shared with their consent.', img: null },
]

// Taken from the programmes kept in the Zanda dashboard (Content > Programs). Applications open only when staff open an intake.
export const PROGRAMS = [
  {
    id: 'learn-and-earn',
    name: 'Learn-and-Earn Empowerment Programme',
    duration: '6 months',
    who: 'Girls and women aged 15 to 24, starting in Gasabo District, Kigali',
    summary: 'Tailoring, digital skills and entrepreneurship, with paid work on real customer orders from the start.',
    points: ['Vocational tailoring', 'Digital skills', 'Entrepreneurship', 'Paid work on real orders'],
    status: 'Applications closed for now',
  },
  {
    id: 'zero-abandonment',
    name: 'Zero Abandonment Support',
    duration: 'After graduation',
    who: 'Graduates of the Learn-and-Earn programme',
    summary: 'Support that continues after graduation: business incubation, mentorship and continued learning.',
    points: ['Business incubation', 'Mentorship network', 'Zanda Digital Platform'],
    status: 'Open to every graduate',
  },
]

// Partner names and logos are added here once partners agree to be listed: { n: 'Name', type: 'School', logo: 'file.png', url: 'https://...' }.
export const PARTNERS = []

export const PARTNER_WAYS = [
  ['Schools', 'Order uniforms and school bags, made by trainees to your design.'],
  ['Companies', 'Branded bags and corporate clothing, with your logo, for your team or clients.'],
  ['Donors and foundations', 'Fund trainee places, sewing machines and the dedicated workshop.'],
  ['Mentors and professionals', 'Share your skills with trainees and graduates starting their own businesses.'],
]
