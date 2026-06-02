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

const getEquipamentos = async (mostrarContagem = false) => {
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

        if (mostrarContagem) {
            mostrarMensagem(`Operação concluída com sucesso. ${equipamentos.length} equipamento(s) encontrado(s).`, 'sucesso');
        }
    } catch (error) {
        tbody.innerHTML = '';
        mostrarMensagem('Falha de comunicação com o servidor.', 'erro');
        console.error('Erro ao buscar equipamentos:', error);
    }

}
getEquipamentos();

// Função para cadastrar um novo equipamento
const cadastrarEquipamento = async () => {
    const nome = document.querySelector('#nome').value;
    const tipo = document.querySelector('#tipo').value;
    const status = document.querySelector('#status').value;
    const descricao = document.querySelector('#descricao').value;

    try {
        const response = await fetch('http://localhost:3000/equipamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, tipo, status, descricao })
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || 'Erro ao cadastrar equipamento.');
        }

        const novoEquipamento = await response.json();
        mostrarMensagem('Equipamento cadastrado com sucesso!', 'sucesso');
        // Limpa o campo de ID e o formulário para evitar buscas por ID residual
        document.querySelector('#id').value = '';
        document.querySelector('#nome').value = '';
        document.querySelector('#tipo').value = '';
        document.querySelector('#status').value = '';
        document.querySelector('#descricao').value = '';
        getEquipamentos(); // Atualiza a lista de equipamentos
    } catch (error) { 
        // Mensagem do erro dentro da DIV de alerta, e log do erro no console
        mostrarMensagem(error.message, 'erro');
        console.error('Erro ao cadastrar equipamento:', error);
    }
};

// Função para editar um equipamento ao clicar em "Editar na linha", preenchendo os campos com os dados do equipamento selecionado e mostrando o botão de salvar e ocultando de cadastrar e filtrar
tbody.addEventListener('click', async (event) => {
    if (event.target.classList.contains('editar')) {
        const id = event.target.getAttribute('data-id');
        try {
            const response = await fetch(`http://localhost:3000/equipamentos/${id}`);
            if (!response.ok) {
                const erro = await response.json();
                throw new Error(erro.error || 'Erro ao buscar equipamento para edição.');
            }
            const equipamento = await response.json();

            // Preencher os campos do formulário com os dados do equipamento
            document.querySelector('#id').value = equipamento.id;
            document.querySelector('#nome').value = equipamento.nome;
            document.querySelector('#tipo').value = equipamento.tipo;
            document.querySelector('#status').value = equipamento.status;
            document.querySelector('#descricao').value = equipamento.descricao;

            // Mostrar o botão de salvar e ocultar os botões de cadastrar e filtrar
            document.querySelector('#salvar').style.display = 'inline-block';
            document.querySelector('#cadastrar').style.display = 'none';
            document.querySelector('#filtrar').style.display = 'none';
            limparMensagem();
            // salvar -> volta btn de cadastrar e filtrar, e esconde o de salvar
            document.querySelector('#salvar').addEventListener('click', () => {
                document.querySelector('#salvar').style.display = 'none';
                document.querySelector('#cadastrar').style.display = 'inline-block';
                document.querySelector('#filtrar').style.display = 'inline-block';
            });
        } catch (error) {
            mostrarMensagem(error.message, 'erro');
            console.error('Erro ao buscar equipamento para edição:', error);
        }
    }
});

// Função para salvar as alterações do equipamento editado, enviando uma requisição PUT para o backend, e depois atualizando a lista de equipamentos e mostrando mensagem de sucesso ou erro
document.querySelector('#salvar').addEventListener('click', async () => {
    const id = document.querySelector('#id').value;
    const nome = document.querySelector('#nome').value;
    const tipo = document.querySelector('#tipo').value;
    const status = document.querySelector('#status').value;
    const descricao = document.querySelector('#descricao').value;

    try {
        const response = await fetch(`http://localhost:3000/equipamentos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, tipo, status, descricao })
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.error || 'Erro ao atualizar equipamento.');
        }

        const equipamentoAtualizado = await response.json();
        mostrarMensagem('Equipamento atualizado com sucesso!', 'sucesso');
        // após salvar, limpar o id e restaurar botões
        document.querySelector('#id').value = '';
        document.querySelector('#nome').value = '';
        document.querySelector('#tipo').value = '';
        document.querySelector('#status').value = '';
        document.querySelector('#descricao').value = '';
        document.querySelector('#salvar').style.display = 'none';
        document.querySelector('#cadastrar').style.display = 'inline-block';
        document.querySelector('#filtrar').style.display = 'inline-block';
        getEquipamentos(); // Atualiza a lista de equipamentos
    } catch (error) {
        mostrarMensagem(error.message, 'erro');
        console.error('Erro ao atualizar equipamento:', error);
    }
});

// Função para excluir um equipamento ao clicar em "Excluir na linha", enviando uma requisição DELETE para o backend, e depois atualizando a lista de equipamentos e mostrando mensagem de sucesso ou erro
tbody.addEventListener('click', async (event) => {
    if (event.target.classList.contains('excluir')) {
        const id = event.target.getAttribute('data-id');
        if (confirm('Tem certeza que deseja excluir este equipamento?')) {
            try {
                const response = await fetch(`http://localhost:3000/equipamentos/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const erro = await response.json();
                    throw new Error(erro.error || 'Erro ao excluir equipamento.');
                }

                mostrarMensagem('Equipamento excluído com sucesso!', 'sucesso');
                getEquipamentos(); // Atualiza a lista de equipamentos
            } catch (error) {
                mostrarMensagem(error.message, 'erro');
                console.error('Erro ao excluir equipamento:', error);
            }
        }
    }
});

document.querySelector('#filtrar').addEventListener('click', () => getEquipamentos(true));
document.querySelector('#cadastrar').addEventListener('click', cadastrarEquipamento);