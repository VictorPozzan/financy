import { Prisma } from "@prisma/client";
import { prismaClient } from "../../prisma/prisma";
import { CreateTransactionInput } from "../dtos/input/create-transaction.input";
import { UpdateTransactionInput } from "../dtos/input/update-transaction.input";
import { TransactionFiltersInput } from "../dtos/input/transaction-filters.input";

const DEFAULT_PAGE_SIZE = 10;

export class TransactionService {
  private async ensureCategoryOwnership(categoryId: string, userId: string) {
    const category = await prismaClient.category.findFirst({ where: { id: categoryId, userId } });
    if (!category) throw new Error("Categoria não encontrada");
  }

  async list(userId: string, filters?: TransactionFiltersInput | null) {
    const page = filters?.page && filters.page > 0 ? filters.page : 1;
    const pageSize = filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : DEFAULT_PAGE_SIZE;

    const where: Prisma.TransactionWhereInput = { userId };
    if (filters?.search) where.description = { contains: filters.search };
    if (filters?.type) where.type = filters.type;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.month && filters?.year) {
      const start = new Date(filters.year, filters.month - 1, 1);
      const end = new Date(filters.year, filters.month, 1);
      where.date = { gte: start, lt: end };
    }

    const [items, total] = await Promise.all([
      prismaClient.transaction.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prismaClient.transaction.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOwned(id: string, userId: string) {
    const transaction = await prismaClient.transaction.findFirst({ where: { id, userId } });
    if (!transaction) throw new Error("Transação não encontrada");
    return transaction;
  }

  async create(userId: string, data: CreateTransactionInput) {
    await this.ensureCategoryOwnership(data.categoryId, userId);
    return prismaClient.transaction.create({ data: { ...data, userId } });
  }

  async update(id: string, userId: string, data: UpdateTransactionInput) {
    await this.findOwned(id, userId);
    if (data.categoryId) await this.ensureCategoryOwnership(data.categoryId, userId);
    return prismaClient.transaction.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    await this.findOwned(id, userId);
    await prismaClient.transaction.delete({ where: { id } });
    return true;
  }

  findCategory(categoryId: string) {
    return prismaClient.category.findUnique({ where: { id: categoryId } });
  }

  async dashboardSummary(userId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [allTransactions, monthTransactions, recentTransactions] = await Promise.all([
      prismaClient.transaction.findMany({ where: { userId } }),
      prismaClient.transaction.findMany({ where: { userId, date: { gte: monthStart, lt: monthEnd } } }),
      prismaClient.transaction.findMany({ where: { userId }, orderBy: { date: "desc" }, take: 5 }),
    ]);

    const balance = allTransactions.reduce(
      (acc, t) => acc + (t.type === "INCOME" ? t.amount : -t.amount),
      0
    );
    const monthlyIncome = monthTransactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + t.amount, 0);
    const monthlyExpenses = monthTransactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + t.amount, 0);

    return { balance, monthlyIncome, monthlyExpenses, recentTransactions };
  }
}
