// Smooth scrolling and the reveals on every page.
// - Lenis eases the wheel and touch scroll (anchors included).
// - Each section heading rises word by word as it enters; the line under it fades up.
// - Photographs come into focus (a blur and a slight zoom settle) as they enter.
// - List rows, questions and doctor rows settle in one after another.
// Everything is shown as written when the visitor asks for reduced motion, and without this script.
import Lenis from '../assets/vendor/lenis.mjs';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } });
  window.__lenis = lenis;
  // the nav sheet on a phone locks the body: let it scroll on its own while it is open
  new MutationObserver(() => (document.body.classList.contains('nav-locked') ? lenis.stop() : lenis.start()))
    .observe(document.body, { attributes: true, attributeFilter: ['class'] });
  setupReveals();
}

function setupReveals() {
  const root = document.documentElement;
  root.classList.add('rv-on');

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });

  // headings: wrap each word in a mask so it can rise into place
  const heads = document.querySelectorAll('main section:not(.hero) h2, footer.closing h2');
  heads.forEach((h) => {
    if (h.closest('[data-moment]')) return;
    let i = 0;
    const walk = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) { frag.append(part); continue; }
            const mask = document.createElement('span'); mask.className = 'rv-w';
            const word = document.createElement('span'); word.textContent = part; word.style.setProperty('--i', i++);
            mask.append(word); frag.append(mask);
          }
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      }
    };
    walk(h);
    h.classList.add('rv-head');
    io.observe(h);
  });

  // the line under a heading
  document.querySelectorAll('main section:not(.hero) .section-head > p, main section:not(.hero) .section-head > div > p').forEach((p) => {
    if (p.closest('[data-moment]')) return;
    p.classList.add('rv-fade'); io.observe(p);
  });

  // photographs come into focus; the hover zoom takes over once they have settled
  document.querySelectorAll('main section:not(.hero) :is(.frame__img, .tile__media > img, .wall__item > img, .doctor > img)').forEach((img) => {
    if (img.closest('[data-moment]')) return;
    img.classList.add('rv-photo');
    img.addEventListener('transitionend', function done(ev) {
      if (ev.propertyName !== 'filter') return;
      img.classList.remove('rv-photo', 'is-in'); img.removeEventListener('transitionend', done);
    });
    io.observe(img);
  });

  // rows settle in one after another
  document.querySelectorAll('main section:not(.hero) :is(.rows, .faq, .doctors, .hours)').forEach((list) => {
    if (list.closest('[data-moment]')) return;
    [...list.children].forEach((row, i) => { row.classList.add('rv-row'); row.style.setProperty('--i', i); });
    list.classList.add('rv-list'); io.observe(list);
  });
}
