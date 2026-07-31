import {
  Arg,
  Ctx,
  FieldResolver,
  ID,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { TransactionModel } from "../models/transaction.model";
import { CategoryModel } from "../models/category.model";
import { TransactionsPageOutput } from "../dtos/output/transactions-page-output";
import { DashboardSummaryOutput } from "../dtos/output/dashboard-summary-output";
import { CreateTransactionInput } from "../dtos/input/create-transaction.input";
import { UpdateTransactionInput } from "../dtos/input/update-transaction.input";
import { TransactionFiltersInput } from "../dtos/input/transaction-filters.input";
import { TransactionService } from "../services/transaction.service";
import { GraphqlContext } from "../graphql/context";
import { IsAuth } from "../middlewares/auth.middleware";

@Resolver(() => TransactionModel)
@UseMiddleware(IsAuth)
export class TransactionResolver {
  private transactionService = new TransactionService();

  @Query(() => TransactionsPageOutput)
  listTransactions(
    @Arg("filters", () => TransactionFiltersInput, { nullable: true }) filters: TransactionFiltersInput | null,
    @Ctx() ctx: GraphqlContext
  ) {
    return this.transactionService.list(ctx.user!, filters);
  }

  @Query(() => DashboardSummaryOutput)
  dashboardSummary(@Ctx() ctx: GraphqlContext) {
    return this.transactionService.dashboardSummary(ctx.user!);
  }

  @Mutation(() => TransactionModel)
  createTransaction(@Arg("data", () => CreateTransactionInput) data: CreateTransactionInput, @Ctx() ctx: GraphqlContext) {
    return this.transactionService.create(ctx.user!, data);
  }

  @Mutation(() => TransactionModel)
  updateTransaction(
    @Arg("id", () => ID) id: string,
    @Arg("data", () => UpdateTransactionInput) data: UpdateTransactionInput,
    @Ctx() ctx: GraphqlContext
  ) {
    return this.transactionService.update(id, ctx.user!, data);
  }

  @Mutation(() => Boolean)
  deleteTransaction(@Arg("id", () => ID) id: string, @Ctx() ctx: GraphqlContext) {
    return this.transactionService.delete(id, ctx.user!);
  }

  @FieldResolver(() => CategoryModel)
  category(@Root() transaction: TransactionModel) {
    return this.transactionService.findCategory(transaction.categoryId);
  }
}
