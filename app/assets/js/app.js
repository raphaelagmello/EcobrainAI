// Cálculo, tarefas e relatórios
(function(){
  const $ = (id)=>document.getElementById(id);

  function number(id){ return parseFloat($(id).value||'0')||0; }

  function calc(){
    const electricity = number('electricity');
    const gas = number('gas');
    const diesel = number('diesel');
    const fe_e = number('fe_electricity');
    const fe_g = number('fe_gas');
    const fe_d = number('fe_diesel');

    const ele_kg = electricity * fe_e;
    const gas_kg = gas * fe_g;
    const diesel_kg = diesel * fe_d;

    const scope2_kg = ele_kg;
    const scope1_kg = gas_kg + diesel_kg;
    const total_kg = scope1_kg + scope2_kg;

    const production = number('production');
    const intensity = production>0 ? (total_kg/production) : 0;

    $('scope1').textContent = (scope1_kg/1000).toFixed(2) + ' t';
    $('scope2').textContent = (scope2_kg/1000).toFixed(2) + ' t';
    $('totalKg').textContent = total_kg.toFixed(2);
    $('kpiTotal').textContent = (total_kg/1000).toFixed(2) + ' t';
    $('kpiIntensity').textContent = intensity.toFixed(3);

    const max = Math.max(ele_kg, gas_kg, diesel_kg, 1);
    $('barEle').style.width = (ele_kg/max*100).toFixed(0)+'%';
    $('barGas').style.width = (gas_kg/max*100).toFixed(0)+'%';
    $('barDiesel').style.width = (diesel_kg/max*100).toFixed(0)+'%';
    // Report table
    const rows = [
      ['Eletricidade (kWh)', electricity, fe_e+' kg/kWh', ele_kg.toFixed(2)],
      ['Gás natural (m³)', gas, fe_g+' kg/m³', gas_kg.toFixed(2)],
      ['Diesel (L)', diesel, fe_d+' kg/L', diesel_kg.toFixed(2)]
    ];
    const body = document.getElementById('reportBody');
    body.innerHTML = rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('');
    document.getElementById('reportTotal').textContent = total_kg.toFixed(2);

    return { ele_kg, gas_kg, diesel_kg, scope1_kg, scope2_kg, total_kg, intensity };
  }

  // Checklist de tarefas (grupos + itens)
  const TASK_GROUPS = [
    { id:'energia', title:'Energia', level:'baixo', items:[
      'Trocar lâmpadas por LED industrial (IP65)',
      'Instalar sensores de presença em áreas de baixa ocupação',
      'Adequar fator de potência (bancos de capacitores)',
      'Implantar desligamento automático em stand-by',
      'Treinamento de uso racional de energia',
      'Meta mensal de redução por célula de produção'
    ]},
    { id:'processo', title:'Processo', level:'medio', items:[
      'Otimização de ciclos térmicos (fornos/estufas)',
      'Recuperação de calor de exaustão',
      'Revisão de layout para reduzir transporte interno',
      'Padronização de set-ups para reduzir perdas',
      'Reaproveitamento de água de processo (onde aplicável)',
      'Controle estatístico de processo (CEP)'
    ]},
    { id:'manutencao', title:'Manutenção', level:'baixo', items:[
      'Plano de manutenção preditiva (vibração/termografia)',
      'Vedação de vazamentos de ar comprimido',
      'Lubrificação e alinhamento de motores e bombas',
      'Limpeza de trocadores e filtros',
      'Calibração de sensores e medidores críticos',
      'Checklist semanal de anomalias energéticas'
    ]},
    { id:'gestao', title:'Gestão', level:'alto', items:[
      'Instalar medidores setoriais (submetering)',
      'Implementar metas com bonificação por economia',
      'Contratar energia renovável (PPA/mercado livre)',
      'Projeto fotovoltaico on-site (viabilidade/ROI)',
      'Inventário de emissões anual e reporte ESG',
      'Política interna de compras sustentáveis'
    ]},
  ];

  function renderTasks(){
    const acc = document.getElementById('taskAccordion');
    acc.innerHTML='';
    TASK_GROUPS.forEach(g=>{
      const div = document.createElement('div');
      div.className='group';
      div.dataset.area = g.id;
      div.dataset.level = g.level;
      div.innerHTML = `<h3><span>${g.title}</span><button class="btn ghost toggle">Abrir</button></h3>
        <div class="content"></div>`;
      const content = div.querySelector('.content');
      g.items.forEach((title, idx)=>{
        const id = `task_${g.id}_${idx}`;
        const item = document.createElement('div');
        item.className = 'task-item';
        item.innerHTML = `<input type="checkbox" id="${id}" />
          <label for="${id}"><strong>${title}</strong><br/><small>Área: ${g.title} · Nível: ${g.level}</small></label>`;
        content.appendChild(item);
      });
      acc.appendChild(div);
    });

    // Toggle groups
    acc.querySelectorAll('.toggle').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const g = e.target.closest('.group');
        g.classList.toggle('open');
        btn.textContent = g.classList.contains('open') ? 'Fechar' : 'Abrir';
      });
    });

    // Persist checkboxes
    acc.querySelectorAll('input[type="checkbox"]').forEach(chk=>{
      chk.addEventListener('change', saveTasksState);
    });
  }

  function saveTasksState(){
    const data = EB_collect();
    const store = JSON.parse(localStorage.getItem('eb_store')||'{}');
    if(data.projectName){
      store[data.projectName] = data;
      localStorage.setItem('eb_store', JSON.stringify(store));
    }
    EB_updateKPIs();
  }

  // Filtro de tarefas
  function applyTaskFilters(){
    const q = document.getElementById('taskSearch').value.toLowerCase();
    const area = document.getElementById('taskArea').value;
    const level = document.getElementById('taskLevel').value;
    document.querySelectorAll('#taskAccordion .group').forEach(g=>{
      const matchArea = !area || g.dataset.area===area;
      const matchLevel = !level || g.dataset.level===level;
      let anyVisible = false;
      g.querySelectorAll('.task-item').forEach(it=>{
        const text = it.innerText.toLowerCase();
        const visible = matchArea && matchLevel && (!q || text.includes(q));
        it.style.display = visible ? '' : 'none';
        if(visible) anyVisible = true;
      });
      g.style.display = anyVisible ? '' : 'none';
    });
  }

  document.getElementById('taskSearch').addEventListener('input', applyTaskFilters);
  document.getElementById('taskArea').addEventListener('change', applyTaskFilters);
  document.getElementById('taskLevel').addEventListener('change', applyTaskFilters);
  document.getElementById('clearDone').addEventListener('click', ()=>{
    document.querySelectorAll('#taskAccordion input[type="checkbox"]').forEach(c=>c.checked=false);
    saveTasksState();
    applyTaskFilters();
  });

  // Coleta / Preenche / Limpa
  window.EB_collect = function(withCalc=false){
    const data = {
      projectName: document.getElementById('projectName').value,
      production: parseFloat(document.getElementById('production').value||'0'),
      electricity: parseFloat(document.getElementById('electricity').value||'0'),
      gas: parseFloat(document.getElementById('gas').value||'0'),
      diesel: parseFloat(document.getElementById('diesel').value||'0'),
      fe_electricity: parseFloat(document.getElementById('fe_electricity').value||'0.085'),
      fe_gas: parseFloat(document.getElementById('fe_gas').value||'1.9'),
      fe_diesel: parseFloat(document.getElementById('fe_diesel').value||'2.68'),
      tasks: []
    };
    // tasks state
    document.querySelectorAll('#taskAccordion .task-item').forEach(it=>{
      const input = it.querySelector('input[type="checkbox"]');
      const title = it.querySelector('strong').innerText;
      data.tasks.push({ id: input.id, title, done: input.checked });
    });
    const c = calc();
    data.calc = c;
    data.tasksProgress = EB_tasksProgress(data.tasks);
    if(withCalc) return data;
    return data;
  };

  window.EB_fill = function(d){
    document.getElementById('projectName').value = d.projectName||'';
    document.getElementById('cfgProjectName').value = d.projectName||'';
    document.getElementById('production').value = d.production||0;
    document.getElementById('electricity').value = d.electricity||0;
    document.getElementById('gas').value = d.gas||0;
    document.getElementById('diesel').value = d.diesel||0;
    document.getElementById('fe_electricity').value = d.fe_electricity||0.085;
    document.getElementById('fe_gas').value = d.fe_gas||1.9;
    document.getElementById('fe_diesel').value = d.fe_diesel||2.68;

    // fill tasks
    const map = new Map((d.tasks||[]).map(t=>[t.id, t.done]));
    document.querySelectorAll('#taskAccordion input[type="checkbox"]').forEach(chk=>{
      chk.checked = map.get(chk.id)||false;
    });
    calc();
    EB_updateKPIs();
    EB_renderReportTasks();
  };



  window.EB_clear = function(){
    document.getElementById('calcForm').reset();
    document.getElementById('projectName').value = '';
    document.querySelectorAll('#taskAccordion input[type="checkbox"]').forEach(c=>c.checked=false);
    calc();
    EB_updateKPIs();
    EB_renderReportTasks();
  };


  
  // KPIs e progresso
  function EB_tasksProgress(tasks){
    const total = tasks.length||1;
    const done = tasks.filter(t=>t.done).length;
    const overall = Math.round(done/total*100);
    const byGroup = { energia:0, processo:0, manutencao:0, gestao:0 };
    const counts = { energia:0, processo:0, manutencao:0, gestao:0 };
    document.querySelectorAll('#taskAccordion .group').forEach(g=>{
      const area = g.dataset.area;
      const items = Array.from(g.querySelectorAll('.task-item input'));
      counts[area]+=items.length;
      byGroup[area]+=items.filter(i=>i.checked).length;
    });
    return { overall, done, total, byGroup, counts };
  }
  window.EB_tasksProgress = EB_tasksProgress;

  window.EB_updateKPIs = function(){
    const data = EB_collect(true);
    const prog = data.tasksProgress;
    document.getElementById('kpiTasks').textContent = prog.overall + '%';
    document.getElementById('progressOverall').style.width = prog.overall + '%';

    // Lista resumida por grupo
    const list = document.getElementById('progressList');
    list.innerHTML = '';
    ['energia','processo','manutencao','gestao'].forEach(area=>{
      const done = prog.byGroup[area]||0;
      const cnt = prog.counts[area]||0;
      const perc = cnt? Math.round(done/cnt*100) : 0;
      const name = {energia:'Energia',processo:'Processo',manutencao:'Manutenção',gestao:'Gestão'}[area];
      const li = document.createElement('li');
      li.innerHTML = `<span>${name}</span><strong>${perc}%</strong>`;
      list.appendChild(li);
    });
    EB_renderReportTasks();
  }

  // Relatório de tarefas
  function EB_renderReportTasks(){
    const ul = document.getElementById('reportTasks');
    const tasks = [];
    document.querySelectorAll('#taskAccordion .task-item').forEach(it=>{
      const title = it.querySelector('strong').innerText;
      const done = it.querySelector('input').checked;
      tasks.push({title, done});
    });
    ul.innerHTML = tasks.map(t=>`<li>${t.done?'✅':'⬜'} ${t.title}</li>`).join('');
  }

  // Recomendar tarefas com base no perfil (regras simples)
  document.getElementById('recomendar').addEventListener('click', ()=>{
    const data = EB_collect(true);
    // Estratégia simples: abrir grupos relevantes e marcar 1-2 sugestões iniciais
    const open = (id)=>{ const g = document.querySelector(`.group[data-area="${id}"]`); if(g){ g.classList.add('open'); g.querySelector('.toggle').textContent='Fechar'; } };
    if(data.calc.ele_kg > data.calc.total_kg*0.4){ open('energia'); }
    if(data.calc.gas_kg > 0){ open('processo'); }
    if(data.calc.diesel_kg > 0){ open('manutencao'); }
    open('gestao');

    EB_updateKPIs();
    alert('Tarefas recomendadas com base no perfil de consumo. Abra os grupos para conferir.');
  });

  // Eventos principais
  document.getElementById('calcForm').addEventListener('submit', (e)=>{ e.preventDefault(); calc(); EB_updateKPIs(); });
  document.addEventListener('change', (e)=>{
    if(e.target.matches('#taskAccordion input[type="checkbox"]')) EB_updateKPIs();
  });

  // Inicialização
  renderTasks();
  calc();
  EB_updateKPIs();
})();