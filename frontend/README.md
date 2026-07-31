# Financy — Frontend

SPA React que consome a API GraphQL do backend para gestão de finanças pessoais. Layout fiel ao [Style Guide do Figma](https://www.figma.com/community/file/1580994817007013257) do projeto.

## Funcionalidades

- Login e cadastro de conta
- Dashboard com saldo total, receitas/despesas do mês, transações recentes e resumo de categorias
- Transações: listar (com busca, filtro por tipo/categoria e paginação), criar, editar, excluir
- Categorias: listar com estatísticas (total de categorias/transações, categoria mais usada), criar, editar, excluir
- Perfil: editar nome, logout

## Stack

TypeScript · React 19 · Vite (sem framework) · Apollo Client · React Router · Zustand (com `persist`) · Tailwind CSS · shadcn/ui (primitivos Radix) · React Hook Form · Zod · lucide-react

## Requisitos

- Node.js 20+
- npm
- Backend rodando (veja `../backend/README.md`)

## Setup

```bash
npm install
cp .env.example .env   # preencha VITE_BACKEND_URL=http://localhost:4000
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Variáveis de ambiente (`.env.example`)

| Variável | Descrição |
|---|---|
| `VITE_BACKEND_URL` | URL base da API GraphQL do backend (sem `/graphql` no final — é acrescentado automaticamente pelo Apollo Client). Ex.: `http://localhost:4000` |

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Sobe o servidor de desenvolvimento (Vite) |
| `npm run build` | Type-check (`tsc -b`) + build de produção em `dist/` |
| `npm run preview` | Serve o build de produção localmente para conferência |
| `npm run lint` | Roda o `oxlint` |

## Estrutura

```
src/
  main.tsx              bootstrap: ApolloProvider > BrowserRouter > App + Toaster (sonner)
  App.tsx                 rotas + ProtectedRoute/PublicRoute
  components/
    Layout.tsx              shell com <Outlet/>; Header só aparece se autenticado
    Header.tsx               navbar: logo, links, avatar
    Logo.tsx
    TransactionDialog.tsx     modal de criar/editar transação
    CategoryDialog.tsx        modal de criar/editar categoria
    ConfirmDialog.tsx         modal genérico de confirmação de exclusão
    ui/                       primitivos shadcn: button, input, label, select, dialog, card, badge, avatar
  pages/
    Login/  Register/  Dashboard/  Transactions/  Categories/  Profile/
  lib/
    graphql/
      apollo.ts               ApolloClient + link de autenticação (injeta o token do Zustand)
      fragments.ts
      queries/                 dashboard, categorias, transações
      mutations/                 auth, categorias, transações, perfil
    constants.ts                 ícones (Lucide) e paleta de cores das categorias, extraídos do Figma
    utils.ts                     cn(), formatCurrency, formatDate, getInitials
  stores/auth.ts                  estado de autenticação (Zustand + persist em localStorage)
  types/                           tipos TS espelhando o schema GraphQL
```

## Design system

Cores, tipografia (Inter) e ícones ([Lucide](https://lucide.dev)) foram extraídos diretamente do arquivo do Figma via API (tokens em `src/index.css` e `src/lib/constants.ts`), não aproximados visualmente. Ao alterar cores/espaçamentos, prefira ajustar os tokens em `index.css` a hardcodar valores nos componentes.

## Notas de implementação

- O cache do Apollo Client é limpo (`apolloClient.clearStore()`) em login, cadastro e logout — evita que dados de uma sessão anterior vazem para o próximo usuário autenticado no mesmo navegador.
- Formulários usam React Hook Form + Zod; os dois modais (transação/categoria) resetam os campos via `useEffect` ao abrir, permitindo reuso do mesmo componente para criar e editar.
