/* inicialização*/
// Recomendar tarefas com base no perfil (regras simples)
(function () {
    document.getElementById('recomendar').addEventListener('click', () => {
        /*Depende de EB_collect (de utils.js)*/
        const data = EB_collect(true);
        /* Estratégia simples: abrir grupos relevantes e marcar 1-2 sugestões iniciais*/
        /* Função utilitária local para abrir/fechar o acordeão*/
        const open = (id) => { const g = document.querySelector(`.group[data-area="${id}"]`); if (g) { g.classList.add('open'); g.querySelector('.toggle').textContent = 'Fechar'; } };
        /*Lógica de recomendação: abre os grupos mais relevantes com base na pegada de carbono*/
        if (data.calc.ele_kg > data.calc.total_kg * 0.4) { open('energia'); }
        if (data.calc.gas_kg > 0) { open('processo'); }
        if (data.calc.diesel_kg > 0) { open('manutencao'); }
        open('gestao');
        /* Atualiza os KPIs após abrir as tarefas*/
        EB_updateKPIs(); /* Depende de kpis.js*/
        alert('Tarefas recomendadas com base no perfil de consumo. Abra os grupos para conferir.');
    });

    /* Eventos principais*/
    document.getElementById('calcForm').addEventListener('submit', (e) => { e.preventDefault(); calc(); EB_updateKPIs(); });
    /* Se a alteração for um checkbox de tarefa, atualiza os KPIs*/
    document.addEventListener('change', (e) => {
        if (e.target.matches('#taskAccordion input[type="checkbox"]')) EB_updateKPIs(); /*Depende de kpis.js*/
    });

    /*Inicialização*/
    /*Funções que são chamadas uma vez ao carregar a página*/
    renderTasks(); /* Renderiza o acordeão de tarefas (Depende de tasks.js)*/
    calc(); /* Executa o cálculo inicial (Depende de utils.js)*/
    EB_updateKPIs(); /* Atualiza os indicadores iniciais (Depende de kpis.js)*/
})(); /* Fecha e executa a IIFE*/