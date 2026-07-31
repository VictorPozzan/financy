import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { UserModel } from "../models/user.model";
import { UpdateProfileInput } from "../dtos/input/update-profile.input";
import { UserService } from "../services/user.service";
import { GraphqlContext } from "../graphql/context";
import { IsAuth } from "../middlewares/auth.middleware";

@Resolver()
@UseMiddleware(IsAuth)
export class UserResolver {
  private userService = new UserService();

  @Query(() => UserModel)
  me(@Ctx() ctx: GraphqlContext) {
    return this.userService.findById(ctx.user!);
  }

  @Mutation(() => UserModel)
  updateProfile(@Arg("data", () => UpdateProfileInput) data: UpdateProfileInput, @Ctx() ctx: GraphqlContext) {
    return this.userService.updateProfile(ctx.user!, data);
  }
}
