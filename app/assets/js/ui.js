// Tabs, theme and basic UI helpers
(function(){
  const $ = (s, r=document)=>r.querySelector(s);
  const $$ = (s, r=document)=>Array.from(r.querySelectorAll(s));

  // Tabs
  $$('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $$('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      $$('.tab').forEach(t=>t.classList.remove('active'));
      $('#tab-'+tab).classList.add('active');
    });
  });

  // Theme
  const root=document.documentElement;
  const themeBtn=$('#themeToggle');
  const th=localStorage.getItem('eb_theme');
  if(th==='dark') root.classList.add('dark');
  const setPressed=()=>themeBtn && themeBtn.setAttribute('aria-pressed', root.classList.contains('dark')?'true':'false');
  setPressed();
  if(themeBtn){
    themeBtn.addEventListener('click',()=>{
      root.classList.toggle('dark');
      localStorage.setItem('eb_theme', root.classList.contains('dark')?'dark':'light');
      setPressed();
    });
  }
})();