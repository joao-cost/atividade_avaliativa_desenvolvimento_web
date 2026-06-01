// O laboratório de informática do curso de Sistemas de Informação precisa de uma interface de
// consulta para que professores e alunos possam verificar quais equipamentos estão disponíveis antes
// de ir ao laboratório. A interface deve permitir filtrar a lista por status, tipo e nome.
// Sua tarefa é construir um sistema completo composto por um backend (API que retorna dados filtrados)
// e um frontend (página HTML com formulário de busca).

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json()); // Para parsear JSON no corpo das requisições


// BANCO DE DADOS SIMULADO

// vetor simulado de produtos
// Tipos sugeridos: projetor , notebook , kit , cabo , webcam , microfone
// Status possíveis: disponivel , emprestado , manutencao
const equipamentos = [
    { id: 1, nome: 'Acer Nitro 5', tipo: 'notebook', status: 'disponivel', descricao: 'Notebook de alta performance para jogos e edição de vídeo.' },
    { id: 2, nome: 'Dell XPS 13', tipo: 'notebook', status: 'indisponivel', descricao: 'Ultrabook leve e elegante, ideal para produtividade e mobilidade.' },
    { id: 3, nome: 'iMac 27"', tipo: 'desktop', status: 'disponivel', descricao: 'Computador all-in-one com tela Retina 5K, perfeito para design gráfico e edição de vídeo.' },
    { id: 4, nome: 'Lenovo ThinkPad X1 Carbon', tipo: 'notebook', status: 'disponivel', descricao: 'Notebook empresarial com excelente teclado e durabilidade.' },
    { id: 5, nome: 'HP Envy 15', tipo: 'notebook', status: 'indisponivel', descricao: 'Notebook potente com tela OLED, ideal para criadores de conteúdo.' },
    { id: 6, nome: 'Epson EcoTank L3150', tipo: 'impressora', status: 'disponivel', descricao: 'Impressora multifuncional com tanque de tinta recarregável, econômica e eficiente.' },
    { id: 7, nome: 'Projector Epson TW3200', tipo: 'projetor', status: 'disponivel', descricao: 'Projetor de alta resolução com tecnologia 3LCD, ideal para apresentações.' },
    { id: 8, nome: 'Webcam Logitech C920', tipo: 'webcam', status: 'indisponivel', descricao: 'Webcam Full HD com microfone estéreo, perfeita para videoconferências.' },
    { id: 9, nome: 'Microfone Blue Yeti', tipo: 'microfone', status: 'disponivel', descricao: 'Microfone USB de alta qualidade, ideal para gravação de voz e streaming.' },
    { id: 10, nome: 'Cabo HDMI 2.0', tipo: 'cabo', status: 'disponivel', descricao: 'Cabo HDMI de alta velocidade, compatível com resoluções 4K e HDR.' }
];

// AQUI VAI MEU CRUD DE PRODUTOS

// Endpoint para listar todos os equipamentos
app.get('/equipamentos', (req, res) => {
    // Filtrar por status, tipo e buscar por nome
    const { status, tipo, busca, descricao } = req.query;
    console.log(tipo, status, busca, descricao);

    let resultados = equipamentos;
    // filtrar por status
    if (status) resultados = resultados.filter(p => p.status === status);
    // filtrar por tipo
    if (tipo) resultados = resultados.filter(p => p.tipo === tipo);

    // Atualização do Projeto Anterior: adição do campo de descrição para poder usar como input para cadastro também kk
    // buscar por nome
    if (busca) resultados = resultados.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()));
    // buscar por descrição
    if (descricao) resultados = resultados.filter(p => p.descricao.toLowerCase().includes(descricao.toLowerCase()));

    res.json(resultados);
});

// Endpoint para buscar um equipamento por ID
app.get('/equipamentos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log('buscando por ID:', id);
    const equipamento = equipamentos.find(p => p.id === id);
    if (equipamento) {
        res.json(equipamento);
    } else {
        res.status(404).json({ error: 'Equipamento não encontrado!' });
    }
});

// Endpoint para cadastrar um novo equipamento e retorna status 201
app.post('/equipamentos', (req, res) => {
    const { nome, tipo, status, descricao } = req.body;
    if (!nome || !tipo || !status) {
        return res.status(400).json({ error: 'Campos nome, tipo e status são obrigatórios!' });
    }
    const novoEquipamento = {
        id: equipamentos.length > 0 ? Math.max(...equipamentos.map(p => p.id)) + 1 : 1,
        nome,
        tipo,
        status,
        descricao
    };

    equipamentos.push(novoEquipamento);
    res.status(201).json(novoEquipamento);
});

// Servidor Rodando
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});