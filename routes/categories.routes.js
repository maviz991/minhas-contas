import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar as categorias.' });
  }
});

/**
 * ROTA POST /categories
 * Cria uma nova categoria.
 */
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível criar a categoria.' });
  }
});

export default router;