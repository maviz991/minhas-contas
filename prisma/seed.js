import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('--- Start simple seed test ---');
  
  try {
    const testCategory = await prisma.category.create({
      data: {
        name: 'Teste',
        icon: 'test-icon',
        color: '#000000',
        type: 'EXPENSE',
      },
    });
    console.log('--- SUCCESS: Created test category ---', testCategory);
  } catch (error) {
    console.error('--- ERROR: Failed to create test category ---');
    console.error(error);
    throw error; // Força a falha do script para vermos o erro
  }

  console.log('--- Simple seed test finished ---');
}

main()
  .catch(e => {
    console.error('CRITICAL ERROR in main function:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });