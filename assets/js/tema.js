
(function () {
  const root = document.documentElement;
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') { root.classList.add('dark'); }
  const yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    const setPressed = () => themeBtn.setAttribute('aria-pressed', root.classList.contains('dark') ? 'true' : 'false');
    setPressed();
    themeBtn.addEventListener('click', () => {
      root.classList.toggle('dark');
      localStorage.setItem('theme', root.classList.contains('dark') ? 'dark' : 'light');
      setPressed();
    });
  }

  const getSize = () => parseFloat(localStorage.getItem('fontScale') || '1');
  const applySize = () => document.body.style.fontSize = (16 * getSize()) + 'px';
  applySize();
  const save = (val) => { localStorage.setItem('fontScale', String(val)); applySize(); };
  const inc = document.getElementById('fontInc');
  const dec = document.getElementById('fontDec');
  if (inc) inc.addEventListener('click', () => save(Math.min(1.5, getSize() + 0.1)));
  if (dec) dec.addEventListener('click', () => save(Math.max(0.8, getSize() - 0.1)));
})();