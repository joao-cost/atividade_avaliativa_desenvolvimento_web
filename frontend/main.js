const tbody = document.querySelector('#data');
const getEquipamentos = async () => {
    let url = 'http://localhost:3000/equipamentos?';
    
    // Oculta o botão de salvar, só aparece quando clicar em editar
    document.querySelector('#salvar').style.display = 'none';

    // filtros
    const id = document.querySelector('#id').value;
    const busca = document.querySelector('#nome').value;
    const descricao = document.querySelector('#descricao').value;
    const tipo = document.querySelector('#tipo').value;
    const status = document.querySelector('#status').value;
    
    // busca de equipamento com ID específico
    if (id) {
        console.log('buscando por ID:', id);
        url = `http://localhost:3000/equipamentos/${id}`;
    } else {
        // montar url com filtros se tiver
        if (busca) url += `busca=${busca}&`;
        if (tipo) url += `tipo=${tipo}&`;
        if (status) url += `status=${status}&`;
        if (descricao) url += `descricao=${descricao}&`;
    }

    const response = await fetch(url);

    // Se der erro, na busca, retorna erro na DIV de alerta e limpa tabela
    // Se der erro na busca por ID, retorna 404
    if (!response.ok) {
        // se não encontrou ou erro, limpa tabela e retorna
        tbody.innerHTML = '';
        document.querySelector('#alerta').innerHTML = '<p class="alerta">Erro na requisição!</p>';
        console.error('Erro na requisição:', response.status, response.statusText);
        return; 
    }
    let equipamentos = await response.json();
    // se buscou por id, o backend pode retornar um objeto; normalizar para array
    if (id && !Array.isArray(equipamentos)) {
        equipamentos = [equipamentos];
    }
    
    // limpar tabela
    tbody.innerHTML = '';

    // preencher tabela
    for (const e of equipamentos) {
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.nome}</td>
            <td>${e.tipo}</td>
            <td>${e.status}</td>
            <td>${e.descricao}</td>
            <td>
                <button class="editar" data-id="${e.id}">Editar</button>
                <button class="excluir" data-id="${e.id}">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    }

}
getEquipamentos();

document.querySelector('#filtrar').addEventListener('click', getEquipamentos);