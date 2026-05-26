// Servidor Express básico para o Lab App
import express from 'express';

// Cria uma instância do aplicativo Express
const app = express();

// Liberar CORS para todo mundo (apenas para desenvolvimento)
import cors from 'cors';
app.use(cors());

// Hello World endpoint
app.get('/', (req, res) => {
  res.send('Olá, Mundo!');
});

app.get('/cadastro', (req, res) => {
  res.send('Página de Cadastro');
});

// CRUD de produtos
// CREATE
app.post('/produtos', (req, res) => {
    res.send('Criar um novo produto');
});
// READ ALL
app.get('/produtos', (req, res) => {
    const produtos = ['32GB DDR5', 'SSD 1TB', 'Placa de Vídeo RTX 4090', 'Processador Ryzen 9 7950X']; // Vetor simulado de produtos
    res.json(produtos);
});
// READ ONE
app.get('/produto/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Detalhes do produto com ID: ${id}`);
});
// UPDATE
app.put('/produto/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Atualizar o produto com ID: ${id}`);
});
// DELETE
app.delete('/produto/:id', (req, res) => {
    const id = req.params.id;
    res.send(`Excluir o produto com ID: ${id}`);
});



// Cria uma porta e coloca o servidor para ouvir nessa porta
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});