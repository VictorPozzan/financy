import type { Request, Response } from "express";
import { verifyJwt } from "../../utils/jwt";

export interface GraphqlContext {
  user?: string;
  token?: string;
  req: Request;
  res: Response;
}

export async function buildContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<GraphqlContext> {
  const authHeader = req.headers.authorization;
  let user: string | undefined;
  let token: string | undefined;

  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.substring("Bearer ".length);
    try {
      const payload = verifyJwt(token);
      user = payload.id;
    } catch {
      // token inválido/expirado segue sem usuário; IsAuth barra o acesso quando necessário
    }
  }

  return { user, token, req, res };
}
