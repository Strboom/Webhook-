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

/* ── Hamburger menu ────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── Chat Widget ───────────────────────────────────────────── */
// After deploying the Replit API server, replace this URL with your deployed URL
// e.g. https://your-app.replit.app/api/chat
const CHAT_API_URL = 'https://chatonyx.vercel.app/api/chat';

(function () {
  const toggle    = document.getElementById('chatToggle');
  const panel     = document.getElementById('chatPanel');
  const messages  = document.getElementById('chatMessages');
  const input     = document.getElementById('chatInput');
  const sendBtn   = document.getElementById('chatSend');
  const iconOpen  = document.getElementById('chatIconOpen');
  const iconClose = document.getElementById('chatIconClose');

  if (!toggle || !panel) return;

  const history = [];

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    iconOpen.style.display  = isOpen ? 'none'  : 'block';
    iconClose.style.display = isOpen ? 'block' : 'none';
    if (isOpen) { input.focus(); scrollChat(); }
  });

  function scrollChat() {
    messages.scrollTop = messages.scrollHeight;
  }

  function addMsg(role, text) {
    const wrap = document.createElement('div');
    wrap.className = `chat-msg ${role}`;
    if (role === 'bot') {
      const avatar = document.createElement('img');
      avatar.src = 'onyx.jpg';
      avatar.alt = 'Onyx';
      avatar.className = 'chat-avatar';
      wrap.appendChild(avatar);
    }
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    messages.appendChild(wrap);
    scrollChat();
    return wrap;
  }

  function showTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg bot';
    wrap.id = 'chatTyping';
    const avatar = document.createElement('img');
    avatar.src = 'onyx.jpg';
    avatar.alt = 'Onyx';
    avatar.className = 'chat-avatar';
    wrap.appendChild(avatar);
    const dots = document.createElement('div');
    dots.className = 'chat-typing';
    dots.innerHTML = '<span></span><span></span><span></span>';
    wrap.appendChild(dots);
    messages.appendChild(wrap);
    scrollChat();
  }

  function removeTyping() {
    const el = document.getElementById('chatTyping');
    if (el) el.remove();
  }

  async function sendMessage() {
    const text = input.value.trim();
    if (!text || sendBtn.disabled) return;

    input.value = '';
    sendBtn.disabled = true;
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    showTyping();

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-6) }),
      });
      const data = await res.json();
      removeTyping();
      const reply = data.reply || data.error || 'Something went wrong. Try again!';
      addMsg('bot', reply);
      history.push({ role: 'assistant', content: reply });
      if (history.length > 20) history.splice(0, 2);
    } catch {
      removeTyping();
      addMsg('bot', 'Could not connect. Make sure the server is deployed!');
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
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
