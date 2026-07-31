import { Field, Int, ObjectType } from "type-graphql";
import { TransactionModel } from "../../models/transaction.model";

@ObjectType()
export class TransactionsPageOutput {
  @Field(() => [TransactionModel])
  items!: TransactionModel[];

  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;
}
