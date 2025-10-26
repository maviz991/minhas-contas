import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ROTA GET /accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as contas.' });
  }
});

// * ROTA POST /accounts
router.post('/', async (req, res) => {
  try {
    const { name, balance } = req.body;
    const newAccount = await prisma.account.create({
      data: {
        name,
        balance: balance ? parseFloat(balance) : 0, // Saldo inicial
      },
    });
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a conta.' });
  }
});

export default router;