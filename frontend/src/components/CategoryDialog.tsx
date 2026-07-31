import { useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CREATE_CATEGORY, UPDATE_CATEGORY } from "@/lib/graphql/mutations/categories";
import { CATEGORY_COLORS, CATEGORY_COLOR_NAMES, CATEGORY_ICON_NAMES, getCategoryIcon } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

const categorySchema = z.object({
  title: z.string().min(1, "Informe um título"),
  description: z.string().optional(),
  icon: z.string().min(1, "Selecione um ícone"),
  color: z.string().min(1, "Selecione uma cor"),
});

type CategoryForm = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSaved?: () => void;
}

export function CategoryDialog({ open, onOpenChange, category, onSaved }: CategoryDialogProps) {
  const isEditing = Boolean(category);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: "", description: "", icon: CATEGORY_ICON_NAMES[0], color: CATEGORY_COLOR_NAMES[0] },
  });

  useEffect(() => {
    if (!open) return;
    if (category) {
      reset({
        title: category.title,
        description: category.description ?? "",
        icon: category.icon,
        color: category.color,
      });
    } else {
      reset({ title: "", description: "", icon: CATEGORY_ICON_NAMES[0], color: CATEGORY_COLOR_NAMES[0] });
    }
  }, [open, category, reset]);

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    refetchQueries: ["ListCategories", "DashboardSummary"],
  });
  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: ["ListCategories", "DashboardSummary"],
  });

  async function onSubmit(values: CategoryForm) {
    try {
      if (isEditing && category) {
        await updateCategory({ variables: { id: category.id, data: values } });
        toast.success("Categoria atualizada");
      } else {
        await createCategory({ variables: { data: values } });
        toast.success("Categoria criada");
      }
      onOpenChange(false);
      onSaved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar a categoria");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar categoria" : "Nova categoria"}</DialogTitle>
          <DialogDescription>Organize suas transações com categorias</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ex. Alimentação" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="description">Descrição</Label>
              <span className="text-xs text-muted-foreground">Opcional</span>
            </div>
            <Input id="description" placeholder="Descrição da categoria" {...register("description")} />
          </div>

          <Controller
            control={control}
            name="icon"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Ícone</Label>
                <div className="grid grid-cols-8 gap-2">
                  {CATEGORY_ICON_NAMES.map((iconName) => {
                    const Icon = getCategoryIcon(iconName);
                    const active = field.value === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => field.onChange(iconName)}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg border text-muted-foreground transition-colors",
                          active ? "border-primary text-primary" : "border-border hover:bg-secondary"
                        )}
                        aria-label={iconName}
                      >
                        <Icon className="h-4 w-4" />
                      </button>
                    );
                  })}
                </div>
                {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
              </div>
            )}
          />

          <Controller
            control={control}
            name="color"
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2">
                  {CATEGORY_COLOR_NAMES.map((colorName) => {
                    const active = field.value === colorName;
                    return (
                      <button
                        key={colorName}
                        type="button"
                        onClick={() => field.onChange(colorName)}
                        className={cn(
                          "h-8 w-8 rounded-lg ring-offset-2 transition-shadow",
                          CATEGORY_COLORS[colorName].swatch,
                          active && "ring-2 ring-foreground"
                        )}
                        aria-label={colorName}
                      />
                    );
                  })}
                </div>
                {errors.color && <p className="text-sm text-destructive">{errors.color.message}</p>}
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
