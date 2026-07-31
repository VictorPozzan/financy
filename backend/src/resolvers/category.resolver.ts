import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { CategoryModel } from "../models/category.model";
import { CreateCategoryInput } from "../dtos/input/create-category.input";
import { UpdateCategoryInput } from "../dtos/input/update-category.input";
import { CategoryService } from "../services/category.service";
import { GraphqlContext } from "../graphql/context";
import { IsAuth } from "../middlewares/auth.middleware";
import { prismaClient } from "../../prisma/prisma";

@Resolver(() => CategoryModel)
@UseMiddleware(IsAuth)
export class CategoryResolver {
  private categoryService = new CategoryService();

  @Query(() => [CategoryModel])
  listCategories(@Ctx() ctx: GraphqlContext) {
    return this.categoryService.list(ctx.user!);
  }

  @Mutation(() => CategoryModel)
  createCategory(@Arg("data", () => CreateCategoryInput) data: CreateCategoryInput, @Ctx() ctx: GraphqlContext) {
    return this.categoryService.create(ctx.user!, data);
  }

  @Mutation(() => CategoryModel)
  updateCategory(
    @Arg("id", () => ID) id: string,
    @Arg("data", () => UpdateCategoryInput) data: UpdateCategoryInput,
    @Ctx() ctx: GraphqlContext
  ) {
    return this.categoryService.update(id, ctx.user!, data);
  }

  @Mutation(() => Boolean)
  deleteCategory(@Arg("id", () => ID) id: string, @Ctx() ctx: GraphqlContext) {
    return this.categoryService.delete(id, ctx.user!);
  }

  @FieldResolver(() => Int)
  async transactionsCount(@Root() category: CategoryModel) {
    return prismaClient.transaction.count({ where: { categoryId: category.id } });
  }

  @FieldResolver(() => Int)
  async totalAmount(@Root() category: CategoryModel) {
    const result = await prismaClient.transaction.aggregate({
      where: { categoryId: category.id },
      _sum: { amount: true },
    });
    return result._sum.amount ?? 0;
  }
}
