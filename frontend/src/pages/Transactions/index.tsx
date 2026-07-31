import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
  ChevronLeft,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
  SquarePen,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransactionDialog } from "@/components/TransactionDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LIST_TRANSACTIONS } from "@/lib/graphql/queries/transactions";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories";
import { DELETE_TRANSACTION } from "@/lib/graphql/mutations/transactions";
import { getCategoryColor, getCategoryIcon } from "@/lib/constants";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { Category, Transaction, TransactionsPage as TransactionsPageType } from "@/types";

const PAGE_SIZE = 10;

export function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, categoryId]);

  const filters = {
    search: debouncedSearch || undefined,
    type: type === "all" ? undefined : type,
    categoryId: categoryId === "all" ? undefined : categoryId,
    page,
    pageSize: PAGE_SIZE,
  };

  const { data, refetch } = useQuery<{ listTransactions: TransactionsPageType }>(LIST_TRANSACTIONS, {
    variables: { filters },
  });
  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES);
  const categories = categoriesData?.listCategories ?? [];

  const [deleteTransaction, { loading: deleting }] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ["ListTransactions", "DashboardSummary", "ListCategories"],
  });

  const transactionsPage = data?.listTransactions;
  const totalPages = transactionsPage ? Math.max(1, Math.ceil(transactionsPage.total / PAGE_SIZE)) : 1;

  async function handleDelete() {
    if (!deletingTransaction) return;
    try {
      await deleteTransaction({ variables: { id: deletingTransaction.id } });
      toast.success("Transação excluída");
      setDeletingTransaction(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transações</h1>
          <p className="text-sm text-muted-foreground">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button
          onClick={() => {
            setEditingTransaction(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nova transação
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground-muted">Buscar</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
            <Input
              placeholder="Buscar por descrição"
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground-muted">Tipo</label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="EXPENSE">Despesa</SelectItem>
              <SelectItem value="INCOME">Receita</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground-muted">Categoria</label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wide text-subtle-foreground">
              <th className="px-6 py-3">Descrição</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3">Categoria</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3 text-right">Valor</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactionsPage?.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-muted-foreground">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
            {transactionsPage?.items.map((transaction) => {
              const Icon = getCategoryIcon(transaction.category.icon);
              const colors = getCategoryColor(transaction.category.color);
              const isIncome = transaction.type === "INCOME";
              return (
                <tr key={transaction.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", colors.bg)}>
                        <Icon className={cn("h-4 w-4", colors.icon)} />
                      </span>
                      <span className="text-base font-medium text-foreground">{transaction.description}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-muted-foreground">{formatDate(transaction.date)}</td>
                  <td className="px-6 py-3.5">
                    <Badge className={cn(colors.bg, colors.text)}>{transaction.category.title}</Badge>
                  </td>
                  <td className="px-6 py-3.5">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 font-medium",
                        isIncome ? "text-category-green-text" : "text-category-red-text"
                      )}
                    >
                      {isIncome ? (
                        <CircleArrowUp className="h-4 w-4 text-primary" />
                      ) : (
                        <CircleArrowDown className="h-4 w-4 text-category-red-icon" />
                      )}
                      {isIncome ? "Entrada" : "Saída"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right font-semibold text-foreground">
                    {isIncome ? "+" : "-"} {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline-destructive"
                        size="icon"
                        onClick={() => setDeletingTransaction(transaction)}
                        aria-label="Excluir"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setEditingTransaction(transaction);
                          setDialogOpen(true);
                        }}
                        aria-label="Editar"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transactionsPage && transactionsPage.total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-foreground-muted">
          <span>
            {(page - 1) * PAGE_SIZE + 1} a {Math.min(page * PAGE_SIZE, transactionsPage.total)} |{" "}
            {transactionsPage.total} resultados
          </span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === page ? "default" : "outline"} size="icon" onClick={() => setPage(p)}>
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
        onSaved={() => refetch()}
      />
      <ConfirmDialog
        open={Boolean(deletingTransaction)}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${deletingTransaction?.description}"? Essa ação não pode ser desfeita.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
