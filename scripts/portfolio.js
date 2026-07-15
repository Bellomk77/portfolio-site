/* Portfolio Interactions */

/* ── Typing animation ── */
const phrases = [
  'Data Analytics Student',
  'Python & ML Developer',
  'BI & Visualization Expert',
  'Cybersecurity Enthusiast',
];
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const current = phrases[phraseIdx];

  if (deleting) {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx <= 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 420);
      return;
    }
    setTimeout(type, 45);
  } else {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx >= current.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
    setTimeout(type, 75);
  }
}
type();

/* ── Navbar scroll state ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile nav toggle ── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop, bottom = top + sec.offsetHeight;
    const id  = sec.getAttribute('id');
    const link = navLinks.querySelector(`a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < bottom);
  });
}, { passive: true });

/* ── Scroll reveal via IntersectionObserver ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Particle system ── */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 45; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1;
    Object.assign(p.style, {
      left:              Math.random() * 100 + '%',
      top:               Math.random() * 100 + '%',
      width:             size + 'px',
      height:            size + 'px',
      animationDelay:    Math.random() * 8 + 's',
      animationDuration: (Math.random() * 6 + 5) + 's',
      opacity:           (Math.random() * 0.4 + 0.1).toString(),
    });
    container.appendChild(p);
  }
})();

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── Contact form feedback ── */
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
if (form && submitBtn) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });
      if (!res.ok) throw new Error('Send failed');
      submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
      submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      form.reset();
    } catch (err) {
      submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed — try email instead';
      submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
    }
    setTimeout(() => {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 3500);
  });
}
