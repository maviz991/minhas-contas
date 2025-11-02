import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

/**
 * @route   GET /categories
 * @desc    Busca todas as categorias. Pode ser filtrado por tipo.
 * @access  Public
 * @query   type ('INCOME' ou 'EXPENSE') - Opcional
 */
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // Pega o tipo da URL (ex: /categories?type=EXPENSE)

    const whereClause = {};
    if (type && (type.toUpperCase() === 'INCOME' || type.toUpperCase() === 'EXPENSE')) {
      // Adiciona o filtro se o tipo for válido. Usamos toUpperCase() para ser mais robusto.
      whereClause.type = type.toUpperCase();
    }

    const categories = await prisma.category.findMany({
      where: whereClause,
      orderBy: {
        name: 'asc', // Ordena as categorias em ordem alfabética
      },
    });

    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ error: 'Não foi possível buscar as categorias.' });
  }
});

/**
 * @route   POST /categories
 * @desc    Cria uma nova categoria (usado principalmente para seeding ou gerenciamento futuro)
 * @access  Public
 */
router.post('/', async (req, res) => {
  try {
    const { name, icon, color, type } = req.body;

    // Validação básica dos dados recebidos
    if (!name || !icon || !color || !type) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios: name, icon, color, type.' });
    }
    if (type.toUpperCase() !== 'INCOME' && type.toUpperCase() !== 'EXPENSE') {
        return res.status(400).json({ error: "O campo 'type' deve ser 'INCOME' ou 'EXPENSE'." });
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
        icon,
        color,
        type: type.toUpperCase(),
      },
    });

    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    // Trata o erro de campo único (nome da categoria já existe)
    if (error.code === 'P2002') {
        return res.status(409).json({ error: `A categoria '${req.body.name}' já existe.` });
    }
    res.status(500).json({ error: 'Não foi possível criar a categoria.' });
  }
});

export default router;