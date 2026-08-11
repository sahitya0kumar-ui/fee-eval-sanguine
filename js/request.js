/* ==========================================================================
   request.js — Emergency blood request form + live requests feed.
   ========================================================================== */

function requestCardHTML(r) {
  const urgencyClass = r.urgency === 'Critical' ? 'badge-urgent' : '';
  return `
  <div class="card reveal in">
    <div class="flex items-center justify-between">
      <h3 class="mb-0">${r.patient}</h3>
      <span class="badge ${urgencyClass}">${r.urgency}</span>
    </div>
    <p class="muted" style="margin-top:0.4rem;">${r.hospital} · ${r.city}</p>
    <div class="flex gap-sm items-center" style="margin:0.6rem 0;">
      <span class="badge">${r.bloodGroup}</span>
      <span class="muted">${r.units} unit(s) needed</span>
    </div>
    <a href="tel:${r.contact}" class="btn btn-primary btn-sm">Call to help</a>
  </div>`;
}

function renderRequests() {
  const mount = document.getElementById('requestFeed');
  if (!mount) return;
  const requests = DB.all(DB.KEYS.REQUESTS);
  mount.innerHTML = requests.map(requestCardHTML).join('') || '<p class="muted">No active requests right now.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
  renderRequests();
  const form = document.getElementById('requestForm');
  if (!form) return;

  attachFormValidation(form, {
    patient: [Validators.required, Validators.minLen(2)],
    hospital: [Validators.required],
    units: [Validators.required, Validators.numberRange(1, 20)],
    contact: [Validators.required, Validators.phone],
    city: [Validators.required]
  }, (data, formEl) => {
    const bloodGroup = formEl.querySelector('input[name="bloodGroup"]:checked');
    const urgency = formEl.querySelector('input[name="urgency"]:checked');
    DB.insert(DB.KEYS.REQUESTS, {
      patient: data.patient,
      bloodGroup: bloodGroup ? bloodGroup.value : 'O+',
      hospital: data.hospital,
      units: Number(data.units),
      contact: data.contact,
      city: data.city,
      urgency: urgency ? urgency.value : 'Moderate'
    });
    showToast('Request posted. Nearby donors will be notified.', 'success');
    formEl.reset();
    renderRequests();
    document.getElementById('requestFeed')?.scrollIntoView({ behavior: 'smooth' });
  });
});
