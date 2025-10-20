import express from 'express';
import cors from 'cors';

// 1. Importe os seus arquivos de rota
import transactionsRouter from './routes/transactions.routes.js';
import accountsRouter from './routes/accounts.routes.js';
import categoriesRouter from './routes/categories.routes.js';

const app = express();

app.use(express.json());
app.use(cors());

// 2. Conecte as rotas ao seu app principal
// Diz ao Express: "Para qualquer requisição que comece com /transactions, use o transactionsRouter"
app.use('/transactions', transactionsRouter);
app.use('/accounts', accountsRouter);
app.use('/categories', categoriesRouter);


const PORT = 3001;
// Linha nova
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT} e na sua rede!`);
});