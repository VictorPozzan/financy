import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CircleArrowDown, CircleArrowUp } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LIST_CATEGORIES } from "@/lib/graphql/queries/categories";
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from "@/lib/graphql/mutations/transactions";
import { cn } from "@/lib/utils";
import type { Category, Transaction } from "@/types";

const transactionSchema = z.object({
  type: z.enum(["EXPENSE", "INCOME"]),
  description: z.string().min(1, "Informe uma descrição"),
  date: z.string().min(1, "Informe a data"),
  amount: z
    .string()
    .min(1, "Informe um valor")
    .refine((value) => Number(value) > 0, "Informe um valor válido"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
});

type TransactionForm = z.infer<typeof transactionSchema>;

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction | null;
  onSaved?: () => void;
}

function toDateInputValue(date: string) {
  return date.slice(0, 10);
}

export function TransactionDialog({ open, onOpenChange, transaction, onSaved }: TransactionDialogProps) {
  const isEditing = Boolean(transaction);

  const { data: categoriesData } = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES, {
    skip: !open,
  });
  const categories = categoriesData?.listCategories ?? [];

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: "EXPENSE", description: "", date: "", amount: "", categoryId: "" },
  });

  useEffect(() => {
    if (!open) return;
    if (transaction) {
      reset({
        type: transaction.type,
        description: transaction.description,
        date: toDateInputValue(transaction.date),
        amount: String(transaction.amount / 100),
        categoryId: transaction.categoryId,
      });
    } else {
      reset({ type: "EXPENSE", description: "", date: "", amount: "", categoryId: "" });
    }
  }, [open, transaction, reset]);

  const dateValue = watch("date");

  const [createTransaction] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ["ListTransactions", "DashboardSummary", "ListCategories"],
  });
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: ["ListTransactions", "DashboardSummary", "ListCategories"],
  });

  async function onSubmit(values: TransactionForm) {
    const payload = {
      type: values.type,
      description: values.description,
      date: new Date(`${values.date}T00:00:00.000Z`).toISOString(),
      amount: Math.round(Number(values.amount) * 100),
      categoryId: values.categoryId,
    };

    try {
      if (isEditing && transaction) {
        await updateTransaction({ variables: { id: transaction.id, data: payload } });
        toast.success("Transação atualizada");
      } else {
        await createTransaction({ variables: { data: payload } });
        toast.success("Transação criada");
      }
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a transação");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <div className="flex rounded-xl border border-border p-2">
                <button
                  type="button"
                  onClick={() => field.onChange("EXPENSE")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-3 rounded-lg border px-3 py-3.5 text-base transition-colors",
                    field.value === "EXPENSE"
                      ? "border-category-red-icon bg-background font-medium text-foreground [&_svg]:text-category-red-icon"
                      : "border-transparent font-normal text-muted-foreground [&_svg]:text-placeholder"
                  )}
                >
                  <CircleArrowDown className="h-4 w-4" />
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange("INCOME")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-3 rounded-lg border px-3 py-3.5 text-base transition-colors",
                    field.value === "INCOME"
                      ? "border-primary bg-background font-medium text-foreground [&_svg]:text-primary"
                      : "border-transparent font-normal text-muted-foreground [&_svg]:text-placeholder"
                  )}
                >
                  <CircleArrowUp className="h-4 w-4" />
                  Receita
                </button>
              </div>
            )}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex. Almoço no restaurante" {...register("description")} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  className={cn(!dateValue && "text-transparent")}
                  {...register("date")}
                />
                {!dateValue && (
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-placeholder">
                    Selecione
                  </span>
                )}
              </div>
              {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Valor</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-foreground-muted">
                  R$
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  className="pl-9"
                  {...register("amount")}
                />
              </div>
              {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
            </div>
          </div>

          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
              </div>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
