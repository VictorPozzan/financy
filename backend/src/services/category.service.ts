import { prismaClient } from "../../prisma/prisma";
import { CreateCategoryInput } from "../dtos/input/create-category.input";
import { UpdateCategoryInput } from "../dtos/input/update-category.input";

export class CategoryService {
  list(userId: string) {
    return prismaClient.category.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  }

  async findOwned(id: string, userId: string) {
    const category = await prismaClient.category.findFirst({ where: { id, userId } });
    if (!category) throw new Error("Categoria não encontrada");
    return category;
  }

  create(userId: string, data: CreateCategoryInput) {
    return prismaClient.category.create({ data: { ...data, userId } });
  }

  async update(id: string, userId: string, data: UpdateCategoryInput) {
    await this.findOwned(id, userId);
    return prismaClient.category.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    await this.findOwned(id, userId);
    const transactionsCount = await prismaClient.transaction.count({ where: { categoryId: id } });
    if (transactionsCount > 0) {
      throw new Error("Não é possível excluir uma categoria com transações vinculadas");
    }
    await prismaClient.category.delete({ where: { id } });
    return true;
  }
}
