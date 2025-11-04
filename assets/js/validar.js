
(function () {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const shown = nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', shown ? 'true' : 'false');
    });
  }
  // Contato validation
  const form = document.getElementById('contatoForm');
  const feedback = document.getElementById('formFeedback');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      const errors = [];
      if (!data.nome || data.nome.trim().length < 2) errors.push('Nome muito curto.');
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push('E-mail inválido.');
      if (!data.mensagem || data.mensagem.trim().length < 10) errors.push('Mensagem muito curta.');
      if (errors.length) {
        feedback.textContent = errors.join(' ');
        feedback.classList.remove('ok');
        feedback.classList.add('error');
        form.querySelector('[name="nome"]').focus();
        return;
      }
      const list = JSON.parse(localStorage.getItem('contatos') || '[]');
      list.push({ ...data, ts: new Date().toISOString() });
      localStorage.setItem('contatos', JSON.stringify(list));
      feedback.textContent = 'Mensagem registrada localmente! (simulação)';
      feedback.classList.add('ok');
      form.reset();
    });
  }
})();