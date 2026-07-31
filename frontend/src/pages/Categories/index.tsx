import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowUpDown, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CategoryDialog } from "@/components/CategoryDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories";
import { DELETE_CATEGORY } from "@/lib/graphql/mutations/categories";
import { getCategoryColor, getCategoryIcon } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoriesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const { data } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES);
  const categories = data?.listCategories ?? [];

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_CATEGORY, {
    refetchQueries: ["ListCategories", "DashboardSummary"],
  });

  const stats = useMemo(() => {
    const totalTransactions = categories.reduce((acc, c) => acc + c.transactionsCount, 0);
    const mostUsed = categories.reduce<Category | null>((best, current) => {
      if (current.transactionsCount === 0) return best;
      if (!best || current.transactionsCount > best.transactionsCount) return current;
      return best;
    }, null);
    return { totalCategories: categories.length, totalTransactions, mostUsed };
  }, [categories]);

  const MostUsedIcon = stats.mostUsed ? getCategoryIcon(stats.mostUsed.icon) : Tag;

  async function handleDelete() {
    if (!deletingCategory) return;
    try {
      await deleteCategory({ variables: { id: deletingCategory.id } });
      toast.success("Categoria excluída");
      setDeletingCategory(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível excluir");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground">Organize suas transações por categorias</p>
        </div>
        <Button
          onClick={() => {
            setEditingCategory(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-3">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xl font-bold text-foreground">{stats.totalCategories}</p>
            <p className="text-xs text-muted-foreground">total de categorias</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xl font-bold text-foreground">{stats.totalTransactions}</p>
            <p className="text-xs text-muted-foreground">total de transações</p>
          </div>
        </Card>
        <Card className="flex items-center gap-3">
          <MostUsedIcon className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="text-xl font-bold text-foreground">{stats.mostUsed?.title ?? "-"}</p>
            <p className="text-xs text-muted-foreground">categoria mais utilizada</p>
          </div>
        </Card>
      </div>

      {categories.length === 0 && (
        <Card className="py-10 text-center text-sm text-muted-foreground">Nenhuma categoria criada ainda</Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.icon);
          const colors = getCategoryColor(category.color);
          return (
            <Card key={category.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colors.bg)}>
                  <Icon className={cn("h-5 w-5", colors.text)} />
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setEditingCategory(category);
                      setDialogOpen(true);
                    }}
                    aria-label="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline-destructive"
                    size="icon"
                    onClick={() => setDeletingCategory(category)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground">{category.title}</p>
                {category.description && (
                  <p className="mt-0.5 text-sm text-muted-foreground">{category.description}</p>
                )}
              </div>
              <div className="flex items-center justify-between">
                <Badge className={cn(colors.bg, colors.text)}>{category.title}</Badge>
                <span className="text-sm text-muted-foreground">
                  {category.transactionsCount} {category.transactionsCount === 1 ? "item" : "itens"}
                </span>
              </div>
              {category.totalAmount > 0 && (
                <p className="text-sm font-medium text-foreground">{formatCurrency(category.totalAmount)}</p>
              )}
            </Card>
          );
        })}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={editingCategory} />
      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${deletingCategory?.title}"? Categorias com transações vinculadas não podem ser excluídas.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  );
}
