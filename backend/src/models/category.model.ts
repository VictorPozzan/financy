import { Field, ID, Int, ObjectType } from "type-graphql";

@ObjectType()
export class CategoryModel {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String)
  icon!: string;

  @Field(() => String)
  color!: string;

  @Field(() => ID)
  userId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => Int)
  transactionsCount!: number;

  @Field(() => Int)
  totalAmount!: number;
}
