/* Cálculo, tarefas e relatórios*/
/*funções básicas de apoio e o cálculo central das emissões*/
/* Atalho para selecionar elementos pelo ID*/
  const $ = (id)=>document.getElementById(id);

/* Função para obter e garantir que o valor de um campo seja um número*/
  function number(id){ return parseFloat($(id).value||'0')||0; }

  /**
 * ** Função Principal de Cálculo (`calc`) **
 * 1. Pega os valores de consumo e fatores de emissão.
 * 2. Calcula as emissões (Escopo 1 e 2).
 * 3. Calcula a intensidade de carbono.
 * 4. **Atualiza a interface** (KPIs, barras de progresso, tabela de relatórios).
 * 5. Retorna o objeto de resultados.
 */

  function calc(){
    const electricity = number('electricity');
    const gas = number('gas');
    const diesel = number('diesel');
    const fe_e = number('fe_electricity');
    const fe_g = number('fe_gas');
    const fe_d = number('fe_diesel');

    /* Cálculos de emissão (kg CO2e)*/
    const ele_kg = electricity * fe_e;
    const gas_kg = gas * fe_g;
    const diesel_kg = diesel * fe_d;

    const scope2_kg = ele_kg;
    const scope1_kg = gas_kg + diesel_kg;
    const total_kg = scope1_kg + scope2_kg;

    const production = number('production');
    const intensity = production>0 ? (total_kg/production) : 0;

    // Atualiza KPIs na UI
    $('scope1').textContent = (scope1_kg/1000).toFixed(2) + ' t';
    $('scope2').textContent = (scope2_kg/1000).toFixed(2) + ' t';
    $('totalKg').textContent = total_kg.toFixed(2);
    $('kpiTotal').textContent = (total_kg/1000).toFixed(2) + ' t';
    $('kpiIntensity').textContent = intensity.toFixed(3);

    /* Atualiza Barras de Progresso*/
    const max = Math.max(ele_kg, gas_kg, diesel_kg, 1);
    $('barEle').style.width = (ele_kg/max*100).toFixed(0)+'%';
    $('barGas').style.width = (gas_kg/max*100).toFixed(0)+'%';
    $('barDiesel').style.width = (diesel_kg/max*100).toFixed(0)+'%';

    /* Atualiza Tabela de Relatório */
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
    /* tasks state (Coleta o estado das tarefas)*/
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

  /* Preenche o formulário com dados carregados (ex: do LocalStorage).*/
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

    /* fill tasks */
    /* Preenche o estado das tarefas*/
    const map = new Map((d.tasks||[]).map(t=>[t.id, t.done]));
    document.querySelectorAll('#taskAccordion input[type="checkbox"]').forEach(chk=>{
      chk.checked = map.get(chk.id)||false;
    });
    calc();
    /* Funções de atualização dependem de kpis.js e tasks.js*/
    EB_updateKPIs();
    EB_renderReportTasks();
  };

 /* Limpa todos os campos do formulário e o estado das tarefas*/

  window.EB_clear = function(){
    document.getElementById('calcForm').reset();
    document.getElementById('projectName').value = '';
    document.querySelectorAll('#taskAccordion input[type="checkbox"]').forEach(c=>c.checked=false);
    calc();
    /* Funções de atualização dependem de kpis.js e tasks.js*/
    EB_updateKPIs();
    EB_renderReportTasks();
  };

  