import { prismaClient } from "../../prisma/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import { RegisterInput } from "../dtos/input/register.input";
import { LoginInput } from "../dtos/input/login.input";

export class AuthService {
  async register(data: RegisterInput) {
    const existing = await prismaClient.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error("Já existe uma conta com este e-mail");

    const password = await hashPassword(data.password);
    const user = await prismaClient.user.create({
      data: { name: data.name, email: data.email, password },
    });

    const token = signJwt({ id: user.id });
    return { token, user };
  }

  async login(data: LoginInput) {
    const user = await prismaClient.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error("E-mail ou senha inválidos");

    const valid = await comparePassword(data.password, user.password);
    if (!valid) throw new Error("E-mail ou senha inválidos");

    const token = signJwt({ id: user.id });
    return { token, user };
  }
}
