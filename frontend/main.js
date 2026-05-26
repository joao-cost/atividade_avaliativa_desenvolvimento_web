const tbody = document.querySelector('#data');
const alerta = document.querySelector('#alerta');

// Uma função aqui para preparar a mensagem para exibir na minha DIV de alerta
const mostrarMensagem = (mensagem, tipo = 'sucesso') => {
    alerta.innerHTML = `<p class="mensagem ${tipo}">${mensagem}</p>`;
    // Tipo usado para mudar o CSS da mensagem
};

// já aqui uma função para limpar a DIV
const limparMensagem = () => {
    alerta.innerHTML = '';
};

const getEquipamentos = async () => {
    let url = 'http://localhost:3000/equipamentos?';
    
    // Oculta o botão de salvar, só aparece quando clicar em editar
    document.querySelector('#salvar').style.display = 'none';
    limparMensagem();

    // filtros
    const id = document.querySelector('#id').value;
    const busca = document.querySelector('#nome').value;
    const descricao = document.querySelector('#descricao').value;
    const tipo = document.querySelector('#tipo').value;
    const status = document.querySelector('#status').value;
    
    // busca de equipamento com ID específico
    if (id) {
        url = `http://localhost:3000/equipamentos/${id}`;
    } else {
        // montar url com filtros se tiver
        if (busca) url += `busca=${busca}&`;
        if (tipo) url += `tipo=${tipo}&`;
        if (status) url += `status=${status}&`;
        if (descricao) url += `descricao=${descricao}&`;
    }

    try {
        const response = await fetch(url);

        // Se der erro, na busca, retorna erro na DIV de alerta e limpa tabela
        // Se der erro na busca por ID, retorna 404
        if (!response.ok) {
            tbody.innerHTML = '';

            // tratamento para exibir a mensagem de erro, com resposta que veio da API (server.js)
            let mensagemErro = `Erro na requisição (${response.status}).`;

            try {
                const erro = await response.json();
                if (erro?.error) {
                    mensagemErro = erro.error;
                }
            } catch {
                if (response.statusText) {
                    mensagemErro = response.statusText;
                }
            }

            mostrarMensagem(mensagemErro, 'erro');
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

        mostrarMensagem(`Operação concluída com sucesso. ${equipamentos.length} equipamento(s) encontrado(s).`, 'sucesso');
    } catch (error) {
        tbody.innerHTML = '';
        mostrarMensagem('Falha de comunicação com o servidor.', 'erro');
        console.error('Erro ao buscar equipamentos:', error);
    }

}
getEquipamentos();

document.querySelector('#filtrar').addEventListener('click', getEquipamentos);