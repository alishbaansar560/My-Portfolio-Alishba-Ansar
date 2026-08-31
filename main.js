/* ── Skip heavy GSAP scroll animations on mobile ── */
const isMobile = window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

if (!isMobile) {
/* main.js — GSAP ScrollTrigger orchestration (updated) */
gsap.registerPlugin(ScrollTrigger);

// ════════════════════════════════════════
// HERO ENTRANCE
// ════════════════════════════════════════
const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9 }, 0.3);
tl.to('#w-alishba',    { opacity: 1, y: 0, duration: 1.0 }, 0.55);
tl.to('#w-ansar',      { opacity: 1, y: 0, duration: 1.0 }, 0.78);
tl.call(() => { document.getElementById('w-alishba').classList.add('glitch'); }, [], 1.9);
tl.to('.hero-divider', { opacity: 1, scaleX: 1, duration: 0.9 }, 1.05);
tl.to('.hero-sub',     { opacity: 1, y: 0, duration: 0.8 }, 1.25);
tl.to('.hero-cta-row', { opacity: 1, y: 0, duration: 0.7 }, 1.45);
tl.to('.orb', { opacity: 0.75, stagger: 0.15, duration: 0.7, ease: 'back.out(1.4)' }, 1.6);

// ════════════════════════════════════════
// HERO SCROLL-OUT
// ════════════════════════════════════════
gsap.to('#hero .hero-content', {
  scale: 0.88, opacity: 0, y: -50,
  ease: 'power2.in',
  scrollTrigger: {
    trigger: '#hero',
    start: 'center top', end: 'bottom top',
    scrub: 1,
  }
});
gsap.to('.orb', {
  y: -130, stagger: 0.05, ease: 'none',
  scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
});

// ════════════════════════════════════════
// SKILLS SECTION
// ════════════════════════════════════════
ScrollTrigger.create({
  trigger: '#skills',
  start: 'top 78%',
  onEnter: () => {
    gsap.to('#skills .section-head', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    gsap.to('.skills-grid',  { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.25 });
    gsap.from('.skill-pill', { opacity: 0, y: 14, stagger: 0.06, duration: 0.5, ease: 'back.out(1.3)', delay: 0.45 });
    gsap.from('.skill-group', { opacity: 0, y: 24, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.3 });
  }
});

// ════════════════════════════════════════
// PROJECTS SECTION
// ════════════════════════════════════════
ScrollTrigger.create({
  trigger: '#projects',
  start: 'top 80%',
  onEnter: () => {
    gsap.to('.proj-head', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    gsap.to('.pcard', { opacity: 1, y: 0, stagger: 0.14, duration: 0.8, ease: 'power3.out', delay: 0.2 });
  }
});

// Horizontal track
const track     = document.getElementById('proj-track');
const trackWrap = document.getElementById('track-wrap');
gsap.to(track, {
  x: () => -(track.scrollWidth - trackWrap.offsetWidth - 120),
  ease: 'none',
  scrollTrigger: {
    trigger: '#projects',
    pin: true,
    start: 'top top',
    end: () => `+=${track.scrollWidth}`,
    scrub: 0.8,
    invalidateOnRefresh: true,
    anticipatePin: 1,
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

// ════════════════════════════════════════
// CONTACT SECTION
// ════════════════════════════════════════
ScrollTrigger.create({
  trigger: '#contact',
  start: 'top 78%',
  onEnter: () => {
    gsap.to('#contact .section-head', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' });
    gsap.to('.contact-sub',    { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    gsap.to('.contact-links',  { opacity: 1, y: 0, duration: 0.9, delay: 0.35, ease: 'power3.out' });
    gsap.to('.contact-footer', { opacity: 1, y: 0, duration: 0.7, delay: 0.6,  ease: 'power3.out' });
  }
});

// ════════════════════════════════════════
// NAVBAR HIDE / SHOW
// ════════════════════════════════════════
let lastY = 0;
ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => {
    const y = self.scroll();
    if      (y > lastY + 5) gsap.to('#navbar', { yPercent: -100, duration: 0.4, ease: 'power2.in' });
    else if (y < lastY - 5) gsap.to('#navbar', { yPercent:    0, duration: 0.4, ease: 'power2.out' });
    lastY = y;
  }
});

// ════════════════════════════════════════
// SMOOTH NAV LINKS
// ════════════════════════════════════════
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(link.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});

window.addEventListener('resize', () => ScrollTrigger.refresh());
} // end desktop-only block

/* ── Simple mobile fade-in (always runs) ── */
if (isMobile) {
  gsap.registerPlugin(ScrollTrigger);
  // Just make everything visible immediately
  gsap.set(['.hero-eyebrow','.name-word','.hero-divider','.hero-sub','.hero-cta-row','.orb'], { clearProps: 'all' });
  document.querySelectorAll('.name-word').forEach(el => {
    el.style.opacity = '1'; el.style.transform = 'none';
  });
  document.querySelector('.hero-eyebrow').style.opacity = '1';
  document.querySelector('.hero-eyebrow').style.transform = 'none';
  document.querySelector('.hero-divider').style.opacity = '1';
  document.querySelector('.hero-divider').style.transform = 'none';
  document.querySelector('.hero-sub').style.opacity = '1';
  document.querySelector('.hero-sub').style.transform = 'none';
  document.querySelector('.hero-cta-row').style.opacity = '1';
  document.querySelector('.hero-cta-row').style.transform = 'none';

  // Animate sections in on scroll simply
  document.querySelectorAll('.section-head, .skills-grid, .pcard, .contact-sub, .contact-links, .contact-footer').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
  document.querySelector('.proj-head').style.opacity = '1';
  document.querySelector('.proj-head').style.transform = 'none';
}