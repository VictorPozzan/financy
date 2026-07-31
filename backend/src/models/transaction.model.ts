import { Field, ID, Int, ObjectType } from "type-graphql";
import { TransactionType } from "./transaction-type.enum";
import { CategoryModel } from "./category.model";

@ObjectType()
export class TransactionModel {
  @Field(() => ID)
  id!: string;

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

  @Field(() => ID)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => CategoryModel)
  category!: CategoryModel;
}
