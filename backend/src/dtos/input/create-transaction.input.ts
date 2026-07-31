import { Field, ID, InputType, Int } from "type-graphql";
import { TransactionType } from "../../models/transaction-type.enum";

@InputType()
export class CreateTransactionInput {
  @Field(() => String)
  description!: string;

  @Field(() => Int)
  amount!: number;

  @Field(() => TransactionType)
  type!: TransactionType;

  @Field(() => Date)
  date!: Date;

  @Field(() => ID)
  categoryId!: string;
}
