const tbody = document.querySelector('#data');
const getEquipamentos = async () => {
    let url = 'http://localhost:3000/equipamentos?';

    // filtros
    const busca = document.querySelector('#nome').value;
    const tipo = document.querySelector('#tipo').value;
    const status = document.querySelector('#status').value;

    // montar url com filtros se tiver
    if (busca) url += `busca=${busca}&`;
    if (tipo) url += `tipo=${tipo}&`;
    if (status) url += `status=${status}&`;

    const response = await fetch(url);
    const equipamentos = await response.json();
    
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
        `;
        tbody.appendChild(tr);
    }

}
getEquipamentos();

document.querySelector('#filtrar').addEventListener('click', getEquipamentos);