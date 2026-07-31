import { Field, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class DashboardSummaryOutput {
  @Field(() => Int)
  balance!: number;

  @Field(() => Int)
  monthlyIncome!: number;

  @Field(() => Int)
  monthlyExpenses!: number;

  @Field(() => [TransactionModel])
  recentTransactions!: TransactionModel[];
}
