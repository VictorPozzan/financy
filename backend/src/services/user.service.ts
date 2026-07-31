import { prismaClient } from "../../prisma/prisma";
import { UpdateProfileInput } from "../dtos/input/update-profile.input";

export class UserService {
  async findById(id: string) {
    const user = await prismaClient.user.findUnique({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  updateProfile(id: string, data: UpdateProfileInput) {
    return prismaClient.user.update({ where: { id }, data: { name: data.name } });
  }
}
