import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, CircleArrowDown, CircleArrowUp, Plus, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TransactionDialog } from "@/components/TransactionDialog";
import { DASHBOARD_SUMMARY } from "@/lib/graphql/queries/transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories";
import { getCategoryColor, getCategoryIcon } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Category, DashboardSummary } from "@/types";

export function DashboardPage() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data } = useQuery<{ dashboardSummary: DashboardSummary }>(DASHBOARD_SUMMARY);
  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES);

  const summary = data?.dashboardSummary;
  const categories = (categoriesData?.listCategories ?? []).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <Wallet className="h-4 w-4 text-category-purple-text" />
            Saldo total
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(summary?.balance ?? 0)}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <CircleArrowUp className="h-4 w-4 text-success" />
            Receitas do mês
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(summary?.monthlyIncome ?? 0)}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <CircleArrowDown className="h-4 w-4 text-destructive" />
            Despesas do mês
          </div>
          <p className="mt-2 text-2xl font-bold text-foreground">
            {formatCurrency(summary?.monthlyExpenses ?? 0)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Transações recentes</span>
            <Link to="/transacoes" className="flex items-center text-sm font-medium text-primary hover:underline">
              Ver todas
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            {summary?.recentTransactions.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Nenhuma transação ainda</p>
            )}
            {summary?.recentTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category.icon);
              const colors = getCategoryColor(transaction.category.color);
              const isIncome = transaction.type === "INCOME";
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 border-b border-border px-6 py-3.5 last:border-0"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", colors.bg)}>
                      <Icon className={cn("h-4 w-4", colors.text)} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <Badge className={cn(colors.bg, colors.text)}>{transaction.category.title}</Badge>
                  <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold">
                    <span className={isIncome ? "text-success" : "text-destructive"}>
                      {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                    </span>
                    {isIncome ? (
                      <CircleArrowUp className="h-4 w-4 text-success" />
                    ) : (
                      <CircleArrowDown className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="flex w-full items-center justify-center gap-2 py-4 text-sm font-medium text-primary hover:bg-secondary"
          >
            <Plus className="h-4 w-4" />
            Nova transação
          </button>
        </Card>

        <Card className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Categorias</span>
            <Link to="/categorias" className="flex items-center text-sm font-medium text-primary hover:underline">
              Gerenciar
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            {categories.length === 0 && (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Nenhuma categoria ainda</p>
            )}
            {categories.map((category) => {
              const colors = getCategoryColor(category.color);
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between gap-3 border-b border-border px-6 py-3.5 last:border-0"
                >
                  <Badge className={cn(colors.bg, colors.text)}>{category.title}</Badge>
                  <span className="text-sm text-muted-foreground">{category.transactionsCount} itens</span>
                  <span className="text-sm font-semibold text-foreground">{formatCurrency(category.totalAmount)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <TransactionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
