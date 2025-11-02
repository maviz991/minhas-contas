import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /transactions - Listar todas
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      include: { category: true, account: true }, // Inclui dados relacionados
      orderBy: { date: 'desc' },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as transações.' });
  }
});

// POST /transactions - Criar nova
router.post('/', async (req, res) => {
  try {
    const { description, amount, date, type, accountId, categoryId } = req.body;
    const newTransaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        date: new Date(date),
        type,
        accountId: parseInt(accountId),
        categoryId: parseInt(categoryId),
      },
    });
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível criar a transação.' });
  }
});

export default router;