/* main.js — GSAP ScrollTrigger orchestration */
gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   MOBILE — skip all GSAP, show everything flat
══════════════════════════════════════════════ */
const isMobile = window.innerWidth <= 768 ||
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (isMobile) {
  // Force all animated elements visible immediately
  const toShow = document.querySelectorAll(
    '.hero-eyebrow, .name-word, .hero-divider, .hero-sub,' +
    '.hero-cta-row, .section-head, .skills-grid, .proj-head,' +
    '.pcard, .contact-sub, .contact-links, .contact-footer, .orb'
  );
  toShow.forEach(el => {
    el.style.cssText += 'opacity:1!important;transform:none!important;';
  });

  // Also kill the GSAP pinning for proj-track
  document.getElementById('proj-track').style.transform = 'none';

  // Stop here — no GSAP on mobile
  // (everything is visible via CSS + inline styles above)
} else {

/* ══════════════════════════════════════════════
   DESKTOP — full GSAP animations
══════════════════════════════════════════════ */

// ─── Hero entrance ───
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9 }, 0.3);
tl.to('#w-alishba',    { opacity: 1, y: 0, duration: 1.0 }, 0.55);
tl.to('#w-ansar',      { opacity: 1, y: 0, duration: 1.0 }, 0.78);
tl.call(() => { document.getElementById('w-alishba').classList.add('glitch'); }, [], 1.9);
tl.to('.hero-divider', { opacity: 1, scaleX: 1, duration: 0.9 }, 1.05);
tl.to('.hero-sub',     { opacity: 1, y: 0, duration: 0.8 }, 1.25);
tl.to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.7 }, 1.45);
tl.to('.orb', { opacity: 0.75, stagger: 0.15, duration: 0.7, ease: 'back.out(1.4)' }, 1.6);

// ─── Hero scroll-out ───
gsap.to('#hero .hero-content', {
  scale: 0.88, opacity: 0, y: -50, ease: 'power2.in',
  scrollTrigger: { trigger: '#hero', start: 'center top', end: 'bottom top', scrub: 1 }
});
gsap.to('.orb', {
  y: -130, stagger: 0.05, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});

// ─── Skills ───
ScrollTrigger.create({
  trigger: '#skills', start: 'top 78%',
  onEnter: () => {
    gsap.to('#skills .section-head', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    gsap.to('.skills-grid', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 });
    gsap.from('.skill-group', { opacity: 0, y: 24, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.3 });
    gsap.from('.skill-pill',  { opacity: 0, y: 14, stagger: 0.06, duration: 0.5, ease: 'back.out(1.3)', delay: 0.45 });
  }
});

// ─── Projects ───
ScrollTrigger.create({
  trigger: '#projects', start: 'top 80%',
  onEnter: () => {
    gsap.to('.proj-head', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    gsap.to('.pcard', { opacity: 1, y: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out', delay: 0.2 });
  }
});

// Horizontal track pinning
const track     = document.getElementById('proj-track');
const trackWrap = document.getElementById('track-wrap');
gsap.to(track, {
  x: () => -(track.scrollWidth - trackWrap.offsetWidth - 120),
  ease: 'none',
  scrollTrigger: {
    trigger: '#projects', pin: true,
    start: 'top top', end: () => `+=${track.scrollWidth}`,
    scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
  }
});

// Card cursor glow
document.querySelectorAll('.pcard').forEach(card => {
  const glow = card.querySelector('.pcard-glow');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
    glow.style.background = `radial-gradient(ellipse at ${x}% ${y}%, rgba(143,188,143,0.2) 0%, transparent 65%)`;
  });
});

// ─── Contact ───
ScrollTrigger.create({
  trigger: '#contact', start: 'top 78%',
  onEnter: () => {
    gsap.to('#contact .section-head', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    gsap.to('.contact-sub',    { opacity: 1, y: 0, duration: 0.8, delay: 0.2  });
    gsap.to('.contact-links',  { opacity: 1, y: 0, duration: 0.9, delay: 0.35 });
    gsap.to('.contact-footer', { opacity: 1, y: 0, duration: 0.7, delay: 0.6  });
  }
});

// ─── Navbar hide/show ───
let lastY = 0;
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => {
    const y = self.scroll();
    if      (y > lastY + 5) gsap.to('#navbar', { yPercent: -100, duration: 0.4, ease: 'power2.in'  });
    else if (y < lastY - 5) gsap.to('#navbar', { yPercent:    0, duration: 0.4, ease: 'power2.out' });
    lastY = y;
  }
});

// ─── Smooth nav links ───
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(link.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('resize', () => ScrollTrigger.refresh());

} // end desktop block