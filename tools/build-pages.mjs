// Builds every page of the Safadi site from shared parts.
// Run from the project folder:  node tools/build-pages.mjs
import { writeFileSync } from 'node:fs';

const PHONE = '020 229 9995', TEL = 'tel:+233202299995', EMAIL = 'info@safadimedicalservices.com';
const YOUTUBE = 'SjrdfW1zw14';
const MAP_Q = 'Safadi%20Medical%20Hub%2C%20Spintex%20Road%2C%20Accra';

// ---------- icons (drawn for this site; 24px UI set and 64px treatment set) ----------
const ui = (d, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;
const I = {
  phone: ui('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
  clock: ui('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  mail: ui('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  pin: ui('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
  check: ui('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>'),
  plus: ui('<path d="M12 5v14M5 12h14"/>'),
  arrow: ui('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  left: ui('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
  chev: ui('<path d="m6 9 6 6 6-6"/>'),
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15c0 .8.9 1.3 1.6.8l11.5-7.5a1 1 0 0 0 0-1.6L8.6 3.7C7.9 3.2 7 3.7 7 4.5z" fill="currentColor"/></svg>',
  quote: '<svg viewBox="0 0 40 40" aria-hidden="true" class="quote__mark"><path fill="currentColor" d="M6 30V20c0-7 4-12 11-14l1.5 3C14 11 12 14 12 18h6v12H6zm16 0V20c0-7 4-12 11-14l1.5 3C30 11 28 14 28 18h6v12H22z"/></svg>',
  calendar: ui('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
};
const svg64 = (d) => `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const TOOTH = 'M21 8c-7 0-12 5-12 13 0 6 3 10 5 16 2 8 3 19 8 19s5-12 10-12 5 12 10 12 6-11 8-19c2-6 5-10 5-16 0-8-5-13-12-13-5 0-7 3-11 3s-6-3-11-3z';
const T = {
  general: svg64(`<path d="${TOOTH}"/><path d="m23 27 6 6 12-12"/>`),
  implants: svg64('<path d="M20 11c0-4 5-6 12-6s12 2 12 6c0 7-3 12-12 12S20 18 20 11z"/><path d="M26 23h12l-1.5 6h-9z"/><path d="M25 29h14l-2.5 27h-9z"/><path d="M24 36h16M25 42h14M26 48h12"/>'),
  orthodontics: svg64('<path d="M6 20c0-5 3-8 8-8s8 3 8 8v18c0 7-3 12-8 12s-8-5-8-12zM24 20c0-5 3-8 8-8s8 3 8 8v18c0 7-3 12-8 12s-8-5-8-12zM42 20c0-5 3-8 8-8s8 3 8 8v18c0 7-3 12-8 12s-8-5-8-12z"/><path d="M4 30h56"/><rect x="11" y="26" width="6" height="8" rx="1.5"/><rect x="29" y="26" width="6" height="8" rx="1.5"/><rect x="47" y="26" width="6" height="8" rx="1.5"/>'),
  cosmetic: svg64(`<path d="${TOOTH}" transform="translate(-4 4) scale(.94)"/><path d="m51 5 2 5 5 2-5 2-2 5-2-5-5-2 5-2zM56 24l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>`),
  children: svg64(`<path d="${TOOTH}"/><circle cx="25" cy="23" r="1.6" fill="currentColor"/><circle cx="39" cy="23" r="1.6" fill="currentColor"/><path d="M25 30c3 4 11 4 14 0"/>`),
  restorative: svg64(`<path d="${TOOTH}"/><path d="M10 24c8 3 16 4 22 4s14-1 22-4"/><path d="M9 16c8 4 15 5 23 5s15-1 23-5"/>`),
  emergency: svg64(`<path d="${TOOTH}"/><path d="m35 16-8 13h9l-7 13"/>`),
  primary: svg64('<path d="M14 6v16a12 12 0 0 0 24 0V6"/><path d="M10 6h8M34 6h8"/><path d="M26 34v8a12 12 0 0 0 24 0v-8"/><circle cx="50" cy="29" r="5"/>'),
};
const social = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3l-1.4-.1c-2 0-2.8.8-2.8 2.7V12h3.9l-.7 3.7h-3.2v8.2A12 12 0 1 0 9.1 23.7z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14.2 10.2 23 0h-2.1l-7.6 8.8L7.3 0H.3l9.1 13.3L.3 24h2l8-9.3 6.4 9.3h7zM11.4 13.5l-.9-1.3L3.1 1.6h3.2l5.9 8.5.9 1.3 7.8 11.1h-3.2z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.4 20.5h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.4v1.6c.5-.9 1.6-1.9 3.4-1.9 3.6 0 4.3 2.4 4.3 5.5v6.3zM5.3 7.4a2 2 0 1 1 0-4.1 2 2 0 0 1 0 4.1zM7.1 20.5H3.6V9h3.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.5c0 1 .8 1.8 1.8 1.8h20.4c1 0 1.8-.8 1.8-1.8V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
};

// ---------- shared data ----------
const TREATMENTS = [
  { id: 'general', icon: 'general', name: 'General Dentistry', line: 'Check-ups, cleaning and preventive care for every age.', long: 'Check-ups, cleaning and preventive care, to find problems early and keep teeth healthy.' },
  { id: 'implants', icon: 'implants', name: 'Dental Implants', line: 'Permanent replacements for missing teeth, fixed in the jaw.', long: 'A titanium post in the jaw holds a new tooth that looks and works like your own, placed in our own theatre.' },
  { id: 'orthodontics', icon: 'orthodontics', name: 'Braces & Invisalign', line: 'Metal braces and clear aligners to straighten teeth.', long: 'Metal braces with Dr Samuel Addo, our orthodontist, or clear Invisalign aligners with Dr Naa Oyo Glover.' },
  { id: 'cosmetic', icon: 'cosmetic', name: 'Whitening & Veneers', line: 'A brighter, more even smile.', long: 'Professional whitening, and thin veneers that change the shape and colour of front teeth.' },
  { id: 'children', icon: 'children', name: 'Children\'s Dentistry', line: 'Check-ups and prevention from the first teeth.', long: 'Check-ups and preventive care from the first teeth, at a pace that suits the child.' },
  { id: 'restorative', icon: 'restorative', name: 'Crowns & Bridges', line: 'Rebuild teeth that are broken, worn or missing.', long: 'A crown covers a broken or worn tooth; a bridge fills the gap where teeth are missing.' },
  { id: 'emergency', icon: 'emergency', name: 'Emergency Care', line: 'Toothache, a broken tooth or swelling, seen quickly.', long: `Toothache, a broken tooth or swelling: phone ${PHONE} during opening hours and we see you as soon as we can.` },
  { id: 'primary', icon: 'primary', name: 'Primary Care Doctor', line: 'A general doctor at the same clinic.', long: 'Dr Hamza Basheer, our primary care physician, sees patients for general health at the same address.' },
];
const DOCTORS = [
  { id: 'zaher-safadi', img: 'dr-zaher', name: 'Dr Zaher Safadi', role: 'Dental Surgeon', line: 'Mastership in aesthetic dentistry, British Academy of Restorative Dentistry.', alt: 'Dr Zaher Safadi in a white coat' },
  { id: 'naa-oyo-glover', img: 'dr-glover', name: 'Dr Naa Oyo Glover', role: 'Dental Surgeon', line: 'Invisalign accreditation, 2025.', alt: 'Dr Naa Oyo Glover in a white coat' },
  { id: 'samuel-addo', img: 'dr-addo', name: 'Dr Samuel Addo', role: 'Orthodontist', line: 'Diploma in orthodontics and dentofacial orthopaedics, City of London Dental Academy.', alt: 'Dr Samuel Addo in a light blue coat, arms folded' },
  { id: 'kwaku-bosompem-acheampong', img: 'dr-bosompem', name: 'Dr Kwaku Bosompem-Acheampong', role: 'Maxillofacial Surgeon', line: 'Specialist maxillofacial surgeon, also at 37 Military Hospital, Accra.', alt: 'Dr Kwaku Bosompem-Acheampong speaking into a microphone' },
  { id: 'hamza-basheer', img: 'dr-basheer', name: 'Dr Hamza Basheer', role: 'Primary Care Physician', line: 'General health check-ups and care at the same clinic.', alt: 'Dr Hamza Basheer in a navy suit and red tie' },
];
const QUOTES = [
  ['The best dental experience I’ve ever had! The staff was so welcoming, and they explained every step of my treatment. I left feeling confident about my smile and actually looking forward to my next visit!', 'Treatment patient'],
  ['I was nervous about visiting the dentist, but the team at Safadi Medical Hub made me feel completely at ease. They were gentle, thorough, and really took their time to ensure I was comfortable. Highly recommended!', 'Nervous patient'],
  ['Thanks to Safadi Medical Hub, I’m finally able to smile confidently again! The cosmetic treatments exceeded my expectations, and the results are simply amazing. I couldn’t be happier!', 'Cosmetic patient'],
  ['I brought my children here, and they absolutely loved it! The staff is so friendly and knows how to make kids feel comfortable. It’s great knowing they’re in such caring hands.', 'Parent'],
  ['I had a dental emergency and Safadi Medical Hub fit me in right away. They provided quick, effective care, and I’m so grateful for their help. I wouldn’t trust anyone else with my dental health!', 'Emergency patient'],
];
const FAQ = [
  ['Is the clinic open on Fridays?', 'No. We open Monday to Thursday and on Saturday, 8:30 to 17:00. Friday and Sunday we are closed.'],
  ['Does the clinic treat children?', 'Yes. We see children for check-ups, cleaning and preventive care.'],
  ['Can I get Invisalign at the clinic?', 'Yes. Dr Naa Oyo Glover is accredited for Invisalign, and Dr Samuel Addo, our orthodontist, fits braces.'],
  ['What do I do in a dental emergency?', `Phone ${PHONE} during opening hours and tell us what happened. We see urgent cases as soon as we can.`],
  ['What are my options for a missing tooth?', 'An implant or a bridge. At your visit the dentist looks at the gap and the teeth around it and explains which suits you.'],
  ['Is there a general doctor at the clinic?', 'Yes. Dr Hamza Basheer is the clinic\'s primary care physician.'],
];
const HOURS = `<dl class="hours" data-tz="Africa/Accra">
            <dt data-days="mon,tue,wed,thu">Monday – Thursday</dt><dd>8:30 – 17:00</dd>
            <dt data-days="fri">Friday</dt><dd>Closed</dd>
            <dt data-days="sat">Saturday</dt><dd>8:30 – 17:00</dd>
            <dt data-days="sun">Sunday</dt><dd>Closed</dd>
          </dl>`;

// ---------- parts ----------
const head = (p) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:image" content="img/room-green.webp">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.png" type="image/png">
<meta name="theme-color" content="#ffffff">
<!-- <link rel="canonical" href="https://safadimedicalservices.com/${p.file === 'index.html' ? '' : p.file}"> : switch on when this build replaces the live site -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Urbanist:wght@500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/theme.css">
<script>document.documentElement.classList.add('js');setTimeout(function(){var r=document.documentElement;if(!r.classList.contains('site-ready'))r.classList.add('rv-safe','is-loaded')},3000)</script>
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
`;

const navLink = (href, label, cur) => `<li class="nav__item"><a class="nav__link" href="${href}"${cur === href ? ' aria-current="page"' : ''}>${label}</a></li>`;
const header = (p) => `<header class="header">
  <div class="container header__in">
    <a class="logo" href="index.html" aria-label="Safadi Medical Hub Dental Clinic, home"><img src="img/logo.png" alt="Safadi Medical Hub Dental Clinic" width="440" height="119"></a>
    <nav class="nav" aria-label="Main">
      <ul class="nav__list">
        ${navLink('index.html', 'Home', p.file)}
        <li class="nav__item"><a class="nav__link" href="our-services.html"${p.file === 'our-services.html' ? ' aria-current="page"' : ''}>Treatments ${I.chev}</a>
          <div class="nav__drop">${TREATMENTS.map((t) => `<a href="our-services.html#${t.id}">${t.name}</a>`).join('')}</div>
        </li>
        ${navLink('our-team.html', 'Doctors', p.file)}
        ${navLink('about-us.html', 'About', p.file)}
        ${navLink('gallery.html', 'Gallery', p.file)}
        ${navLink('contact-us.html', 'Contact', p.file)}
      </ul>
      <div class="nav__mobile-cta"><a class="btn btn--primary" href="appointment.html">Book an Appointment</a></div>
    </nav>
    <div class="header__cta">
      <a class="btn btn--primary" href="appointment.html">Book an Appointment</a>
      <button class="menu-btn" type="button" aria-label="Menu" aria-expanded="false"><span></span></button>
    </div>
  </div>
</header>
`;

const cta = () => `<section class="section section--flush-top" aria-label="Book an appointment">
    <div class="container">
      <div class="cta" data-reveal="zoom">
        <div><h2>Ready for a healthier smile?</h2><p>Book a visit at Spintex Plaza. We open Monday to Thursday and Saturday, 8:30 to 17:00.</p></div>
        <a class="btn btn--light" href="appointment.html">Book an Appointment ${I.arrow}</a>
      </div>
    </div>
  </section>
`;

const footer = (p) => `<footer class="footer">
  <div class="container">
    <div class="footer__grid">
      <div>
        <a class="footer__brand" href="index.html"><img src="favicon.png" alt="" width="48" height="48">Safadi Medical Hub</a>
        <p class="footer__about">A dental clinic with a primary care doctor at Spintex Plaza, Spintex Road, Accra. Open since 2020.</p>
        <div class="socials">
          <a href="https://www.facebook.com/SMHDentalClinic/" aria-label="Facebook">${social.facebook}</a>
          <a href="https://www.instagram.com/safadimedicalhub/" aria-label="Instagram">${social.instagram}</a>
          <a href="https://x.com/hubsafadi" aria-label="X">${social.x}</a>
          <a href="https://gh.linkedin.com/company/safadi-mh-dental-clinic" aria-label="LinkedIn">${social.linkedin}</a>
        </div>
      </div>
      <div><h3>Clinic</h3><ul class="footer__links"><li><a href="index.html">Home</a></li><li><a href="about-us.html">About us</a></li><li><a href="our-team.html">Our doctors</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="appointment.html">Appointments</a></li><li><a href="contact-us.html">Contact</a></li></ul></div>
      <div><h3>Treatments</h3><ul class="footer__links">${TREATMENTS.slice(0, 6).map((t) => `<li><a href="our-services.html#${t.id}">${t.name}</a></li>`).join('')}</ul></div>
      <div><h3>Contact Us</h3>
        <ul class="footer__contact">
          <li>${I.pin}<span><strong>Clinic location</strong>Spintex Plaza, Spintex Road, Accra</span></li>
          <li>${I.phone}<span><strong>Call us</strong><a href="${TEL}">${PHONE}</a></span></li>
          <li>${I.mail}<span><strong>Email</strong><a href="mailto:${EMAIL}">${EMAIL}</a></span></li>
          <li>${I.clock}<span><strong>Opening hours</strong>Mon – Thu &amp; Sat, 8:30 – 17:00</span></li>
        </ul>
      </div>
    </div>
    <div class="footer__bar"><span>&copy; 2026 Safadi Medical Hub. All rights reserved.</span><span>Spintex, Accra, Ghana</span></div>
  </div>
</footer>
<script type="module" src="js/site.js"></script>${p.scripts || ''}
</body>
</html>
`;

const pageHead = (crumb, h1, lead) => `<section class="page-head">
    <span class="glow glow--a" aria-hidden="true"></span><span class="glow glow--b" aria-hidden="true"></span>
    <div class="container">
      <p class="crumbs"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>${crumb}</span></p>
      <h1 data-reveal>${h1}</h1>
      <p class="lead" data-reveal style="--d:1">${lead}</p>
    </div>
  </section>
`;

const serviceCards = () => `<div class="services" data-stagger>
        ${TREATMENTS.map((t) => `<a class="service" href="our-services.html#${t.id}">
          <span class="service__icon">${T[t.icon]}</span>
          <h3>${t.name}</h3>
          <p>${t.line}</p>
          <span class="service__more" aria-hidden="true">${I.plus}</span>
        </a>`).join('\n        ')}
      </div>`;

const faqBlock = () => `<div class="faq">
          ${FAQ.map(([q, a], i) => `<details${i === 0 ? ' open' : ''}><summary>${q}${I.plus}</summary><div class="faq__body"><p>${a}</p></div></details>`).join('\n          ')}
        </div>`;

const bookingForm = () => `<form class="form" data-booking data-to="${EMAIL}" novalidate>
          <h3>Request an appointment</h3>
          <div class="field"><label for="f-name">Full name</label><input id="f-name" name="name" type="text" autocomplete="name" required><p class="field__error" hidden>Write the name the appointment is under.</p></div>
          <div class="field"><label for="f-phone">Phone</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" required><p class="field__error" hidden>Write a phone number we can call you on.</p></div>
          <div class="field field--full"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required><p class="field__error" hidden>Write an email address with an @, like name@gmail.com.</p></div>
          <div class="field"><label for="f-treatment">Treatment</label><select id="f-treatment" name="treatment" required><option value="">Choose a treatment</option>${TREATMENTS.map((t) => `<option>${t.name}</option>`).join('')}<option>Not sure yet</option></select><p class="field__error" hidden>Choose a treatment, or Not sure yet.</p></div>
          <div class="field"><label for="f-day">Preferred day</label><input id="f-day" name="day" type="text" placeholder="e.g. Tuesday 17 November" required><p class="field__error" hidden>Write the day that suits you.</p></div>
          <div class="field field--full"><label for="f-notes">Anything we should know</label><textarea id="f-notes" name="notes" rows="3"></textarea></div>
          <button class="btn btn--primary" type="submit">Book an Appointment ${I.arrow}</button>
          <p class="form__status" role="status"></p>
          <p class="form__note">We reply during opening hours to confirm the day and time.</p>
        </form>`;

// ---------- pages ----------
const pages = [];

pages.push({
  file: 'index.html',
  title: 'Safadi Dental Clinic | Dentist in Spintex, Accra',
  description: 'Dental clinic at Spintex Plaza, Accra: check-ups, implants, braces, Invisalign, whitening and children\'s dentistry from five doctors. Book an appointment.',
  body: `<section class="hero">
    <span class="glow glow--a" aria-hidden="true"></span><span class="glow glow--b" aria-hidden="true"></span><span class="glow glow--c" aria-hidden="true"></span>
    <div class="container">
      <div>
        <p class="eyebrow" data-reveal>Welcome to Safadi Dental Clinic</p>
        <h1><span class="line"><span class="w"><span style="--i:0">Healthy</span></span> <span class="w"><span class="accent" style="--i:1">Smiles</span></span></span><span class="line"><span class="w"><span style="--i:2">in</span></span> <span class="w"><span style="--i:3">Spintex</span></span></span></h1>
        <p class="hero__lead" data-reveal style="--d:3">Check-ups, implants, braces and Invisalign, whitening and children's dentistry from five doctors at Spintex Plaza, Accra.</p>
        <div class="hero__actions" data-reveal style="--d:4">
          <a class="btn btn--primary" href="appointment.html">Book an Appointment ${I.arrow}</a>
          <a class="avatars" href="our-team.html">
            <span class="avatars__faces"><img src="img/dr-zaher.webp" alt="" width="52" height="52"><img src="img/dr-glover.webp" alt="" width="52" height="52"><img src="img/dr-addo.webp" alt="" width="52" height="52"></span>
            <span><strong>5 doctors</strong><span>dentists, surgeons and a GP</span></span>
          </a>
        </div>
      </div>
      <div class="hero__media" data-reveal="zoom" style="--d:2">
        <div class="hero__photo"><img src="img/room-green.webp" alt="A bright Safadi treatment room with a green dental chair and tall windows" fetchpriority="high"></div>
        <div class="float-card float-card--hours"><span class="float-card__icon">${I.clock}</span><span><strong>Open 5 days a week</strong>Mon – Thu &amp; Sat, 8:30 – 17:00</span></div>
        <a class="float-card float-card--film" href="#film"><span class="float-card__icon">${I.play}</span><span><strong>Watch our film</strong>A tour of the clinic</span></a>
      </div>
    </div>
  </section>

  <div class="container">
    <div class="infobar" data-reveal>
      <div class="infobar__item"><span class="infobar__icon">${I.phone}</span><div><strong class="infobar__title">Need dental care?</strong><a href="${TEL}">Call ${PHONE}</a></div></div>
      <div class="infobar__item"><span class="infobar__icon">${I.clock}</span><div><strong class="infobar__title">Opening hours</strong>Mon – Thu &amp; Sat, 8:30 – 17:00</div></div>
      <div class="infobar__item"><span class="infobar__icon">${I.mail}</span><div><strong class="infobar__title">Email us</strong><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
    </div>
  </div>

  <section class="section">
    <div class="container about">
      <div class="about__photos">
        <figure class="rv-photo" style="margin:0"><img src="img/treatment.webp" alt="A Safadi dentist treating a patient in the dental chair" loading="lazy"></figure>
        <figure class="rv-photo" style="margin:0"><img src="img/reception.webp" alt="The reception desk and waiting area with green ceiling panels" loading="lazy"></figure>
        <div class="about__badge" data-reveal="zoom" style="--d:3"><strong>2020</strong><span>on Spintex Road</span></div>
      </div>
      <div>
        <p class="eyebrow" data-reveal>About Us</p>
        <h2 class="h2" data-reveal style="--d:1">Professional and Personal Dental Care</h2>
        <p data-reveal style="--d:2;margin-top:20px">Safadi Medical Hub opened at Spintex Plaza in 2020 and brings dentists, a maxillofacial surgeon and a primary care doctor together in one building, so most of your care happens in one place.</p>
        <ul class="checks" data-stagger>
          <li>${I.check}Dentists and a GP under one roof</li>
          <li>${I.check}Implant surgery in our own theatre</li>
          <li>${I.check}Invisalign-accredited dentist</li>
          <li>${I.check}Gentle care for children</li>
        </ul>
        <a class="btn btn--primary" href="about-us.html" data-reveal>About the clinic ${I.arrow}</a>
      </div>
    </div>
  </section>

  <section class="section section--flush-top">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow" data-reveal>Our Treatments</p>
        <h2 class="h2" data-reveal style="--d:1">Dental Care for the Whole Family</h2>
      </div>
      ${serviceCards()}
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow" data-reveal>Meet Our Doctors</p>
        <h2 class="h2" data-reveal style="--d:1">The Team Behind Your Smile</h2>
        <p class="lead" data-reveal style="--d:2">Two dental surgeons, an orthodontist, a maxillofacial surgeon and a primary care physician.</p>
      </div>
      <div class="team" data-stagger>
        ${DOCTORS.map((d) => `<a class="doc" href="our-team.html#${d.id}"><img src="img/${d.img}.webp" alt="${d.alt}" loading="lazy" style="view-transition-name: doc-${d.id}"><span class="doc__chip"><strong>${d.name}</strong><span>${d.role}</span></span></a>`).join('\n        ')}
      </div>
      <div class="stats" data-stagger>
        <div class="stat"><strong>2020</strong><span>Opened on Spintex Road</span></div>
        <div class="stat"><strong data-count="5">5</strong><span>Doctors on the team</span></div>
        <div class="stat"><strong data-count="8">8</strong><span>Kinds of treatment</span></div>
        <div class="stat"><strong data-count="5">5</strong><span>Days a week, Fri &amp; Sun closed</span></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container faq-wrap">
      <div>
        <p class="eyebrow" data-reveal>Everything you need to know</p>
        <h2 class="h2" data-reveal style="--d:1">Frequently Asked Questions</h2>
        <p data-reveal style="--d:2;margin-top:18px">Anything else? Phone us during opening hours on <a class="link" href="${TEL}">${PHONE}</a>.</p>
        <a class="btn btn--ghost" href="contact-us.html" data-reveal style="--d:3">Contact the clinic ${I.arrow}</a>
      </div>
      <div data-reveal="right">${faqBlock()}</div>
    </div>
  </section>

  <section class="film-band" id="film">
    <div class="container">
      <div class="film rv-photo" data-youtube="${YOUTUBE}">
        <img src="img/surgery-team.webp" alt="Safadi surgeons in green gowns at work in the clinic's theatre" loading="lazy">
        <button class="film__play" type="button" aria-label="Play the clinic film"><span>${I.play}</span></button>
      </div>
    </div>
  </section>

  <section class="section section--tint" data-quotes>
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow" data-reveal>Testimonials</p>
        <h2 class="h2" data-reveal style="--d:1">What Our Patients Say</h2>
      </div>
      <div class="quotes" data-stagger>
        ${QUOTES.map(([q, who]) => `<figure class="quote" style="margin:0">${I.quote}<p>“${q}”</p><figcaption class="quote__who"><span class="quote__avatar" aria-hidden="true">${who[0]}</span><span><strong>${who}</strong>Safadi Dental Clinic</span></figcaption></figure>`).join('\n        ')}
      </div>
      <div class="quotes-nav"><button type="button" data-prev aria-label="Previous">${I.left}</button><button type="button" data-next aria-label="Next">${I.arrow}</button></div>
    </div>
  </section>

  ${cta()}`,
});

pages.push({
  file: 'our-services.html',
  title: 'Dental Treatments | Safadi Dental Clinic, Spintex, Accra',
  description: 'General and children\'s dentistry, implants, crowns, braces, Invisalign, whitening, emergency care and a primary care doctor at Spintex Plaza, Accra.',
  scripts: '\n<script type="module" src="js/implant3d.js"></script>',
  body: pageHead('Treatments', 'Dental <span class="accent">Treatments</span>', 'From routine check-ups to implant surgery and Invisalign, every treatment happens at our clinic at Spintex Plaza.') + `
  <section class="section" aria-labelledby="all-h">
    <div class="container">
      <h2 class="sr-only" id="all-h">All treatments</h2>
      ${serviceCards()}
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      ${[
        ['Everyday care', 'Healthy Teeth for Adults and Children', 'treatment.webp', 'A Safadi dentist treating a patient in the dental chair', ['general', 'children', 'emergency']],
        ['Specialist care', 'Implants, Crowns and Bridges', 'surgery.webp', 'A surgeon and assistant operating on a patient under theatre lights', ['implants', 'restorative', 'primary']],
        ['A better smile', 'Braces, Invisalign and Whitening', 'dr-glover.webp', 'Dr Naa Oyo Glover, dental surgeon, in a white coat', ['orthodontics', 'cosmetic']],
      ].map(([eye, h, img, alt, ids], i) => `<div class="feature${i % 2 ? ' feature--flip' : ''}">
        <div class="feature__media rv-photo"><img src="img/${img}" alt="${alt}" loading="lazy"${img.startsWith('dr-') ? ' style="object-position:50% 20%"' : ''}></div>
        <div>
          <p class="eyebrow" data-reveal>${eye}</p>
          <h2 class="h2" data-reveal style="--d:1">${h}</h2>
          <ul class="feature__list" data-stagger>
            ${ids.map((id) => { const t = TREATMENTS.find((x) => x.id === id); return `<li id="${id}" style="scroll-margin-top:110px"><span class="ic">${T[t.icon]}</span><div><h3>${t.name}</h3><p>${t.long}</p></div></li>`; }).join('\n            ')}
          </ul>
        </div>
      </div>`).join('\n      ')}
    </div>
  </section>

  <section class="section implant3d" id="implant-build" aria-labelledby="implant-h">
    <div class="container implant3d__pin">
      <div>
        <p class="eyebrow">How it works</p>
        <h2 class="h2" id="implant-h">How a Dental Implant Is Built</h2>
        <p class="lead" style="margin-top:14px">Three parts replace one missing tooth, fitted one after another.</p>
        <ol class="implant3d__steps">
          <li class="implant3d__step is-active"><h3>The titanium post</h3><p>Placed in the jawbone, where the bone grows around it over the following months. It becomes the tooth's new root.</p></li>
          <li class="implant3d__step"><h3>The abutment</h3><p>A small connector fixed to the post once it has healed. It holds the new tooth.</p></li>
          <li class="implant3d__step"><h3>The crown</h3><p>A new tooth made to match the shape and colour of your own teeth, fixed on top.</p></li>
        </ol>
      </div>
      <div class="implant3d__stage"><img src="img/surgery-team.webp" alt="Two Safadi surgeons in green gowns operating on a patient" loading="lazy"></div>
    </div>
  </section>

  ${cta()}`,
});

pages.push({
  file: 'our-team.html',
  title: 'Our Doctors | Safadi Dental Clinic, Spintex, Accra',
  description: 'Meet the five doctors at Safadi Dental Clinic: dental surgeons, an orthodontist, a maxillofacial surgeon and a primary care physician.',
  body: pageHead('Our doctors', 'The Team Behind <span class="accent">Your Smile</span>', 'Five doctors: two dental surgeons, an orthodontist, a maxillofacial surgeon and a primary care physician.') + `
  <section class="section">
    <div class="container">
      <h2 class="sr-only">Our doctors</h2>
      <div class="doctors" data-stagger>
        ${DOCTORS.map((d) => `<article class="doctor" id="${d.id}">
          <div class="doctor__photo"><img src="img/${d.img}.webp" alt="${d.alt}" loading="lazy" style="view-transition-name: doc-${d.id}"></div>
          <div class="doctor__body"><h3>${d.name}</h3><span class="doctor__role">${d.role}</span><p>${d.line}</p></div>
        </article>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow" data-reveal>Always learning</p>
        <h2 class="h2" data-reveal style="--d:1">Training and Dental Conferences</h2>
        <p class="lead" data-reveal style="--d:2">Dr Zaher Safadi at dental trade fairs, and receiving his certificate from the Institute of Dental Excellence.</p>
      </div>
      <div class="strip" data-stagger>
        <img src="img/award-icoi.webp" alt="Dr Zaher Safadi receiving a framed certificate in front of an Institute of Dental Excellence banner" loading="lazy">
        <img src="img/expo-carestream.webp" alt="Dr Zaher Safadi at the Carestream Dental stand at a trade fair" loading="lazy">
        <img src="img/expo-planmeca.webp" alt="Dr Zaher Safadi at a dental trade fair next to the Planmeca stand" loading="lazy">
        <img src="img/dentexpert.webp" alt="Dr Zaher Safadi with a colleague at the DentExpert dental lab" loading="lazy">
      </div>
    </div>
  </section>

  ${cta()}`,
});

pages.push({
  file: 'about-us.html',
  title: 'About Us | Safadi Dental Clinic, Spintex, Accra since 2020',
  description: 'Safadi Medical Hub opened on Spintex Road, Accra in 2020, with dentists and a primary care doctor in one building.',
  body: pageHead('About us', 'A Spintex Clinic <span class="accent">Since 2020</span>', 'Safadi Medical Hub brings dental care and a primary care doctor together in one building at Spintex Plaza.') + `
  <section class="section">
    <div class="container about">
      <div class="about__photos">
        <figure class="rv-photo" style="margin:0"><img src="img/building.webp" alt="The Spintex Plaza building with the green Safadi Medical Hub sign" loading="lazy"></figure>
        <figure class="rv-photo" style="margin:0"><img src="img/room-green.webp" alt="A bright treatment room with a green dental chair" loading="lazy"></figure>
      </div>
      <div>
        <p class="eyebrow" data-reveal>Who we are</p>
        <h2 class="h2" data-reveal style="--d:1">Dentistry and Primary Care in One Place</h2>
        <p data-reveal style="--d:2;margin-top:20px">Our doctors and nurses look after patients from their first check-up to implant surgery. A primary care physician works at the same address, so you can see a dentist and a general doctor without crossing the city.</p>
        <p data-reveal style="--d:3">We explain what we find and the options, and you decide on the treatment.</p>
        <ul class="checks" data-stagger>
          <li>${I.check}Two dental surgeons</li>
          <li>${I.check}An orthodontist</li>
          <li>${I.check}A maxillofacial surgeon</li>
          <li>${I.check}A primary care physician</li>
        </ul>
        <a class="btn btn--primary" href="our-team.html" data-reveal>Meet the doctors ${I.arrow}</a>
      </div>
    </div>
  </section>

  <section class="section section--tint">
    <div class="container">
      <div class="section-head center">
        <p class="eyebrow" data-reveal>Our values</p>
        <h2 class="h2" data-reveal style="--d:1">How the Clinic Works</h2>
      </div>
      <div class="values" data-stagger>
        <div class="value"><span class="value__num">01</span><h3>You decide</h3><p>We explain what we find and the options, and you choose the treatment.</p></div>
        <div class="value"><span class="value__num">02</span><h3>Plain answers</h3><p>You know what a treatment involves before it starts.</p></div>
        <div class="value"><span class="value__num">03</span><h3>Current training</h3><p>Our doctors keep training, and we keep our equipment up to date.</p></div>
        <div class="value"><span class="value__num">04</span><h3>The community</h3><p>Health education and screenings at community events.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container feature">
      <div class="feature__media rv-photo"><img src="img/outreach.webp" alt="Safadi staff checking visitors at a community health screening under a white tent" loading="lazy" style="object-position:50% 35%"></div>
      <div>
        <p class="eyebrow" data-reveal>In the community</p>
        <h2 class="h2" data-reveal style="--d:1">Outreach and Our AfriDoctor Listing</h2>
        <p data-reveal style="--d:2;margin-top:20px">Our staff run health screenings at community events, and the clinic is listed on AfriDoctor, a directory of healthcare providers across Ghana.</p>
        <div class="partner" data-reveal style="--d:3"><img src="img/afridoctor.png" alt="AfriDoctor" width="150" height="47" loading="lazy"><a class="link" href="https://afridoctor.com/" target="_blank" rel="noopener">See AfriDoctor ${I.arrow}</a></div>
      </div>
    </div>
  </section>

  ${cta()}`,
});

const G = (img, cat, alt) => `<a href="img/${img}" data-cat="${cat}"><img src="img/${img}" alt="${alt}" loading="lazy"></a>`;
pages.push({
  file: 'gallery.html',
  title: 'Gallery | Safadi Dental Clinic, Spintex, Accra',
  description: 'Photographs of the Safadi Dental Clinic building, reception, treatment rooms, surgery, doctors and community outreach in Accra.',
  body: pageHead('Gallery', 'Inside <span class="accent">Our Clinic</span>', 'The building at Spintex Plaza, the treatment rooms and theatre, our doctors at work and out in the community.') + `
  <section class="section" data-gallery>
    <div class="container">
      <div class="gallery-filter" role="group" aria-label="Show photographs of">
        <button type="button" data-filter="all" aria-pressed="true">All</button>
        <button type="button" data-filter="clinic" aria-pressed="false">The clinic</button>
        <button type="button" data-filter="care" aria-pressed="false">Treatment</button>
        <button type="button" data-filter="training" aria-pressed="false">Training &amp; awards</button>
        <button type="button" data-filter="community" aria-pressed="false">Community</button>
      </div>
      <div class="masonry">
        ${[
          G('building.webp', 'clinic', 'The Spintex Plaza building with the green Safadi Medical Hub sign'),
          G('surgery.webp', 'care', 'A surgeon and assistant operating on a patient under theatre lights'),
          G('award-icoi.webp', 'training', 'Dr Zaher Safadi receiving a certificate from the Institute of Dental Excellence'),
          G('reception.webp', 'clinic', 'The reception desk and waiting chairs'),
          G('outreach.webp', 'community', 'Safadi staff at a community health screening under a white tent'),
          G('room-green.webp', 'clinic', 'A bright treatment room with a green dental chair'),
          G('expo-carestream.webp', 'training', 'Dr Zaher Safadi at the Carestream Dental stand at a trade fair'),
          G('treatment.webp', 'care', 'A dentist treating a patient in the dental chair'),
          G('award-clinic.webp', 'training', 'Dr Zaher Safadi and a colleague holding a certificate in the clinic'),
          G('surgery-team.webp', 'care', 'Two surgeons in green gowns operating on a patient'),
          G('dentexpert.webp', 'training', 'Dr Zaher Safadi with a colleague at the DentExpert dental lab'),
          G('dr-zaher-desk.webp', 'community', 'Dr Zaher Safadi seated at a conference table'),
          G('award-icoi-2.webp', 'training', 'Dr Zaher Safadi holding a certificate beside a colleague'),
          G('expo-planmeca.webp', 'training', 'Dr Zaher Safadi at a dental trade fair'),
        ].join('\n        ')}
      </div>
    </div>
  </section>

  ${cta()}`,
});

pages.push({
  file: 'contact-us.html',
  title: 'Contact | Safadi Dental Clinic, Spintex Plaza, Accra',
  description: 'Find Safadi Dental Clinic at Spintex Plaza, Spintex Road, Accra. Opening hours, phone, email and directions.',
  body: pageHead('Contact', 'Get in <span class="accent">Touch</span>', 'Spintex Plaza, Spintex Road, Accra. Open Monday to Thursday and Saturday, 8:30 to 17:00.') + `
  <section class="section">
    <div class="container">
      <h2 class="sr-only">Contact details</h2>
      <div class="contact-cards" data-stagger>
        <div class="contact-card"><span class="ic">${I.pin}</span><h3>Visit us</h3><p>Spintex Plaza, Spintex Road, Accra</p><p style="margin-top:8px"><a class="link" href="https://www.google.com/maps/search/?api=1&amp;query=${MAP_Q}" target="_blank" rel="noopener">Get directions ${I.arrow}</a></p></div>
        <div class="contact-card"><span class="ic">${I.phone}</span><h3>Call us</h3><p><a href="${TEL}">${PHONE}</a></p><p>During opening hours</p></div>
        <div class="contact-card"><span class="ic">${I.mail}</span><h3>Email us</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
        <div class="contact-card"><span class="ic">${I.clock}</span><h3>Opening hours</h3>${HOURS}</div>
      </div>
    </div>
  </section>

  <section class="section section--flush-top">
    <div class="container">
      <div class="map rv-photo"><iframe src="https://maps.google.com/maps?q=${MAP_Q}&amp;z=15&amp;output=embed" title="Map of Safadi Medical Hub on Spintex Road, Accra" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
    </div>
  </section>

  ${cta()}`,
});

pages.push({
  file: 'appointment.html',
  title: 'Book an Appointment | Safadi Dental Clinic, Accra',
  description: 'Request an appointment at Safadi Dental Clinic, Spintex Plaza, Accra. We contact you to confirm the day and time.',
  body: pageHead('Appointment', 'Book an <span class="accent">Appointment</span>', `Send the form and we contact you to confirm a day and time, or phone us on ${PHONE}.`) + `
  <section class="section" id="book">
    <div class="container booking">
      <div class="booking__aside">
        <p class="eyebrow" data-reveal>New and returning patients</p>
        <h2 class="h2" data-reveal style="--d:1">Tell Us What You Need</h2>
        <p data-reveal style="--d:2;margin-top:18px">Choose a treatment and a day that suits you. If you are not sure what you need, choose "Not sure yet" and the dentist will look at it with you.</p>
        <div data-reveal style="--d:3">${HOURS}</div>
        <ul class="footer__contact" style="margin-top:28px;color:var(--text)" data-reveal>
          <li>${I.pin}<span><strong style="color:var(--ink)">Clinic location</strong>Spintex Plaza, Spintex Road, Accra</span></li>
          <li>${I.phone}<span><strong style="color:var(--ink)">Call us</strong><a href="${TEL}">${PHONE}</a></span></li>
        </ul>
      </div>
      <div data-reveal="right">
        ${bookingForm()}
      </div>
    </div>
  </section>`,
});

for (const p of pages) {
  const html = head(p) + header(p) + `\n<main id="main">\n  ${p.body}\n</main>\n\n` + footer(p);
  writeFileSync(p.file, html);
  console.log('wrote', p.file);
}
