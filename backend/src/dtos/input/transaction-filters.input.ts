import { Field, ID, InputType, Int } from "type-graphql";
import { TransactionType } from "../../models/transaction-type.enum";

@InputType()
export class TransactionFiltersInput {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field(() => TransactionType, { nullable: true })
  type?: TransactionType;

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => Int, { nullable: true })
  month?: number;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => Int, { nullable: true })
  page?: number;

  @Field(() => Int, { nullable: true })
  pageSize?: number;
}
