// Builds the inner pages of the Safadi site from shared parts (head, nav, footer).
// Run from the project folder:  node tools/build-pages.mjs
// index.html is written by hand; edit the shared parts here and run this again for every other page.
import { writeFileSync } from 'node:fs';

const PHONE = '020 229 9995', TEL = 'tel:+233202299995', EMAIL = 'info@safadimedicalservices.com';
const arrow = '<svg class="m-arrow" viewBox="0 0 12 12" aria-hidden="true"><path class="m-arrow__stem" d="M1 6h8"/><path class="m-arrow__head" d="M4.5 2.5 8 6l-3.5 3.5"/></svg>';
const chev = '<svg class="chev" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const BOOK = 'appointment.html#book';

const head = (p) => `<!doctype html>
<html lang="en" data-type="service" data-radius="soft" data-buttons="arrow" data-motion>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:image" content="share.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="favicon.png" type="image/png">
<meta name="theme-color" content="#f7f8f5">
<!-- <link rel="canonical" href="https://safadimedicalservices.com/${p.file}"> : switch on when this build replaces the live site -->
<meta name="site-kind" content="other">
<meta name="page-type" content="service">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/system.css">
<link rel="stylesheet" href="assets/ui/cards.css">
<link rel="stylesheet" href="assets/motion/motion.css">
<link rel="stylesheet" href="assets/backgrounds/backgrounds.css">
<link rel="stylesheet" href="assets/layout/layout.css">
<link rel="stylesheet" href="assets/icons/icon.css">
<style>
:root {
  --p-bg: #f7f8f5; --p-surface: #e9efe7; --p-ink: #15201a; --p-muted: #626a64;
  --p-accent: #1f7a3c; --p-accent-ink: #f7f8f5; --p-action: #1f7a3c; --p-action-ink: #f7f8f5;
  --p-inv-bg: #15201a; --p-inv-surface: #222d26; --p-inv-ink: #f7f8f5; --p-inv-muted: #989e99;
  --p-inv-accent: #1f7a3c; --p-inv-accent-ink: #f7f8f5; --p-inv-action: #1f7a3c; --p-inv-action-ink: #f7f8f5;
  --font-display: "Schibsted Grotesk", system-ui, sans-serif;
  --font-text: "Schibsted Grotesk", system-ui, sans-serif;
  --display-weight: 400;
  --display-tracking: -0.035em;
  --display-tracking-xl: -0.042em;
  --ly-scale: 0.98;
}
</style>
<link rel="stylesheet" href="css/site.css">
<link rel="stylesheet" href="css/motion.css">
<script>document.documentElement.classList.add('m-enter');setTimeout(()=>document.documentElement.classList.add('m-enter-done'),700)</script>
</head>
<body>
`;

const navWord = (href, word, cur) => `<div class="nav__item"><a class="nav__link" href="${href}"${cur === href ? ' aria-current="page"' : ''}>${word}</a></div>`;
const nav = (p) => `<header class="nav">
  <div class="wrap nav__bar">
    <a class="skip-link" href="#top">Skip to content</a>
    <a class="nav__logo" href="index.html"><img src="img/logo.png" alt="Safadi Medical Hub Dental Clinic" width="440" height="119"></a>
    <nav class="nav__links" aria-label="Main">
      <div class="nav__item">
        <a class="nav__link" href="our-services.html"${p.file === 'our-services.html' ? ' aria-current="page"' : ''}>Treatments ${chev}</a>
        <div class="nav__menu">
          <div class="wrap grid">
            <div class="menu-col span-3">
              <p class="t-label">Everyday care</p>
              <a href="our-services.html#general">General dentistry<span>Check-ups and cleaning</span></a>
              <a href="our-services.html#children">Children's dentistry<span>From the first teeth</span></a>
              <a href="our-services.html#emergency">Emergency care<span>Toothache and broken teeth</span></a>
            </div>
            <div class="menu-col span-3">
              <p class="t-label">Specialist care</p>
              <a href="our-services.html#implants">Dental implants<span>Fixed replacement teeth</span></a>
              <a href="our-services.html#orthodontics">Braces and Invisalign<span>Straighter teeth at any age</span></a>
              <a href="our-services.html#cosmetic">Whitening and veneers<span>A brighter, even smile</span></a>
              <a href="our-services.html#restorative">Crowns and bridges<span>Rebuild damaged teeth</span></a>
            </div>
            <a class="menu-card span-3 start-10" href="our-services.html#implants">
              <div class="panel"><img class="frame__img" src="img/surgery-team.webp" alt="Two surgeons in green gowns operating on a patient in the Safadi theatre" loading="lazy"></div>
              <span class="t-card">Implant surgery on site</span>
              <span class="t-small muted">In our own theatre at Spintex Plaza</span>
            </a>
          </div>
        </div>
      </div>
      ${navWord('our-team.html', 'Doctors', p.file)}
      ${navWord('about-us.html', 'Clinic', p.file)}
      ${navWord('gallery.html', 'Gallery', p.file)}
      ${navWord('contact-us.html', 'Contact', p.file)}
    </nav>
    <div class="nav__actions">
      <a class="btn btn--primary" href="${BOOK}">Book an appointment</a>
    </div>
    <button class="nav__toggle" type="button" aria-expanded="false" aria-label="Menu">
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 5h14M2 13h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
    </button>
  </div>
</header>
`;

const footer = (extraScripts = '') => `<footer class="footer closing footer--dark ground-inverse" id="contact" aria-labelledby="close-h">
  <div class="wrap">
    <div class="closing__cta close--type">
      <div class="section-head">
        <h2 id="close-h">Book an appointment</h2>
        <p class="t-small muted">Monday to Thursday and Saturday, 8:30 to 17:00, at Spintex Plaza.</p>
      </div>
      <a class="btn btn--primary btn--xl" href="${BOOK}">Book an appointment${arrow}</a>
    </div>
    <div class="closing__links">
      <div class="grid">
        <div class="span-4 stack-4">
          <a class="footer__mark" href="index.html"><img class="footer__icon" src="favicon.png" alt="" width="48" height="48">Safadi Medical Hub</a>
          <p class="footer__lede">Dental clinic at Spintex Plaza, Spintex Road, Accra.</p>
        </div>
        <div class="span-2 footer__col"><h3>Treatments</h3><ul><li><a href="our-services.html#general">General dentistry</a></li><li><a href="our-services.html#implants">Implants</a></li><li><a href="our-services.html#orthodontics">Braces and Invisalign</a></li><li><a href="our-services.html#children">Children</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Clinic</h3><ul><li><a href="our-team.html">Doctors</a></li><li><a href="about-us.html">About</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="appointment.html">Appointments</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Contact</h3><ul><li><a href="${TEL}">${PHONE}</a></li><li><a href="mailto:${EMAIL}">Email us</a></li><li><a href="contact-us.html">Find us</a></li></ul></div>
        <div class="span-2 footer__col"><h3>Follow</h3><ul><li><a href="https://www.facebook.com/SMHDentalClinic/">Facebook</a></li><li><a href="https://www.instagram.com/safadimedicalhub/">Instagram</a></li><li><a href="https://x.com/hubsafadi">X</a></li><li><a href="https://gh.linkedin.com/company/safadi-mh-dental-clinic">LinkedIn</a></li></ul></div>
      </div>
      <div class="footer__legal">
        <span>&copy; 2026 Safadi Medical Hub</span>
        <div class="socials"></div>
      </div>
    </div>
  </div>
</footer>

<nav class="actionbar" aria-label="Quick actions">
  <a class="btn btn--primary" href="${BOOK}">Book an appointment</a>
</nav>

<script type="module" src="assets/system.js"></script>
<script type="module" src="assets/motion/motion.js"></script>
<script type="module" src="assets/layout/layout.js"></script>
<script type="module" src="js/site-motion.js"></script>${extraScripts}
</body>
</html>
`;

// the inner pages' hero: the dealt split, the words left and one of the client's photographs right
const hero = ({ h1, lead, img, alt, pos = '50% 50%', second }) => `  <section class="hero hero--split" data-enter aria-labelledby="hero-h">
    <div class="wrap"><div class="hero-text grid hero__grid">
      <div class="hero__text span-5">
        <h1 id="hero-h">${h1}</h1>
        <p class="hero__lead">${lead}</p>
        <div class="btn-row"><a class="btn btn--primary" href="${BOOK}">Book an appointment${arrow}</a>${second || ''}</div>
      </div>
      <div class="hero__media span-6 start-7">
        <img src="img/${img}" alt="${alt}" style="--ly-pos: ${pos}" fetchpriority="high" data-source="client" data-subject="clinic">
      </div>
    </div></div>
  </section>
`;

const photo = (img, alt, cls = 'frame frame--photo side-photo span-6 start-7') => `<div class="${cls}"><img class="frame__img" src="img/${img}" alt="${alt}" loading="lazy" data-source="client" data-subject="clinic"></div>`;

const hours = `<dl class="hours" data-tz="Africa/Accra">
            <dt data-days="mon-thu">Monday to Thursday</dt><dd>8:30 to 17:00</dd>
            <dt data-days="fri">Friday</dt><dd>Closed</dd>
            <dt data-days="sat">Saturday</dt><dd>8:30 to 17:00</dd>
            <dt data-days="sun">Sunday</dt><dd>Closed</dd>
          </dl>`;

const form = `<form class="form" action="mailto:${EMAIL}" method="post" enctype="text/plain" data-endpoint="" data-sent="Your appointment request is in. We contact you to confirm the time." novalidate>
            <div class="field"><label for="f-name">Full name</label>
              <input id="f-name" name="name" type="text" autocomplete="name" required aria-describedby="f-name-err">
              <p class="field__error" id="f-name-err" hidden>Write the name the appointment is under.</p></div>
            <div class="field"><label for="f-phone">Phone</label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel" required aria-describedby="f-phone-err">
              <p class="field__error" id="f-phone-err" hidden>Write a phone number we can call you on.</p></div>
          <div class="field field--full"><label for="f-email">Email</label>
            <input id="f-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="f-email-err">
            <p class="field__error" id="f-email-err" hidden>Write an email address with an @, like name@gmail.com.</p></div>
            <div class="field"><label for="f-treatment">Treatment</label>
              <select id="f-treatment" name="treatment" required aria-describedby="f-treatment-err">
                <option value="">Choose a treatment</option>
                <option>Check-up and cleaning</option>
                <option>Dental implants</option>
                <option>Braces or Invisalign</option>
                <option>Whitening or veneers</option>
                <option>Children's dentistry</option>
                <option>Crowns and bridges</option>
                <option>Emergency care</option>
                <option>Primary care doctor</option>
                <option>Not sure yet</option>
              </select>
              <p class="field__error" id="f-treatment-err" hidden>Choose a treatment, or Not sure yet.</p></div>
            <div class="field"><label for="f-day">Preferred day</label>
              <input id="f-day" name="day" type="text" autocomplete="off" required aria-describedby="f-day-err">
              <p class="field__error" id="f-day-err" hidden>Write the day that suits you, for example Tuesday 17 November.</p></div>
          <div class="field field--full"><label for="f-notes">Anything we should know</label>
            <textarea id="f-notes" name="notes" rows="3"></textarea></div>
          <div class="btn-row"><button class="btn btn--primary" type="submit">Book an appointment</button></div>
          <p class="form__status" role="status" data-form-status></p>
          <p class="t-small muted">We reply during opening hours.</p>
        </form>`;

const pages = [];

// ---------- our-services.html
pages.push({
  file: 'our-services.html',
  scripts: '\n<script type="module" src="js/implant3d.js"></script>',
  title: 'Dental treatments: Safadi Dental Clinic, Spintex, Accra',
  description: 'General and children\'s dentistry, implants, crowns, braces, Invisalign, whitening and emergency care at Spintex Plaza, Accra.',
  body: hero({ h1: 'Dental treatments in Spintex, Accra', lead: 'From routine check-ups to implant surgery and Invisalign, every treatment happens at our clinic at Spintex Plaza.', img: 'surgery-team.webp', alt: 'Two Safadi surgeons in green gowns operating on a patient', pos: '45% 50%' }) + `
  <section class="section" id="everyday" aria-labelledby="everyday-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="everyday-h">Everyday dental care</h2><p>For adults and children, from the first visit on.</p></div>
        <ul class="rows">
          <li id="general"><span class="rows__name">General dentistry</span><p>Check-ups, cleaning and preventive care, to find problems early and keep teeth healthy.</p></li>
          <li id="children"><span class="rows__name">Children's dentistry</span><p>Check-ups and preventive care from the first teeth, at a pace that suits the child.</p></li>
          <li id="emergency"><span class="rows__name">Emergency care</span><p>Toothache, a broken tooth or swelling: phone ${PHONE} during opening hours and we see you as soon as we can.</p></li>
        </ul>
      </div>
      ${photo('treatment.webp', 'A Safadi dentist in a mask treating a patient in the dental chair')}
    </div>
  </section>

  <section class="section ground-surface" id="specialist" aria-labelledby="specialist-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="specialist-h">Implants, crowns and bridges</h2><p>Replace missing teeth and rebuild damaged ones, with surgery in our own theatre.</p></div>
        <ul class="rows">
          <li id="implants"><span class="rows__name">Dental implants</span><p>A titanium post in the jaw holds a new tooth that looks and works like your own.</p></li>
          <li id="restorative"><span class="rows__name">Crowns and bridges</span><p>A crown covers a broken or worn tooth; a bridge fills the gap where teeth are missing.</p></li>
          <li><span class="rows__name">Oral surgery</span><p>Extractions and jaw surgery, with Dr Kwaku Bosompem-Acheampong, a specialist maxillofacial surgeon.</p></li>
        </ul>
      </div>
      ${photo('surgery.webp', 'A surgeon and assistant operating on a patient under theatre lights')}
    </div>
  </section>

  <!-- the implant that builds itself: three screens tall, its panel pinned while js/implant3d.js moves the parts -->
  <section class="section" id="implant-build" style="--h: 3" aria-labelledby="implant-build-h">
    <div class="wrap">
      <div class="implant3d__pin">
        <div class="implant3d__text">
          <div class="section-head"><h2 id="implant-build-h">How a dental implant is built</h2><p>Three parts replace one missing tooth, fitted one after another.</p></div>
          <ol class="implant3d__steps">
            <li class="implant3d__step is-active"><h3>The titanium post</h3><p>Placed in the jawbone, where the bone grows around it over the following months. It becomes the tooth's new root.</p></li>
            <li class="implant3d__step"><h3>The abutment</h3><p>A small connector fixed to the post once it has healed. It holds the new tooth.</p></li>
            <li class="implant3d__step"><h3>The crown</h3><p>A new tooth made to match the shape and colour of your own teeth, fixed on top.</p></li>
          </ol>
        </div>
        <div class="implant3d__stage"><img src="img/surgery-team.webp" alt="Two Safadi surgeons in green gowns operating on a patient" loading="lazy"></div>
      </div>
    </div>
  </section>

  <section class="section" id="smile" aria-labelledby="smile-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="smile-h">Braces, Invisalign and whitening</h2><p>Straighter, brighter teeth, planned with you before treatment starts.</p></div>
        <ul class="rows">
          <li id="orthodontics"><span class="rows__name">Braces and Invisalign</span><p>Metal braces with Dr Samuel Addo, our orthodontist, or clear Invisalign aligners with Dr Naa Oyo Glover.</p></li>
          <li id="cosmetic"><span class="rows__name">Whitening and veneers</span><p>Professional whitening, and thin veneers that change the shape and colour of front teeth.</p></li>
        </ul>
      </div>
      ${photo('dr-glover.webp', 'Dr Naa Oyo Glover, dental surgeon, in a white coat', 'frame frame--photo side-photo side-photo--portrait span-6 start-7')}
    </div>
  </section>
`,
});

// ---------- our-team.html
const doc = (id, img, alt, name, role, line) => `<li class="doctor" id="${id}">
            <img style="view-transition-name: doc-${id}" src="img/${img}" alt="${alt}" loading="lazy" data-source="client" data-subject="portrait">
            <div><p class="tile__name">${name}</p><p class="doctor__role">${role}</p><p>${line}</p></div>
          </li>`;
pages.push({
  file: 'our-team.html',
  title: 'Doctors: Safadi Dental Clinic team, Spintex, Accra',
  description: 'Meet the five doctors at Safadi Dental Clinic: dental surgeons, an orthodontist, a maxillofacial surgeon and a primary care physician.',
  body: hero({ h1: 'Doctors at Safadi Dental Clinic, Accra', lead: 'Five doctors: two dental surgeons, an orthodontist, a maxillofacial surgeon and a primary care physician.', img: 'dr-zaher-desk.webp', alt: 'Dr Zaher Safadi seated at a conference table, hands folded', pos: '50% 30%' }) + `
  <section class="section" id="team" style="--hm: 2" aria-labelledby="team-h">
    <div class="wrap">
      <div class="section-head"><h2 id="team-h">The clinic team</h2><p>Each doctor's training, as they list it.</p></div>
      <ul class="doctors">
          ${doc('zaher-safadi', 'dr-zaher.webp', 'Dr Zaher Safadi in a white coat', 'Dr Zaher Safadi', 'Dental surgeon', 'Mastership in aesthetic dentistry, British Academy of Restorative Dentistry.')}
          ${doc('naa-oyo-glover', 'dr-glover.webp', 'Dr Naa Oyo Glover in a white coat', 'Dr Naa Oyo Glover', 'Dental surgeon', 'Invisalign accreditation, 2025.')}
          ${doc('samuel-addo', 'dr-addo.webp', 'Dr Samuel Addo in a light blue coat, arms folded', 'Dr Samuel Addo', 'Orthodontist', 'Diploma in orthodontics and dentofacial orthopaedics, City of London Dental Academy.')}
          ${doc('kwaku-bosompem-acheampong', 'dr-bosompem.webp', 'Dr Kwaku Bosompem-Acheampong speaking into a microphone', 'Dr Kwaku Bosompem-Acheampong', 'Specialist maxillofacial surgeon', 'Also at 37 Military Hospital, Accra.')}
          ${doc('hamza-basheer', 'dr-basheer.webp', 'Dr Hamza Basheer in a navy suit and red tie', 'Dr Hamza Basheer', 'Primary care physician', 'General health check-ups and care at the same clinic.')}
      </ul>
    </div>
  </section>

  <section class="section ground-surface" id="training" aria-labelledby="training-h">
    <div class="wrap">
      <div class="section-head"><h2 id="training-h">Training and dental conferences</h2><p>Dr Zaher Safadi at dental trade fairs and receiving his certificate from the Institute of Dental Excellence.</p></div>
      <div class="grid photo-strip">
        ${photo('award-icoi.webp', 'Dr Zaher Safadi receiving a framed certificate in front of an Institute of Dental Excellence banner', 'frame frame--photo span-3')}
        ${photo('expo-carestream.webp', 'Dr Zaher Safadi at the Carestream Dental stand at a trade fair', 'frame frame--photo span-3')}
        ${photo('expo-planmeca.webp', 'Dr Zaher Safadi at a dental trade fair next to the Planmeca stand', 'frame frame--photo span-3')}
        ${photo('dentexpert.webp', 'Dr Zaher Safadi with a colleague at the DentExpert dental lab', 'frame frame--photo span-3')}
      </div>
    </div>
  </section>
`,
});

// ---------- about-us.html
pages.push({
  file: 'about-us.html',
  title: 'About Safadi Dental Clinic: Spintex, Accra since 2020',
  description: 'Safadi Medical Hub opened on Spintex Road, Accra in 2020, with dentists and a primary care doctor in one building.',
  body: hero({ h1: 'About Safadi Dental Clinic, Spintex', lead: 'Safadi Medical Hub opened on Spintex Road in 2020, with dentists and a primary care doctor in one building.', img: 'building.webp', alt: 'The Spintex Plaza building with the green Safadi Medical Hub sign above the shops', pos: '50% 40%' }) + `
  <section class="section" id="values" aria-labelledby="values-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="values-h">How the clinic works</h2><p>Four things we hold ourselves to with every patient.</p></div>
        <ul class="rows">
          <li><span class="rows__name">You decide</span><p>We explain what we find and the options, and you choose the treatment.</p></li>
          <li><span class="rows__name">Plain answers</span><p>You know what a treatment involves before it starts.</p></li>
          <li><span class="rows__name">Current training</span><p>Our doctors keep training, and we keep our equipment up to date.</p></li>
          <li><span class="rows__name">The community</span><p>Health education and screenings at events around the city.</p></li>
        </ul>
      </div>
      ${photo('reception.webp', 'The reception desk and waiting chairs, with green ceiling panels')}
    </div>
  </section>

  <section class="section ground-surface" id="partners" aria-labelledby="partners-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="partners-h">Outreach and our AfriDoctor listing</h2><p>Our staff run health screenings at community events, and the clinic is listed on AfriDoctor, a directory of healthcare providers across Ghana.</p></div>
        <img class="partner-logo" src="img/afridoctor.png" alt="AfriDoctor" width="220" height="69" loading="lazy">
        <p><a class="link" href="https://afridoctor.com/" target="_blank" rel="noopener">See AfriDoctor</a></p>
      </div>
      ${photo('outreach.webp', 'Safadi staff checking visitors at a community health screening under a white tent', 'frame frame--photo side-photo side-photo--portrait span-6 start-7')}
    </div>
  </section>
`,
});

// ---------- gallery.html
const g = (img, alt, cls = 'span-4') => `<a class="wall__item ${cls}" href="img/${img}"><img src="img/${img}" alt="${alt}" loading="lazy" data-source="client" data-subject="clinic"></a>`;
pages.push({
  file: 'gallery.html',
  title: 'Photos of Safadi Dental Clinic, Spintex, Accra',
  description: 'Photographs of the Safadi Dental Clinic building, reception, treatment rooms, surgery, doctors and community outreach in Accra.',
  body: hero({ h1: 'Photos of Safadi Dental Clinic, Accra', lead: 'The building at Spintex Plaza, the treatment rooms and theatre, our doctors at work and out in the community.', img: 'surgery.webp', alt: 'A surgeon and assistant operating on a patient under theatre lights', pos: '50% 45%' }) + `
  <section class="section" id="rooms" aria-labelledby="rooms-h">
    <div class="wrap">
      <div class="section-head"><h2 id="rooms-h">The clinic building and rooms</h2></div>
      <div class="grid wall">
        ${g('building.webp', 'The Spintex Plaza building with the green Safadi Medical Hub sign')}
        ${g('reception.webp', 'The reception desk and waiting chairs')}
        ${g('room-green.webp', 'A bright treatment room with a green dental chair')}
        ${g('treatment.webp', 'A dentist treating a patient in the dental chair')}
        ${g('surgery-team.webp', 'Two surgeons in green gowns operating on a patient')}
        ${g('dr-zaher-desk.webp', 'Dr Zaher Safadi seated at a conference table')}
      </div>
    </div>
  </section>

  <section class="section ground-surface" id="events" aria-labelledby="events-h">
    <div class="wrap">
      <div class="section-head"><h2 id="events-h">Training, awards and outreach events</h2></div>
      <div class="grid wall wall--tall">
        ${g('award-icoi-2.webp', 'Dr Zaher Safadi holding a certificate beside a colleague', 'span-3')}
        ${g('award-clinic.webp', 'Dr Zaher Safadi and a colleague holding a certificate in the clinic', 'span-3')}
        ${g('expo-carestream.webp', 'Dr Zaher Safadi at the Carestream Dental stand at a trade fair', 'span-3')}
        ${g('outreach.webp', 'Safadi staff at a community health screening under a white tent', 'span-3')}
      </div>
    </div>
  </section>
`,
});

// ---------- contact-us.html
pages.push({
  file: 'contact-us.html',
  title: 'Contact Safadi Dental Clinic: Spintex Plaza, Accra',
  description: 'Find Safadi Dental Clinic at Spintex Plaza, Spintex Road, Accra. Opening hours, phone, email and directions.',
  body: hero({ h1: 'Contact Safadi Dental Clinic, Spintex', lead: 'Spintex Plaza, Spintex Road, Accra. Open Monday to Thursday and Saturday, 8:30 to 17:00.', img: 'building.webp', alt: 'The Spintex Plaza building with the green Safadi Medical Hub sign above the shops', pos: '50% 40%' }) + `
  <section class="section" id="visit" aria-labelledby="visit-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="visit-h">Opening hours and address</h2></div>
        <div class="book-facts">
          <address class="visit__address">Spintex Plaza, Spintex Road<br>Spintex, Accra</address>
          <p><a class="link" href="https://www.google.com/maps/search/?api=1&amp;query=Safadi+Medical+Hub+Spintex+Road+Accra" target="_blank" rel="noopener">Get directions</a></p>
          ${hours}
          <p class="book-contact"><a class="link" href="${TEL}">${PHONE}</a><a class="link" href="mailto:${EMAIL}">${EMAIL}</a></p>
        </div>
      </div>
      ${photo('reception.webp', 'The reception desk and waiting chairs, with green ceiling panels')}
    </div>
  </section>
`,
});

// ---------- appointment.html
pages.push({
  file: 'appointment.html',
  title: 'Book a dental appointment: Safadi Dental Clinic, Accra',
  description: 'Request an appointment at Safadi Dental Clinic, Spintex Plaza, Accra. We contact you to confirm the day and time.',
  body: hero({ h1: 'Book a dental appointment in Spintex', lead: 'Send the form below and we contact you to confirm a day and time, or phone us on ' + PHONE + '.', img: 'room-green.webp', alt: 'A bright Safadi treatment room with a green dental chair and tall windows', pos: '60% 50%' }) + `
  <section class="section" id="book" style="--hm: 2" aria-labelledby="book-h">
    <div class="wrap grid grid--top">
      <div class="span-5">
        <div class="section-head"><h2 id="book-h">Appointment request</h2><p>Tell us what you need and when suits you. New and returning patients welcome.</p></div>
        <div class="book-facts">
          <address class="visit__address">Spintex Plaza, Spintex Road<br>Spintex, Accra</address>
          ${hours}
          <p class="book-contact"><a class="link" href="${TEL}">${PHONE}</a><a class="link" href="mailto:${EMAIL}">${EMAIL}</a></p>
        </div>
      </div>
      <div class="book-form span-6 start-7">
        ${form}
      </div>
    </div>
  </section>
`,
});

for (const p of pages) {
  const html = head(p) + `<!-- type: service. Built by tools/build-pages.mjs from the shared parts; the deal is the home page's (index.html). -->\n` + nav(p) + `\n<main id="top">\n${p.body}</main>\n\n` + footer(p.scripts || '');
  writeFileSync(p.file, html);
  console.log('wrote', p.file);
}
