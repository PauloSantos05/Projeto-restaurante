/* ============================================================
   YUAN —  Page Scripts
   ============================================================ */

(function () {
  'use strict';

  /* ── Elements ── */
  const form       = document.getElementById('loginForm');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const telefoneInput = document.getElementById('telefone');
  const senhaInput = document.getElementById('senha');
  const nomeError = document.getElementById('nomeError');
  const emailError = document.getElementById('emailError');
  const telefoneError = document.getElementById('telefoneError');
  const senhaError = document.getElementById('senhaError');
  const fieldNome = document.getElementById('fieldNome');
  const fieldEmail = document.getElementById('fieldEmail');
  const fieldTelefone = document.getElementById('fieldTelefone');
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

  // Telefone DDD //
  telefoneInput.addEventListener('input', (event) => {
  let value = event.target.value;
  
  // Remove any character that is not a number
  value = value.replace(/\D/g, "");
  
  // Format to: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
  if (value.length > 0) {
    value = `(${value}`;
  }
  if (value.length > 3) {
    value = `${value.slice(0, 3)}) ${value.slice(3)}`;
  }
  if (value.length > 10) {
    value = `${value.slice(0, 10)}-${value.slice(10, 14)}`;
  }
  
    // Update the input field value
  event.target.value = value;
  });

  /* ── Inline validation helpers ── */
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidTelefone(value) {
    // Strip layout punctuation
    const rawNumbers = value.replace(/\D/g, "");
    
    // Extract and parse the DDD code
    const ddd = parseInt(rawNumbers.substring(0, 2), 10);
    const isValidDDD = ddd >= 11 && ddd <= 99;
    
    // Check Brazilian standards: 10 digits (landline) or 11 digits (mobile)
    const hasValidLength = rawNumbers.length === 10 || rawNumbers.length === 11;
    
    return isValidDDD && hasValidLength;
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
  nomeInput.addEventListener('blur', function () {
    const val = this.value.trim();
    if (!val) {
      setFieldError(fieldNome, nomeError, 'Informe seu nome completo.');
    } else if (!isValidEmail(val)) {
      setFieldError(fieldNome, nomeError, 'Informe seu nome completo.');
    } else {
      clearFieldError(fieldNome, nomeError);
    }
  });

  nomeInput.addEventListener('input', function () {
    if (fieldEmail.classList.contains('field--error')) {
      if (isValidEmail(this.value.trim())) {
        clearFieldError(fieldNome, nomeError);
      }
    }
  });

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

  telefoneInput.addEventListener('blur', function () {
    const val = this.value.trim();
    if (!val) {
      setFieldError(fieldTelefone, telefoneError, 'Informe seu Telefone.');
    } else if (!isValidEmail(val)) {
      setFieldError(fieldTelefone, telefoneError, 'Telefone inválido.');
    } else {
      clearFieldError(fieldTelefone, telefoneError);
    }
  });

  telefoneInput.addEventListener('input', function () {
    if (fieldEmail.classList.contains('field--error')) {
      if (isValidTelefone(this.value.trim())) {
        clearFieldError(fieldTelefone, telefoneError);
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

    /* Validate nome */
    const nomeVal = nomeInput.value.trim();
    if (!nomeVal) {
      setFieldError(fieldNome, nomeError, 'Informe seu nome completo.');
      valid = false;
    } else {
      clearFieldError(fieldNome, nomeError);
    }

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

    /* Validate telefone */
    const telefoneVal = telefoneInput.value.trim();
    if (!telefoneVal) {
      setFieldError(fieldTelefone, telefoneError, 'Informe seu telefone.');
      valid = false;
    } else if (!isValidTelefone(telefoneVal)) {
      setFieldError(fieldTelefone, telefoneError, 'Telefone inválido.');
      valid = false;
    } else {
      clearFieldError(fieldTelefone, telefoneError);
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
      [fieldNome, fieldEmail, fieldTelefone, fieldSenha].forEach(field => {
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

    setTimeout(() => {
      btnEntrar.classList.remove('loading');
      btnEntrar.disabled = false;

      /* ── Replace this block with real authentication logic ── */
      alert(`Login realizado com sucesso!\n\nE-mail: ${emailVal}`);
    }, 1800);
  });

  /* ── Forgot password ── */
  document.querySelector('.forgot-link').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Recurso de recuperação de senha em breve.');
  });

  /* ── Cadastre-se ── */
  document.querySelector('.register-link').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Página de cadastro em breve.');
  });

})();