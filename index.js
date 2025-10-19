// index.js

// 1. Importar as dependências necessárias
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

// 2. Inicializar o Express e o Prisma Client
const app = express();
const prisma = new PrismaClient();

// 3. Configurar os Middlewares
// Middleware para o Express entender JSON no corpo das requisições
app.use(express.json());
// Middleware para permitir que outras origens (nosso futuro app) acessem esta API
app.use(cors());

// --- DEFINIÇÃO DAS ROTAS DA API ---

/**
 * ROTA GET /transactions
 * Retorna todas as transações cadastradas no banco de dados.
 */
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      // O 'include' faz com que os dados da conta e categoria relacionados venham junto
      include: {
        account: true,
        category: true,
      },
    });
    res.json(transactions);
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({ error: 'Não foi possível buscar as transações.' });
  }
});

/**
 * ROTA POST /transactions
 * Cria uma nova transação com base nos dados enviados no corpo da requisição.
 */
app.post('/transactions', async (req, res) => {
  try {
    const { description, amount, type, accountId, categoryId } = req.body;

    // Simples validação para garantir que os campos necessários foram enviados
    if (!description || !amount || !type || !accountId || !categoryId) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount), // Garante que o valor seja um número
        type,
        accountId,
        categoryId,
      },
    });

    res.status(201).json(newTransaction); // 201 Created é o status ideal para criação
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
