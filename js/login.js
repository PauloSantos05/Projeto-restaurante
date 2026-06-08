/* ============================================================
   YUAN —  Page Scripts
   ============================================================ */

(function () {
  'use strict';

  /* ── Elements ── */
  const form       = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const senhaInput = document.getElementById('senha');
  const emailError = document.getElementById('emailError');
  const senhaError = document.getElementById('senhaError');
  const fieldEmail = document.getElementById('fieldEmail');
  const fieldSenha = document.getElementById('fieldSenha');
  const toggleBtn  = document.getElementById('toggleSenha');
  const iconEye    = document.getElementById('iconEye');
  const iconEyeOff = document.getElementById('iconEyeOff');
  const btnEntrar  = document.getElementById('btnEntrar');

  /* ── Password visibility toggle ── */
  toggleBtn.addEventListener('click', function () {
    const isPassword = senhaInput.type === 'password';

    senhaInput.type = isPassword ? 'text' : 'password';

    iconEye.classList.toggle('hidden',  isPassword);
    iconEyeOff.classList.toggle('hidden', !isPassword);

    this.setAttribute('aria-label',   isPassword ? 'Ocultar senha' : 'Mostrar senha');
    this.setAttribute('aria-pressed',  isPassword ? 'true' : 'false');

    senhaInput.focus();
  });

  /* ── Inline validation helpers ── */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function setFieldError(field, errorEl, message) {
    field.classList.add('field--error');
    errorEl.textContent = message;
  }

  function clearFieldError(field, errorEl) {
    field.classList.remove('field--error');
    errorEl.textContent = '';
  }

  /* ── Live validation on blur ── */


  emailInput.addEventListener('blur', function () {
    const val = this.value.trim();
    if (!val) {
      setFieldError(fieldEmail, emailError, 'Informe seu e-mail.');
    } else if (!isValidEmail(val)) {
      setFieldError(fieldEmail, emailError, 'E-mail inválido.');
    } else {
      clearFieldError(fieldEmail, emailError);
    }
  });

  emailInput.addEventListener('input', function () {
    if (fieldEmail.classList.contains('field--error')) {
      if (isValidEmail(this.value.trim())) {
        clearFieldError(fieldEmail, emailError);
      }
    }
  });

  senhaInput.addEventListener('blur', function () {
    if (!this.value) {
      setFieldError(fieldSenha, senhaError, 'Informe sua senha.');
    } else {
      clearFieldError(fieldSenha, senhaError);
    }
  });

  senhaInput.addEventListener('input', function () {
    if (fieldSenha.classList.contains('field--error') && this.value) {
      clearFieldError(fieldSenha, senhaError);
    }
  });

  /* ── Ripple effect on button ── */
  btnEntrar.addEventListener('click', function (e) {
    const rect   = this.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height);
    const x      = e.clientX - rect.left  - size / 2;
    const y      = e.clientY - rect.top   - size / 2;

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;

    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  /* ── Form submission ── */
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let valid = true;

    /* Validate email */
    const emailVal = emailInput.value.trim();
    if (!emailVal) {
      setFieldError(fieldEmail, emailError, 'Informe seu e-mail.');
      valid = false;
    } else if (!isValidEmail(emailVal)) {
      setFieldError(fieldEmail, emailError, 'E-mail inválido.');
      valid = false;
    } else {
      clearFieldError(fieldEmail, emailError);
    }

    /* Validate senha */
    const senhaVal = senhaInput.value;
    if (!senhaVal) {
      setFieldError(fieldSenha, senhaError, 'Informe sua senha.');
      valid = false;
    } else {
      clearFieldError(fieldSenha, senhaError);
    }

    if (!valid) {
      /* Shake the errored fields */
      [fieldEmail, fieldSenha].forEach(field => {
        if (field.classList.contains('field--error')) {
          field.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-6px)' },
              { transform: 'translateX(6px)' },
              { transform: 'translateX(-4px)' },
              { transform: 'translateX(4px)' },
              { transform: 'translateX(0)' },
            ],
            { duration: 350, easing: 'ease-in-out' }
          );
        }
      });
      return;
    }

    /* Simulate async login */
    btnEntrar.classList.add('loading');
    btnEntrar.disabled = true;

      fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailVal, senha: senhaVal })
      })
      .then(r => r.json())
      .then(data => {
      btnEntrar.classList.remove('loading');
      btnEntrar.disabled = false;
      if (data.erro) {
      setFieldError(fieldEmail, emailError, data.erro);
      } else {
      window.location.href = 'home.html';
      }
      });
  });

  // /* ── Cadastre-se ── */
  // document.querySelector('.register-link').addEventListener('click', function (e) {
  //   e.preventDefault();
  //   alert('Página de cadastro em breve.');
  // });

})();