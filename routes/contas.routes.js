import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ROTA GET /contas -> Listar todas as contas a pagar
router.get('/', async (req, res) => {
  try {
    const contas = await prisma.conta.findMany({
      orderBy: {
        vencimento: 'asc', // Ordena por vencimento
      },
    });
    // Formata a data para 'YYYY-MM-DD' para consistência com o frontend
    const formattedContas = contas.map(conta => ({
        ...conta,
        vencimento: conta.vencimento.toISOString().split('T')[0]
    }));
    res.json(formattedContas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível buscar as contas.' });
  }
});

// ROTA POST /contas -> Criar uma nova conta a pagar
router.post('/', async (req, res) => {
  try {
    const { nome, valor, vencimento, pago } = req.body;
    
    if (!nome || valor === undefined || !vencimento) {
        return res.status(400).json({ error: 'Campos nome, valor e vencimento são obrigatórios.' });
    }

    const newConta = await prisma.conta.create({
      data: {
        nome,
        valor: parseFloat(valor),
        vencimento: new Date(vencimento), // Converte a string de data para o formato do DB
        pago: pago || false,
      },
    });
    res.status(201).json(newConta);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível criar a conta.' });
  }
});

export default router;