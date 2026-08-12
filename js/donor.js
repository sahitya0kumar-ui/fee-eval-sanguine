/* ==========================================================================
   donor.js — Donor registration form + "My Donation History" panel.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('donorForm');
  if (form) {
    attachFormValidation(form, {
      fullName: [Validators.required, Validators.minLen(3)],
      age: [Validators.required, Validators.numberRange(18, 65)],
      weight: [Validators.required, Validators.numberRange(45, 200)],
      phone: [Validators.required, Validators.phone],
      email: [Validators.required, Validators.email],
      address: [Validators.required],
      city: [Validators.required]
    }, (data, formEl) => {
      const bloodGroup = formEl.querySelector('input[name="bloodGroup"]:checked');
      const record = {
        name: data.fullName,
        age: Number(data.age),
        gender: data.gender,
        bloodGroup: bloodGroup ? bloodGroup.value : 'O+',
        weight: Number(data.weight),
        phone: data.phone,
        email: data.email,
        address: data.address,
        city: data.city,
        lastDonation: data.lastDonation || null,
        available: true,
        donationsCount: 0
      };
      DB.insert(DB.KEYS.DONORS, record);
      DB.write(DB.KEYS.USER, { name: record.name, email: record.email, role: 'donor', donorId: record.id });
      showToast(`Thanks, ${record.name.split(' ')[0]}! You're registered as a donor.`, 'success');
      formEl.reset();
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
    });
  }

  renderMyHistory();
});

function renderMyHistory() {
  const mount = document.getElementById('donationHistory');
  if (!mount) return;
  const user = DB.read(DB.KEYS.USER);
  const donor = user && user.donorId ? DB.all(DB.KEYS.DONORS).find(d => d.id === user.donorId) : null;

  if (!donor) {
    mount.innerHTML = `<p class="muted">Register or log in to see your personal donation history here.</p>`;
    return;
  }

  const rows = [
    { date: donor.lastDonation || '—', venue: 'City Life Blood Bank', units: 1 },
    { date: '2025-06-10', venue: 'University Blood Camp', units: 1 }
  ];

  mount.innerHTML = `
    <div class="flex items-center justify-between" style="margin-bottom:1rem;">
      <div><strong>${donor.name}</strong><div class="muted">${donor.bloodGroup} · ${donor.city}</div></div>
      <span class="badge ${donor.available ? 'badge-success' : ''}">${donor.available ? 'Available' : 'Not available'}</span>
    </div>
    <table class="dash-table">
      <thead><tr><th>Date</th><th>Venue</th><th>Units</th></tr></thead>
      <tbody>${rows.map(r => `<tr><td>${r.date}</td><td>${r.venue}</td><td>${r.units}</td></tr>`).join('')}</tbody>
    </table>`;
}
