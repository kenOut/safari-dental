// Safadi site behaviour, every page.
import Lenis from '../assets/vendor/lenis.mjs';

const root = document.documentElement;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('js');

// ---------- header: solid once the page moves; the phone menu ----------
const header = document.querySelector('.header');
const setSolid = () => header && header.classList.toggle('is-solid', scrollY > 24 || header.classList.contains('menu-open'));
addEventListener('scroll', setSolid, { passive: true });
setSolid();

const menuBtn = document.querySelector('.menu-btn');
let lenis = null;
menuBtn?.addEventListener('click', () => {
  const open = !header.classList.contains('menu-open');
  header.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
  open ? lenis?.stop() : lenis?.start();
  setSolid();
});
document.querySelectorAll('.nav a').forEach((a) => a.addEventListener('click', () => {
  if (!header.classList.contains('menu-open')) return;
  header.classList.remove('menu-open'); menuBtn.setAttribute('aria-expanded', 'false'); document.body.style.overflow = ''; lenis?.start();
}));
addEventListener('keydown', (e) => { if (e.key === 'Escape' && header.classList.contains('menu-open')) menuBtn.click(); });

// ---------- smooth scrolling ----------
if (!reduced) {
  lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -90 } });
  window.__lenis = lenis;
}

// ---------- hero headline: its words (wrapped in the HTML) rise once the page has loaded ----------
root.classList.add('site-ready');
requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-loaded')));

// ---------- reveals ----------
const io = new IntersectionObserver((entries) => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
document.querySelectorAll('[data-reveal], .rv-photo').forEach((el) => io.observe(el));
// cards in a grid reveal one after another
document.querySelectorAll('[data-stagger]').forEach((grid) => {
  [...grid.children].forEach((c, i) => { c.setAttribute('data-reveal', c.getAttribute('data-reveal') || ''); c.style.setProperty('--d', i % 5); io.observe(c); });
});

// ---------- count up the figures in .stat once they show ----------
const counter = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    counter.unobserve(e.target);
    const el = e.target, end = Number(el.dataset.count), start = Number(el.dataset.from || 0);
    if (reduced || !Number.isFinite(end)) continue;
    const t0 = performance.now(), dur = 1600;
    const tick = (now) => { const t = Math.min(1, (now - t0) / dur), k = 1 - Math.pow(1 - t, 3); el.textContent = Math.round(start + (end - start) * k) + (el.dataset.suffix || ''); if (t < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach((el) => counter.observe(el));

// ---------- the clinic film: the poster turns into the YouTube player on a click ----------
document.querySelectorAll('.film[data-youtube]').forEach((film) => {
  film.querySelector('.film__play')?.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${film.dataset.youtube}?autoplay=1&rel=0`;
    f.title = 'Safadi Medical Hub clinic film';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    film.replaceChildren(f);
  });
});

// ---------- testimonials: arrows scroll the row one card at a time ----------
document.querySelectorAll('[data-quotes]').forEach((wrap) => {
  const row = wrap.querySelector('.quotes');
  const step = () => (row.querySelector('.quote')?.offsetWidth || 300) + 24;
  wrap.querySelector('[data-prev]')?.addEventListener('click', () => row.scrollBy({ left: -step(), behavior: 'smooth' }));
  wrap.querySelector('[data-next]')?.addEventListener('click', () => row.scrollBy({ left: step(), behavior: 'smooth' }));
});

// ---------- gallery: filter buttons and a simple enlarged view ----------
document.querySelectorAll('[data-gallery]').forEach((gal) => {
  const items = [...gal.querySelectorAll('.masonry a')];
  gal.querySelectorAll('.gallery-filter button').forEach((b, _, all) => b.addEventListener('click', () => {
    all.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.filter;
    items.forEach((a) => { a.hidden = f !== 'all' && a.dataset.cat !== f; });
  }));
  const box = document.createElement('div'); box.className = 'lightbox'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photograph');
  box.innerHTML = '<img alt=""><button type="button" aria-label="Close"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
  document.body.append(box);
  const img = box.querySelector('img'), close = () => { box.classList.remove('is-open'); lenis?.start(); };
  items.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const i = a.querySelector('img'); img.src = a.href; img.alt = i.alt; box.classList.add('is-open'); lenis?.stop(); box.querySelector('button').focus(); }));
  box.addEventListener('click', (e) => { if (e.target !== img) close(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
});

// ---------- opening hours: mark today (Accra time) ----------
document.querySelectorAll('.hours[data-tz]').forEach((dl) => {
  const day = new Intl.DateTimeFormat('en-GB', { weekday: 'short', timeZone: dl.dataset.tz }).format(new Date()).toLowerCase().slice(0, 3);
  dl.querySelectorAll('dt[data-days]').forEach((dt) => {
    if (dt.dataset.days.split(',').includes(day)) { dt.classList.add('is-today'); dt.nextElementSibling?.classList.add('is-today'); }
  });
});

// ---------- the booking form: check the fields, then open the email to the clinic ----------
document.querySelectorAll('form[data-booking]').forEach((form) => {
  const status = form.querySelector('.form__status');
  form.addEventListener('submit', (e) => {
    let first = null, bad = 0;
    form.querySelectorAll('[required]').forEach((input) => {
      const field = input.closest('.field'), err = field.querySelector('.field__error');
      const ok = input.type === 'email' ? /\S+@\S+\.\S+/.test(input.value) : input.value.trim() !== '';
      field.setAttribute('aria-invalid', String(!ok)); err.hidden = ok;
      if (!ok) { bad++; first = first || input; }
    });
    if (bad) { e.preventDefault(); status.textContent = bad === 1 ? 'One field needs your attention.' : `${bad} fields need your attention.`; first.focus(); return; }
    // without a form service the request goes as an email from the visitor's own mail app
    e.preventDefault();
    const data = new FormData(form), lines = [];
    for (const [k, v] of data) if (String(v).trim()) lines.push(`${form.querySelector(`[name="${k}"]`).closest('.field').querySelector('label').textContent}: ${v}`);
    location.href = `mailto:${form.dataset.to}?subject=${encodeURIComponent('Appointment request: ' + (data.get('treatment') || 'dental visit'))}&body=${encodeURIComponent(lines.join('\n'))}`;
    status.textContent = 'Your email app is opening with the request filled in. Press send to reach the clinic.';
  });
});
