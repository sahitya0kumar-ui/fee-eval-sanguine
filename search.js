/* ==========================================================================
   search.js — Find Donor page: filter by blood group / city / availability.
   ========================================================================== */

function donorCardHTML(d) {
  return `
  <div class="card donor-card reveal in">
    <span class="badge bg-tag">${d.bloodGroup}</span>
    <h3>${d.name}</h3>
    <div class="meta">
      <span>📍 ${d.city}</span>
      <span>🩸 ${d.donationsCount || 0} donations</span>
    </div>
    <p class="muted mb-0">Last donation: ${d.lastDonation || 'No record yet'}</p>
    <div class="flex gap-sm" style="margin-top:0.4rem;">
      <span class="badge ${d.available ? 'badge-success' : ''}">${d.available ? 'Available now' : 'Currently unavailable'}</span>
    </div>
    <a href="tel:+91${d.phone}" class="btn btn-ghost btn-sm mt-lg" style="align-self:flex-start;">Contact donor</a>
  </div>`;
}

function renderDonors(list) {
  const grid = document.getElementById('donorResults');
  const empty = document.getElementById('donorEmpty');
  if (!grid) return;
  grid.innerHTML = list.map(donorCardHTML).join('');
  if (empty) empty.style.display = list.length ? 'none' : 'block';
}

function applyDonorFilters() {
  const groupEl = document.getElementById('filterGroup');
  const cityEl = document.getElementById('filterCity');
  const availEl = document.getElementById('filterAvailable');
  const group = groupEl ? groupEl.value : '';
  const city = cityEl ? cityEl.value.trim().toLowerCase() : '';
  const onlyAvailable = availEl ? availEl.checked : false;

  const donors = DB.all(DB.KEYS.DONORS).filter(d => {
    const matchGroup = !group || d.bloodGroup === group;
    const matchCity = !city || d.city.toLowerCase().includes(city);
    const matchAvail = !onlyAvailable || d.available;
    return matchGroup && matchCity && matchAvail;
  });
  renderDonors(donors);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('donorResults')) return;
  renderDonors(DB.all(DB.KEYS.DONORS));
  ['filterGroup', 'filterCity', 'filterAvailable'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyDonorFilters);
  });
});
