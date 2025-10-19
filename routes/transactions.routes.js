import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ROTA GET / transactions
// O caminho é apenas "/", porque o prefixo "/transactions" será definido no index.js
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
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

// ROTA POST / transactions
router.post('/', async (req, res) => {
  try {
    const { description, amount, type, accountId, categoryId } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: { description, amount: parseFloat(amount), type, accountId, categoryId },
      });

      const amountValue = parseFloat(amount);
      const balanceChange = type === 'DESPESA' ? -amountValue : amountValue;

      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: balanceChange } },
      });

      return { newTransaction, updatedAccount };
    });

    res.status(201).json(result.newTransaction);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});

// Exportamos o router para que o index.js possa usá-lo
export default router;