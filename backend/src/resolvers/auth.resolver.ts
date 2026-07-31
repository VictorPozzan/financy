import { Arg, Mutation, Resolver } from "type-graphql";
import { AuthOutput } from "../dtos/output/auth-output";
import { RegisterInput } from "../dtos/input/register.input";
import { LoginInput } from "../dtos/input/login.input";
import { AuthService } from "../services/auth.service";

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => AuthOutput)
  register(@Arg("data", () => RegisterInput) data: RegisterInput) {
    return this.authService.register(data);
  }

  @Mutation(() => AuthOutput)
  login(@Arg("data", () => LoginInput) data: LoginInput) {
    return this.authService.login(data);
  }
}
