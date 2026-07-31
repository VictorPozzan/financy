import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "type-graphql";

import { AuthResolver } from "./resolvers/auth.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { CategoryResolver } from "./resolvers/category.resolver";
import { TransactionResolver } from "./resolvers/transaction.resolver";
import { buildContext, GraphqlContext } from "./graphql/context";

async function bootstrap() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
      credentials: true,
    })
  );

  const schema = await buildSchema({
    resolvers: [AuthResolver, UserResolver, CategoryResolver, TransactionResolver],
    validate: false,
    emitSchemaFile: "./schema.graphql",
  });

  const server = new ApolloServer<GraphqlContext>({ schema });
  await server.start();

  app.use("/graphql", express.json(), expressMiddleware(server, { context: buildContext }));

  const port = process.env.PORT ?? 4000;
  app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}/graphql`);
  });
}

bootstrap();
