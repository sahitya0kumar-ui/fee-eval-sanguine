/* ==========================================================================
   auth.js — Login / Signup / Forgot-password (front-end only demo).
   Passwords are stored in localStorage in plain text for demo purposes only
   — this is NOT how authentication should work in a real application.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    attachFormValidation(loginForm, {
      email: [Validators.required, Validators.email],
      password: [Validators.required, Validators.minLen(6)]
    }, (data) => {
      const users = DB.all(DB.KEYS.USERS);
      const match = users.find(u => u.email === data.email && u.password === data.password);
      if (!match) {
        showToast('No account matches those details. Try the demo account or sign up.', 'error');
        return;
      }
      DB.write(DB.KEYS.USER, { name: match.name, email: match.email, role: match.role, donorId: match.donorId });
      showToast(`Welcome back, ${match.name.split(' ')[0]}!`, 'success');
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 900);
    });
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    attachFormValidation(signupForm, {
      name: [Validators.required, Validators.minLen(3)],
      email: [Validators.required, Validators.email],
      password: [Validators.required, Validators.minLen(6)],
      confirmPassword: [Validators.required, Validators.match('password', 'passwords')]
    }, (data) => {
      const users = DB.all(DB.KEYS.USERS);
      if (users.some(u => u.email === data.email)) {
        showToast('An account with that email already exists.', 'error');
        return;
      }
      const user = DB.insert(DB.KEYS.USERS, { name: data.name, email: data.email, password: data.password, role: 'donor' });
      DB.write(DB.KEYS.USER, { name: user.name, email: user.email, role: 'donor' });
      showToast('Account created! Let\u2019s finish your donor profile.', 'success');
      setTimeout(() => { window.location.href = 'donor.html'; }, 900);
    });

    const pwInput = signupForm.querySelector('#password');
    const meter = document.getElementById('strengthMeter');
    if (pwInput && meter) {
      pwInput.addEventListener('input', () => {
        const v = pwInput.value;
        const score = [v.length >= 6, /[A-Z]/.test(v), /\d/.test(v), /[^A-Za-z0-9]/.test(v)].filter(Boolean).length;
        [...meter.children].forEach((bar, i) => bar.classList.toggle('on', i < score));
      });
    }
  }

  const forgotForm = document.getElementById('forgotForm');
  if (forgotForm) {
    attachFormValidation(forgotForm, { femail: [Validators.required, Validators.email] }, (data, formEl) => {
      showToast(`If ${data.email} is registered, a reset link has been sent.`, 'success');
      formEl.reset();
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(DB.KEYS.USER);
      showToast('Logged out.', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 700);
    });
  }
});
