# Financy — Frontend

SPA React para gestão de finanças, consumindo a API GraphQL do backend.

## Stack

TypeScript · React 19 · Vite · Apollo Client · React Router · Zustand · Tailwind CSS · shadcn/ui (primitivos Radix) · React Hook Form · Zod

## Setup

```bash
npm install
cp .env.example .env   # preencha VITE_BACKEND_URL=http://localhost:4000
npm run dev
```

A aplicação sobe em `http://localhost:5173`. Requer o backend rodando.

## Scripts

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — preview do build

## Estrutura

```
src/
  components/       Layout, Header, Dialogs compartilhados, primitivos ui/
  pages/            Login, Register, Dashboard, Transactions, Categories, Profile
  lib/graphql/      apollo client, fragments, queries/, mutations/
  lib/constants.ts  ícones e cores de categoria
  stores/auth.ts    estado de autenticação (Zustand + persist)
  types/            tipos TS espelhando o schema GraphQL
```
