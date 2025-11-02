import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ROTA GET /bills -> Listar todas as faturas
router.get('/', async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: {
        vencimento: 'asc',
      },
    });
    // Formata a data para 'YYYY-MM-DD'
    const formattedBills = bills.map(bill => ({
        ...bill,
        vencimento: bill.vencimento.toISOString().split('T')[0]
    }));
    res.json(formattedBills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível buscar as faturas.' }); // Mensagem ajustada
  }
});

// ROTA POST /bills -> Criar uma nova fatura
router.post('/', async (req, res) => {
  try {
    const { nome, valor, vencimento, pago } = req.body;
    
    if (!nome || valor === undefined || !vencimento) {
        return res.status(400).json({ error: 'Campos nome, valor e vencimento são obrigatórios.' });
    }

    const newBill = await prisma.bill.create({
      data: {
        nome,
        valor: parseFloat(valor),
        vencimento: new Date(vencimento),
        pago: pago || false,
      },
    });
    res.status(201).json(newBill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível criar a fatura.' }); // Mensagem ajustada
  }
});

// ROTA PATCH /bills/:id -> Atualizar o status de uma fatura
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { pago } = req.body;

    if (typeof pago !== 'boolean') {
      return res.status(400).json({ error: "O campo 'pago' deve ser um valor booleano (true/false)." });
    }

    const updatedBill = await prisma.bill.update({
      where: {
        id: parseInt(id),
      },
      data: {
        pago: pago,
      },
    });

    res.json(updatedBill);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Fatura não encontrada.' }); // Mensagem ajustada
    }
    res.status(500).json({ error: 'Não foi possível atualizar a fatura.' }); // Mensagem ajustada
  }
});

export default router;