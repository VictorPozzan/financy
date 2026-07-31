# Financy - Backend

API GraphQL para gestão de finanças pessoais: cadastro/login de usuários e CRUD de categorias e transações, com isolamento de dados por usuário.

## Funcionalidades

- Cadastro de conta e login (JWT)
- Categorias: criar, listar, editar, excluir (bloqueado se houver transações vinculadas)
- Transações: criar, listar (com filtros por descrição/tipo/categoria/período e paginação), editar, excluir
- Cada usuário só enxerga e só consegue alterar os próprios dados validado em toda query/mutation, não só na listagem

## Stack

TypeScript · Express 5 · Apollo Server 5 · TypeGraphQL (code-first) · Prisma 6 · SQLite · JWT (`jsonwebtoken`) · `bcryptjs` · `cors`

## Requisitos

- Node.js 20+
- npm

## Setup

```bash
npm install
cp .env.example .env      # preencha JWT_SECRET com qualquer string aleatória
npx prisma migrate dev    # cria backend/prisma/dev.db e aplica o schema
npm run seed               # opcional: cria o usuário conta@teste.com / senha 12345678, com categorias e transações de exemplo
npm run dev
```

A API sobe em `http://localhost:4000/graphql` (Apollo Sandbox disponível nessa URL via navegador em ambiente de desenvolvimento).

## Variáveis de ambiente (`.env.example`)

| Variável | Descrição |
|---|---|
| `JWT_SECRET` | Chave usada para assinar/verificar os tokens JWT. Qualquer string em dev; use um valor forte e secreto em produção |
| `DATABASE_URL` | Connection string do Prisma. Padrão `file:./dev.db` (SQLite local) |
| `CORS_ORIGIN` | Origem liberada pelo CORS. Padrão `http://localhost:5173` (URL do frontend em dev) |

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor com hot reload (`tsx watch`) |
| `npm run build` | Compila para `dist/` (`tsc`) |
| `npm start` | Executa o build de produção (`node dist/src/index.js`) |
| `npm run migrate` | Aplica migrations do Prisma (`prisma migrate dev`) |
| `npm run generate` | Regenera o Prisma Client a partir do schema |
| `npm run seed` | Popular o banco com um usuário e dados de exemplo (`prisma/seed.ts`) |

## Estrutura

```
prisma/
  schema.prisma       modelos User, Category, Transaction (+ enum TransactionType)
  prisma.ts           singleton do PrismaClient
  seed.ts             dados de exemplo
  migrations/
src/
  index.ts             bootstrap: Express + CORS + Apollo Server + buildSchema (code-first)
  models/              tipos GraphQL de saída (@ObjectType)
  dtos/
    input/              @InputType payloads de mutations/queries
    output/              @ObjectType compostos (ex.: resposta de auth, resumo do dashboard)
  resolvers/            @Resolver uma classe por domínio (auth, user, category, transaction)
  services/              regras de negócio + acesso ao Prisma (chamado pelos resolvers)
  middlewares/
    auth.middleware.ts    IsAuth bloqueia resolvers para quem não está autenticado
  graphql/context/       extrai e valida o JWT do header Authorization em cada request
  utils/
    jwt.ts                sign/verify do token
    hash.ts               hash/compare de senha (bcryptjs)
```

**Padrão de camadas**: `Resolver → Service → Prisma`. Resolvers nunca acessam o Prisma diretamente; toda regra de negócio (e toda checagem de posse "esse registro é mesmo do usuário logado?") vive na camada de `services`. O `schema.graphql` na raiz do projeto é **gerado automaticamente** pelo `buildSchema` a partir dos decorators não deve ser editado à mão.

## Testando a API

Com o servidor rodando, exemplo de fluxo completo via `curl`:

```bash
# 1. Criar conta
curl -X POST http://localhost:4000/graphql -H "Content-Type: application/json" -d '{
  "query": "mutation($d: RegisterInput!) { register(data: $d) { token user { id name email } } }",
  "variables": { "d": { "name": "Seu Nome", "email": "voce@teste.com", "password": "12345678" } }
}'

# 2. Usar o token retornado para criar uma categoria (troque SEU_TOKEN)
curl -X POST http://localhost:4000/graphql -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{
  "query": "mutation($d: CreateCategoryInput!) { createCategory(data: $d) { id title } }",
  "variables": { "d": { "title": "Alimentação", "icon": "utensils", "color": "blue" } }
}'
```

Ou use o Apollo Sandbox em `http://localhost:4000/graphql` pelo navegador.
