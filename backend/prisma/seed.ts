import { Category, PrismaClient, TransactionType } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
  const password = await hashPassword("12345678");

  const user = await prisma.user.upsert({
    where: { email: "conta@teste.com" },
    update: {},
    create: {
      name: "Conta teste",
      email: "conta@teste.com",
      password,
    },
  });

  const categoriesData = [
    { title: "Alimentação", description: "Restaurantes, delivery e refeições", icon: "utensils", color: "blue" },
    { title: "Transporte", description: "Gasolina, transporte público e viagens", icon: "car-front", color: "purple" },
    { title: "Mercado", description: "Compras de supermercado e mantimentos", icon: "shopping-cart", color: "orange" },
    { title: "Entretenimento", description: "Cinema, jogos e lazer", icon: "ticket", color: "pink" },
    { title: "Utilidades", description: "Energia, água, internet e telefone", icon: "tool-case", color: "yellow" },
    { title: "Salário", description: "Renda mensal e bonificações", icon: "briefcase-business", color: "green" },
    { title: "Investimento", description: "Aplicações e retornos financeiros", icon: "piggy-bank", color: "green" },
    { title: "Saúde", description: "Medicamentos, consultas e exames", icon: "heart-pulse", color: "red" },
  ];

  const categories: Category[] = [];
  for (const data of categoriesData) {
    const category = await prisma.category.upsert({
      where: { id: `${user.id}-${data.title}` },
      update: {},
      create: { id: `${user.id}-${data.title}`, userId: user.id, ...data },
    });
    categories.push(category);
  }

  const byTitle = (title: string) => categories.find((c) => c.title === title)!.id;

  const transactionsData = [
    { description: "Pagamento de Salário", amount: 425000, type: TransactionType.INCOME, date: "2025-12-01", categoryId: byTitle("Salário") },
    { description: "Jantar no Restaurante", amount: 8950, type: TransactionType.EXPENSE, date: "2025-11-30", categoryId: byTitle("Alimentação") },
    { description: "Posto de Gasolina", amount: 10000, type: TransactionType.EXPENSE, date: "2025-11-29", categoryId: byTitle("Transporte") },
    { description: "Compras no Mercado", amount: 15680, type: TransactionType.EXPENSE, date: "2025-11-28", categoryId: byTitle("Mercado") },
    { description: "Retorno de Investimento", amount: 34025, type: TransactionType.INCOME, date: "2025-11-26", categoryId: byTitle("Investimento") },
  ];

  for (const data of transactionsData) {
    await prisma.transaction.create({
      data: { ...data, date: new Date(data.date), userId: user.id },
    });
  }

  console.log("Seed concluído:", user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
