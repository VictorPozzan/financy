# Financy — Backend

API GraphQL para gestão de finanças (transações e categorias), com autenticação JWT.

## Stack

TypeScript · Express 5 · Apollo Server 5 · TypeGraphQL (code-first) · Prisma 6 · SQLite · JWT · bcryptjs

## Setup

```bash
npm install
cp .env.example .env   # preencha JWT_SECRET
npx prisma migrate dev
npm run seed            # opcional: cria o usuário conta@teste.com / 12345678
npm run dev
```

A API sobe em `http://localhost:4000/graphql`.

## Scripts

- `npm run dev` — servidor com hot reload
- `npm run build` / `npm start` — build e execução em produção
- `npm run migrate` — aplica migrations do Prisma
- `npm run seed` — popula o banco com dados de exemplo

## Estrutura

```
prisma/         schema, migrations, seed, singleton do PrismaClient
src/
  models/        tipos GraphQL (@ObjectType)
  dtos/          inputs e outputs (@InputType/@ObjectType)
  resolvers/      queries/mutations (@Resolver)
  services/        regras de negócio + acesso ao Prisma
  middlewares/      IsAuth (proteção de resolvers)
  graphql/context/  extração do JWT do header Authorization
  utils/            jwt.ts, hash.ts
```
