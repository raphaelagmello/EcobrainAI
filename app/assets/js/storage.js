// Persistência de projetos (localStorage)
(function () {
  const listEl = document.getElementById('projectsList');
  function loadNames() {
    const store = JSON.parse(localStorage.getItem('eb_store') || '{}');
    const names = Object.keys(store).sort();
    listEl.innerHTML = names.map(n => `<option value="${n}">${n}</option>`).join('');
  }
  function saveCurrent() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) { alert('Informe um nome de projeto.'); return; }
    const data = window.EB_collect();
    const store = JSON.parse(localStorage.getItem('eb_store') || '{}');
    store[name] = data;
    localStorage.setItem('eb_store', JSON.stringify(store));
    loadNames();
    listEl.value = name;
    alert('Projeto salvo localmente.');
    window.EB_updateKPIs();
  }
  function loadSelected() {
    const name = listEl.value;
    const store = JSON.parse(localStorage.getItem('eb_store') || '{}');
    const data = store[name];
    if (!data) return;
    window.EB_fill(data);
    window.EB_updateKPIs();
  }
  function removeSelected() {
    const name = listEl.value;
    if (!name) return;
    const store = JSON.parse(localStorage.getItem('eb_store') || '{}');
    delete store[name];
    localStorage.setItem('eb_store', JSON.stringify(store));
    loadNames();
    alert('Projeto excluído.');
    window.EB_clear();
    window.EB_updateKPIs();
  }
  document.getElementById('saveProject').addEventListener('click', saveCurrent);
  document.getElementById('newProject').addEventListener('click', () => { window.EB_clear(); window.EB_updateKPIs(); });
  document.getElementById('deleteProject').addEventListener('click', removeSelected);
  listEl.addEventListener('change', loadSelected);

  // Config rename/export/print
  document.getElementById('cfgRename').addEventListener('click', () => {
    const oldName = document.getElementById('projectsList').value;
    const newName = document.getElementById('cfgProjectName').value.trim();
    if (!oldName || !newName) { alert('Selecione um projeto e informe um novo nome.'); return; }
    const store = JSON.parse(localStorage.getItem('eb_store') || '{}');
    if (!store[oldName]) { alert('Projeto não encontrado.'); return; }
    store[newName] = store[oldName];
    delete store[oldName];
    localStorage.setItem('eb_store', JSON.stringify(store));
    loadNames();
    document.getElementById('projectsList').value = newName;
    alert('Projeto renomeado.');
  });
  document.getElementById('exportCsv').addEventListener('click', () => window.EB_exportCSV());
  document.getElementById('exportCsv2').addEventListener('click', () => window.EB_exportCSV());
  document.getElementById('printReport').addEventListener('click', () => window.print());
  document.getElementById('printReport2').addEventListener('click', () => window.print());

  // init
  loadNames();
})();