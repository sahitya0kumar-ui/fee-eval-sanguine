/* ==========================================================================
   dashboard.js — Impact dashboard: counters, bar chart, donor mix donut.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('dashRoot')) return;

  renderDonorSnapshot();

  const stats = DB.stats();
  const setNum = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('data-counter', val);
  };
  setNum('statDonors', stats.totalDonors);
  setNum('statRequests', stats.totalRequests);
  setNum('statBanks', stats.totalBanks);
  setNum('statCamps', stats.upcomingCamps);
  setNum('statUnits', stats.unitsAvailable);
  animateCounters();

  renderGroupBarChart();
  renderRecentRequests();
  renderUpcomingCamps();
});

function renderDonorSnapshot() {
  const mount = document.getElementById('donorSnapshot');
  if (!mount) return;
  const user = DB.read(DB.KEYS.USER);
  const donor = user && user.donorId ? DB.all(DB.KEYS.DONORS).find(d => d.id === user.donorId) : null;

  if (!user) {
    mount.innerHTML = `
      <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:1rem;">
        <div><h3 class="mb-0">Welcome to Sanguine</h3><p class="muted mb-0">Log in or create an account to see your personal donor snapshot here.</p></div>
        <a href="login.html" class="btn btn-primary btn-sm">Log In</a>
      </div>`;
    return;
  }

  if (!donor) {
    mount.innerHTML = `
      <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:1rem;">
        <div><h3 class="mb-0">Hi, ${user.name.split(' ')[0]} 👋</h3><p class="muted mb-0">You don't have a donor profile yet — complete it to appear in donor search results.</p></div>
        <a href="donor.html" class="btn btn-primary btn-sm">Complete Donor Profile</a>
      </div>`;
    return;
  }

  mount.innerHTML = `
    <div class="flex items-center justify-between" style="flex-wrap:wrap;gap:1rem;">
      <div>
        <h3 class="mb-0">Welcome back, ${donor.name.split(' ')[0]} 👋</h3>
        <div class="status-row" style="margin-top:0.5rem;">
          <span class="badge">${donor.bloodGroup}</span>
          <span class="muted">📍 ${donor.city}</span>
          <span class="badge ${donor.available ? 'badge-success' : ''}">${donor.available ? 'Available to donate' : 'Currently unavailable'}</span>
        </div>
      </div>
      <p class="muted mb-0">${donor.donationsCount || 0} donation(s) recorded</p>
    </div>`;
}

function renderGroupBarChart() {
  const wrap = document.getElementById('groupBarChart');
  const labels = document.getElementById('groupBarLabels');
  if (!wrap) return;
  const donors = DB.all(DB.KEYS.DONORS);
  const groups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const counts = groups.map(g => donors.filter(d => d.bloodGroup === g).length);
  const max = Math.max(...counts, 1);

  wrap.innerHTML = counts.map(c =>
    `<div class="bar" data-h="${(c / max) * 100}"><span>${c}</span></div>`
  ).join('');
  if (labels) labels.innerHTML = groups.map(g => `<span>${g}</span>`).join('');

  requestAnimationFrame(() => {
    wrap.querySelectorAll('.bar').forEach(bar => {
      bar.style.height = `${bar.getAttribute('data-h')}%`;
    });
  });
}

function renderRecentRequests() {
  const mount = document.getElementById('recentRequestsTable');
  if (!mount) return;
  const requests = DB.all(DB.KEYS.REQUESTS).slice(0, 6);
  if (!requests.length) {
    mount.innerHTML = `<div class="empty-state"><strong>No requests yet</strong>Emergency blood requests will show up here as they're posted.</div>`;
    return;
  }
  mount.innerHTML = `
    <table class="dash-table">
      <thead><tr><th>Patient</th><th>Group</th><th>Hospital</th><th>Urgency</th></tr></thead>
      <tbody>
        ${requests.map(r => `<tr><td>${r.patient}</td><td>${r.bloodGroup}</td><td>${r.hospital}</td><td><span class="badge ${r.urgency === 'Critical' ? 'badge-urgent' : ''}">${r.urgency}</span></td></tr>`).join('')}
      </tbody>
    </table>`;
}

function renderUpcomingCamps() {
  const mount = document.getElementById('dashCamps');
  if (!mount) return;
  const camps = DB.all(DB.KEYS.CAMPS);
  if (!camps.length) {
    mount.innerHTML = `<div class="empty-state"><strong>No camps scheduled</strong>Check back soon for upcoming donation drives.</div>`;
    return;
  }
  mount.innerHTML = camps.map(c => `
    <div class="card">
      <span class="badge">${new Date(c.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
      <h3 style="margin-top:0.6rem;">${c.title}</h3>
      <p class="muted mb-0">${c.venue}</p>
      <div class="progress-track"><div class="progress-fill" style="width:${Math.round((c.registered / c.seats) * 100)}%"></div></div>
      <p class="muted" style="margin-top:0.4rem;">${c.registered}/${c.seats} seats filled</p>
    </div>`).join('');
}
