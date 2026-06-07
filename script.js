/* ── Stars ─────────────────────────────────────────────────── */
(function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = 140;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = (Math.random() * 4 + 2).toFixed(1) + 's';
    const delay = -(Math.random() * 6).toFixed(1) + 's';
    const minOp = (Math.random() * 0.1 + 0.05).toFixed(2);
    const maxOp = (Math.random() * 0.6 + 0.3).toFixed(2);
    s.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      --dur: ${dur};
      --delay: ${delay};
      --min-op: ${minOp};
      --max-op: ${maxOp};
    `;
    container.appendChild(s);
  }
})();

/* ── Nav scroll effect ─────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── Scroll-reveal for feature cards ──────────────────────── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0');
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.feature-card, .perk-card, .step-card').forEach(card => observer.observe(card));

/* ── Command tabs ──────────────────────────────────────────── */
const tabs = document.querySelectorAll('.cmd-tab');
const cards = document.querySelectorAll('.cmd-card');
const searchInput = document.getElementById('cmdSearch');
const noResults = document.getElementById('noResults');
let activeCategory = 'all';

function filterCommands() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  cards.forEach(card => {
    const cat = card.dataset.cat;
    const name = card.querySelector('.cmd-name').textContent.toLowerCase();
    const desc = card.querySelector('.cmd-desc').textContent.toLowerCase();
    const alias = card.querySelector('.cmd-alias').textContent.toLowerCase();
    const matchesCat = activeCategory === 'all' || cat === activeCategory;
    const matchesQuery = !query || name.includes(query) || desc.includes(query) || alias.includes(query);

    if (matchesCat && matchesQuery) {
      card.classList.remove('hidden');
      visible++;
    } else {
      card.classList.add('hidden');
    }
  });

  noResults.style.display = visible === 0 ? 'block' : 'none';
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeCategory = tab.dataset.cat;
    filterCommands();
  });
});

searchInput.addEventListener('input', filterCommands);

/* ── Smooth parallax on hero pfp ──────────────────────────── */
const heroPfp = document.getElementById('pfpWrapper');
document.addEventListener('mousemove', (e) => {
  if (!heroPfp) return;
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  heroPfp.style.transform = `translate(${dx * 6}px, ${dy * 6}px)`;
});

/* ── Button ripple effect ──────────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.25);
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
      transform: scale(0);
      animation: ripple 0.5s linear;
      pointer-events: none;
    `;
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 550);
  });
});

const style = document.createElement('style');
style.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(style);
