import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Sembrando datos en Night City...');

  // Limpiar datos viejos
  await prisma.transaction.deleteMany();
  await prisma.category.deleteMany();

  // Crear Categorías
  const c1 = await prisma.category.create({ data: { name: 'Trabajos', icon: '💼', color: '#00f3ff' } });
  const c2 = await prisma.category.create({ data: { name: 'Ciberware', icon: '🦾', color: '#ff00ff' } });
  const c3 = await prisma.category.create({ data: { name: 'Comida', icon: '🍜', color: '#facc15' } });
  const c4 = await prisma.category.create({ data: { name: 'Vivienda', icon: '🏠', color: '#10b981' } });

  // Crear Transacciones
  await prisma.transaction.createMany({
    data: [
      { amount: 5000, description: 'Contrato Arasaka', type: 'INCOME', categoryId: c1.id },
      { amount: 200, description: 'Ramen Callejero', type: 'EXPENSE', categoryId: c3.id },
      { amount: 1500, description: 'Implante Ocular Kiroshi', type: 'EXPENSE', categoryId: c2.id },
      { amount: 800, description: 'Alquiler Megatorre H10', type: 'EXPENSE', categoryId: c4.id },
      { amount: 300, description: 'Hackeo Menor', type: 'INCOME', categoryId: c1.id },
    ]
  });

  console.log('✅ Datos sembrados correctamente.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());