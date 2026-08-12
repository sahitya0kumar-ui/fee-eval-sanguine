/* ==========================================================================
   validation.js — Small, composable validators + a form-runner helper.
   Each validator returns '' when valid, or an error message string.
   ========================================================================== */

const Validators = {
  required: (v) => (v && String(v).trim().length ? '' : 'This field is required.'),
  minLen: (n) => (v) => (String(v || '').trim().length >= n ? '' : `Must be at least ${n} characters.`),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || '') ? '' : 'Enter a valid email address.'),
  phone: (v) => (/^[6-9]\d{9}$/.test(String(v || '').trim()) ? '' : 'Enter a valid 10-digit phone number.'),
  numberRange: (min, max) => (v) => {
    const n = Number(v);
    if (Number.isNaN(n)) return 'Enter a valid number.';
    if (n < min || n > max) return `Must be between ${min} and ${max}.`;
    return '';
  },
  match: (otherId, label = 'fields') => (v, form) => {
    const other = form.querySelector(`#${otherId}`);
    return other && other.value === v ? '' : `The ${label} must match.`;
  }
};

/**
 * Wires a <form> so each field validates on blur/submit.
 * fieldRules: { fieldId: [validatorFn, ...] }
 * onValid: called with a plain object of form values when everything passes.
 */
function attachFormValidation(form, fieldRules, onValid) {
  if (!form) return;

  function validateField(id) {
    const input = form.querySelector(`#${id}`);
    if (!input) return true;
    const wrapper = input.closest('.field') || input.parentElement;
    const rules = fieldRules[id] || [];
    let message = '';
    for (const rule of rules) {
      message = rule(input.value, form);
      if (message) break;
    }
    let msgEl = wrapper.querySelector('.error-msg');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'error-msg';
      wrapper.appendChild(msgEl);
    }
    msgEl.textContent = message;
    wrapper.classList.toggle('error', !!message);
    return !message;
  }

  Object.keys(fieldRules).forEach(id => {
    const input = form.querySelector(`#${id}`);
    if (input) input.addEventListener('blur', () => validateField(id));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(fieldRules).map(validateField);
    const isValid = results.every(Boolean);
    if (!isValid) {
      showToast('Please fix the highlighted fields.', 'error');
      const firstError = form.querySelector('.field.error input, .field.error select, .field.error textarea');
      if (firstError) firstError.focus();
      return;
    }
    const data = {};
    new FormData(form).forEach((value, key) => { data[key] = value; });
    onValid(data, form);
  });
}
