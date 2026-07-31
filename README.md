# Financy

Aplicação fullstack de gestão financeira pessoal: controle de transações e categorias, com autenticação por usuário. Desenvolvida como desafio prático da pós-graduação (Rocketseat FTR), seguindo fielmente o [layout do Figma](https://www.figma.com/community/file/1580994817007013257) fornecido no enunciado.

## Funcionalidades

- Criar conta e fazer login
- Dashboard com saldo total, receitas/despesas do mês, transações recentes e resumo de categorias
- Transações: criar, editar, excluir, listar (com busca, filtros e paginação)
- Categorias: criar, editar, excluir, listar (com estatísticas de uso)
- Cada usuário só vê e só gerencia os próprios dados
- Edição de perfil e logout

## Stack

| | Backend | Frontend |
|---|---|---|
| Linguagem | TypeScript | TypeScript |
| Framework | Express 5 | React 19 + Vite |
| API | GraphQL (Apollo Server + TypeGraphQL, code-first) | Apollo Client |
| Dados | Prisma + SQLite | Zustand (estado de auth) |
| Auth | JWT (`jsonwebtoken` + `bcryptjs`) | React Hook Form + Zod |
| Estilo  | Tailwind CSS + shadcn/ui |

## Estrutura do repositório

```
Financy/
├── backend/    API GraphQL veja backend/README.md
└── frontend/   SPA React veja frontend/README.md
```

Cada subpasta é independente (`package.json`, `.env.example` e instruções de setup próprios).

## Como rodar

```bash
git clone https://github.com/VictorPozzan/financy.git
cd financy

# Terminal 1 backend (sobe em http://localhost:4000)
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run seed      # opcional: cria conta@teste.com / 12345678 com dados de exemplo
npm run dev

# Terminal 2 frontend (sobe em http://localhost:5173)
cd frontend
npm install
cp .env.example .env
npm run dev
```

Detalhes de cada variável de ambiente, scripts disponíveis e estrutura interna estão nos READMEs de [`backend/`](./backend/README.md) e [`frontend/`](./frontend/README.md).

## Design

O layout segue o Style Guide do Figma do projeto cores, tipografia, ícones e componentes foram extraídos diretamente do arquivo de design.