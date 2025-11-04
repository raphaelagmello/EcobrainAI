// Checklist de tarefas (grupos + itens)
const TASK_GROUPS = [
  {
    id: 'energia', title: 'Energia', level: 'baixo', items: [
      /* lista de tarefas de energia*/
      'Trocar lâmpadas por LED industrial (IP65)',
      'Instalar sensores de presença em áreas de baixa ocupação',
      'Adequar fator de potência (bancos de capacitores)',
      'Implantar desligamento automático em stand-by',
      'Treinamento de uso racional de energia',
      'Meta mensal de redução por célula de produção'
    ]
  },
  {
    id: 'processo', title: 'Processo', level: 'medio', items: [
      /* lista de tarefas de processo*/
      'Otimização de ciclos térmicos (fornos/estufas)',
      'Recuperação de calor de exaustão',
      'Revisão de layout para reduzir transporte interno',
      'Padronização de set-ups para reduzir perdas',
      'Reaproveitamento de água de processo (onde aplicável)',
      'Controle estatístico de processo (CEP)'
    ]
  },
  {
    id: 'manutencao', title: 'Manutenção', level: 'baixo', items: [
      /* lista de tarefas de manutenção*/
      'Plano de manutenção preditiva (vibração/termografia)',
      'Vedação de vazamentos de ar comprimido',
      'Lubrificação e alinhamento de motores e bombas',
      'Limpeza de trocadores e filtros',
      'Calibração de sensores e medidores críticos',
      'Checklist semanal de anomalias energéticas'
    ]
  },
  {
    id: 'gestao', title: 'Gestão', level: 'alto', items: [
      /* lista de tarefas de gestão*/
      'Instalar medidores setoriais (submetering)',
      'Implementar metas com bonificação por economia',
      'Contratar energia renovável (PPA/mercado livre)',
      'Projeto fotovoltaico on-site (viabilidade/ROI)',
      'Inventário de emissões anual e reporte ESG',
      'Política interna de compras sustentáveis'
    ]
  },
];

/**
 * ** Renderiza o Acordeão de Tarefas **
 * Cria dinamicamente a estrutura de grupos e itens no DOM.
 */

function renderTasks() {
  const acc = document.getElementById('taskAccordion');
  acc.innerHTML = ''; /* Limpa o conteúdo antes de renderizar*/
  /* Cria os grupos (Acordeão)*/
  TASK_GROUPS.forEach(g => {
    const div = document.createElement('div');
    div.className = 'group';
    div.dataset.area = g.id;
    div.dataset.level = g.level;
    div.innerHTML = `<h3><span>${g.title}</span><button class="btn ghost toggle">Abrir</button></h3>
        <div class="content"></div>`;
    const content = div.querySelector('.content');
    g.items.forEach((title, idx) => { /* Cria os itens (Checkboxes) dentro de cada grupo*/
      const id = `task_${g.id}_${idx}`;
      const item = document.createElement('div');
      item.className = 'task-item';
      item.innerHTML = `<input type="checkbox" id="${id}" />
          <label for="${id}"><strong>${title}</strong><br/><small>Área: ${g.title} · Nível: ${g.level}</small></label>`;
      content.appendChild(item);
    });
    acc.appendChild(div);
  });

  /* Toggle groups*/
  /* Lógica para Abrir/Fechar Grupos */
  acc.querySelectorAll('.toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const g = e.target.closest('.group');
      g.classList.toggle('open');
      btn.textContent = g.classList.contains('open') ? 'Fechar' : 'Abrir';
    });
  });

  /* Persist checkboxes*/
  /* Evento para Persistência (Salvar) */
  acc.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', saveTasksState);
  });
}

function saveTasksState() {
  const data = EB_collect(); /* Coleta todos os dados, incluindo o estado atual das tarefas*/
  const store = JSON.parse(localStorage.getItem('eb_store') || '{}');
  if (data.projectName) {
    store[data.projectName] = data;
    localStorage.setItem('eb_store', JSON.stringify(store));
  }
  EB_updateKPIs(); /* Força a atualização dos indicadores*/
}

// Filtro de tarefas
/*Aplica Filtros de Busca e Seleção */
/* Filtra tarefas por termo de busca, área e nível de impacto.*/
function applyTaskFilters() {
  const q = document.getElementById('taskSearch').value.toLowerCase();
  const area = document.getElementById('taskArea').value;
  const level = document.getElementById('taskLevel').value;
  document.querySelectorAll('#taskAccordion .group').forEach(g => {
    const matchArea = !area || g.dataset.area === area;
    const matchLevel = !level || g.dataset.level === level;
    let anyVisible = false;
    g.querySelectorAll('.task-item').forEach(it => {
      const text = it.innerText.toLowerCase();
      const visible = matchArea && matchLevel && (!q || text.includes(q));
      it.style.display = visible ? '' : 'none';
      if (visible) anyVisible = true;
    });
    /* Esconde o grupo se nenhum item dentro dele for visível*/
    g.style.display = anyVisible ? '' : 'none';
  });
}
/* Configuração dos Eventos de Filtro */
document.getElementById('taskSearch').addEventListener('input', applyTaskFilters);
document.getElementById('taskArea').addEventListener('change', applyTaskFilters);
document.getElementById('taskLevel').addEventListener('change', applyTaskFilters);

/* Botão para Limpar Tarefas Concluídas */
document.getElementById('clearDone').addEventListener('click', () => {
  document.querySelectorAll('#taskAccordion input[type="checkbox"]').forEach(c => c.checked = false);
  saveTasksState(); /* Salva o novo estado (limpo)*/
  applyTaskFilters(); /* Re-aplica filtros*/
});
