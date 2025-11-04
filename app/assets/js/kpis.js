/*lógica para calcular o progresso e atualizar a interface de KPIs e o relatório de tarefas*/
// KPIs e progresso
function EB_tasksProgress(tasks) {
    // Calcula o total e o número de tarefas concluídas
    const total = tasks.length || 1;
    const done = tasks.filter(t => t.done).length;
    const overall = Math.round(done / total * 100);
    // Inicializa contadores por grupo de tarefas
    const byGroup = { energia: 0, processo: 0, manutencao: 0, gestao: 0 };
    const counts = { energia: 0, processo: 0, manutencao: 0, gestao: 0 };
    // Percorre o DOM para contar itens concluídos e totais por grupo
    document.querySelectorAll('#taskAccordion .group').forEach(g => {
        const area = g.dataset.area;
        const items = Array.from(g.querySelectorAll('.task-item input'));
        counts[area] += items.length;
        byGroup[area] += items.filter(i => i.checked).length;
    });
    return { overall, done, total, byGroup, counts };
}
window.EB_tasksProgress = EB_tasksProgress;
/*
* Atualiza todos os KPIs de progresso e barra na interface.
* Esta função é a principal responsável por refrescar a UI após uma alteração.
*/

window.EB_updateKPIs = function () {
    const data = EB_collect(true);
    const prog = data.tasksProgress;
    /* Atualiza o KPI principal de progresso geral*/
    document.getElementById('kpiTasks').textContent = prog.overall + '%';
    document.getElementById('progressOverall').style.width = prog.overall + '%';

    // Lista resumida por grupo
    const list = document.getElementById('progressList');
    list.innerHTML = '';
    ['energia', 'processo', 'manutencao', 'gestao'].forEach(area => {
        const done = prog.byGroup[area] || 0;
        const cnt = prog.counts[area] || 0;
        const perc = cnt ? Math.round(done / cnt * 100) : 0;
        const name = { energia: 'Energia', processo: 'Processo', manutencao: 'Manutenção', gestao: 'Gestão' }[area];
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}</span><strong>${perc}%</strong>`;
        list.appendChild(li);
    });
    EB_renderReportTasks(); /* Chama a atualização do relatório de tarefas*/
}

/* Relatório de tarefas*/
/* Renderiza a lista de tarefas no relatório (tab "Relatório") com ícones de status.*/
function EB_renderReportTasks() {
    const ul = document.getElementById('reportTasks');
    const tasks = [];
    document.querySelectorAll('#taskAccordion .task-item').forEach(it => {
        const title = it.querySelector('strong').innerText;
        const done = it.querySelector('input').checked;
        tasks.push({ title, done });
    });
    ul.innerHTML = tasks.map(t => `<li>${t.done ? '✅' : '⬜'} ${t.title}</li>`).join('');
}
