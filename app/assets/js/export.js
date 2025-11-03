// Export CSV
(function(){
  function toCSV(rows){ return rows.map(r=>r.map(x=>`"${String(x).replaceAll('"','""')}"`).join(',')).join('\n'); }
  window.EB_exportCSV = function(){
    const data = window.EB_collect(true);
    const rows = [
      ['Campo','Valor'],
      ['Projeto', data.projectName],
      ['Produção (unid/mês)', data.production],
      ['Eletricidade (kWh)', data.electricity],
      ['Gás Natural (m3)', data.gas],
      ['Diesel (L)', data.diesel],
      ['FE Eletricidade (kgCO2e/kWh)', data.fe_electricity],
      ['FE Gás (kgCO2e/m3)', data.fe_gas],
      ['FE Diesel (kgCO2e/L)', data.fe_diesel],
      ['CO2e total (kg)', data.calc.total_kg],
      ['Escopo 1 (kg)', data.calc.scope1_kg],
      ['Escopo 2 (kg)', data.calc.scope2_kg],
      ['Intensidade (kg/unid)', data.calc.intensity],
      ['Tarefas concluídas (%)', data.tasksProgress.overall+'%']
    ];
    const tasks = data.tasks;
    rows.push(['----','----']);
    rows.push(['Tarefas','Status']);
    tasks.forEach(t=>rows.push([t.title, t.done?'Concluída':'Pendente']));
    const csv = toCSV(rows);
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (data.projectName||'ecobrain') + '_relatorio.csv';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }
})();