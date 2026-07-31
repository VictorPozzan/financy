import { Field, ID, InputType, Int } from "type-graphql";
import { TransactionType } from "../../models/transaction-type.enum";

@InputType()
export class UpdateTransactionInput {
  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  amount?: number;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => Date, { nullable: true })
  date?: Date;

  @Field(() => ID, { nullable: true })
  categoryId?: string;
}
