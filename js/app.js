/* ==========================================================================
   app.js — Shared application shell for every Sanguine page.
   Injects header/footer, wires nav + dark mode + toasts + scroll reveal.
   ========================================================================== */

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'about.html', label: 'About' },
  { href: 'donors.html', label: 'Find Donor' },
  { href: 'request.html', label: 'Request Blood' },
  { href: 'bloodbanks.html', label: 'Blood Banks' },
  { href: 'camps.html', label: 'Camps' },
  { href: 'compatibility.html', label: 'Compatibility' },
  { href: 'dashboard.html', label: 'Dashboard' }
];

function bloodDropMark(size = 26) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2C12 2 5 11.5 5 15.5C5 19.64 8.13 22 12 22C15.87 22 19 19.64 19 15.5C19 11.5 12 2 12 2Z" fill="url(#dropGrad)"/>
    <defs><linearGradient id="dropGrad" x1="5" y1="2" x2="19" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#D90429"/><stop offset="1" stop-color="#8B0015"/>
    </linearGradient></defs>
  </svg>`;
}

function renderHeader() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}"${l.href === path ? ' aria-current="page" style="color:var(--color-ink);font-weight:700"' : ''}>${l.label}</a>`
  ).join('');

  const isLoggedIn = !!DB.read(DB.KEYS.USER);

  return `
  <header class="site-header">
    <nav class="nav container" aria-label="Primary">
      <a href="index.html" class="brand">${bloodDropMark()} Sanguine</a>
      <div class="nav-links" id="navLinks">${links}</div>
      <div class="nav-actions">
        <button class="btn-ghost btn btn-sm" id="darkModeToggle" aria-label="Toggle dark mode" title="Toggle dark mode">🌙</button>
        ${isLoggedIn
          ? `<a href="dashboard.html" class="btn btn-primary btn-sm">My Dashboard</a>`
          : `<a href="login.html" class="btn-ghost btn btn-sm">Log in</a><a href="signup.html" class="btn btn-primary btn-sm">Donate Now</a>`}
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
      </div>
    </nav>
  </header>`;
}

function renderFooter() {
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a href="index.html" class="brand" style="color:#fff;margin-bottom:0.8rem;">${bloodDropMark()} Sanguine</a>
          <p style="color:rgba(255,255,255,0.65);max-width:32ch;">Connecting every drop to every life. A donor network built to make emergency blood requests find an answer in minutes, not days.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <a href="donors.html">Find a Donor</a>
          <a href="request.html">Request Blood</a>
          <a href="bloodbanks.html">Blood Banks</a>
          <a href="camps.html">Donation Camps</a>
        </div>
        <div>
          <h4>Learn</h4>
          <a href="compatibility.html">Compatibility</a>
          <a href="eligibility.html">Eligibility</a>
          <a href="faq.html">FAQ</a>
          <a href="gallery.html">Gallery</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact</a>
          <a href="dashboard.html">Impact Dashboard</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="year"></span> Sanguine. Built for Front-End Engineering-II.</span>
        <span>Made with care — every donor matters.</span>
      </div>
    </div>
  </footer>`;
}

function mountShell() {
  const headerMount = document.getElementById('site-header');
  const footerMount = document.getElementById('site-footer');
  if (headerMount) headerMount.outerHTML = renderHeader();
  if (footerMount) footerMount.outerHTML = renderFooter();
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

function initDarkMode() {
  const btn = document.getElementById('darkModeToggle');
  const prefs = DB.read(DB.KEYS.PREFS) || {};
  if (prefs.dark) document.body.classList.add('dark');
  if (!btn) return;
  btn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  btn.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    btn.textContent = isDark ? '☀️' : '🌙';
    DB.write(DB.KEYS.PREFS, { ...DB.read(DB.KEYS.PREFS), dark: isDark });
  });
}

function showToast(message, type = 'success') {
  let root = document.getElementById('toast-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'toast-root';
    document.body.appendChild(root);
  }
  const icon = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  root.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}

function initLoadingScreen() {
  const screen = document.getElementById('loading-screen');
  if (!screen) return;
  window.addEventListener('load', () => {
    setTimeout(() => screen.classList.add('hide'), 350);
  });
  // Failsafe in case load already fired
  setTimeout(() => screen.classList.add('hide'), 1600);
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || !items.length) {
    items.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

function initAccordions() {
  document.querySelectorAll('.accordion-item .acc-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.accordion-item').classList.toggle('open');
    });
  });
}

function animateCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = Number(el.getAttribute('data-counter')) || 0;
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  mountShell();
  initNavToggle();
  initDarkMode();
  initLoadingScreen();
  initScrollReveal();
  initAccordions();
});
