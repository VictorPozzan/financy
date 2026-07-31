import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UPDATE_PROFILE } from "@/lib/graphql/mutations/user";
import { apolloClient } from "@/lib/graphql/apollo";
import { useAuthStore } from "@/stores/auth";
import { getInitials } from "@/lib/utils";
import type { User as UserType } from "@/types";

const profileSchema = z.object({
  name: z.string().min(1, "Informe seu nome completo"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "" },
  });

  const [updateProfile] = useMutation<{ updateProfile: UserType }, { data: ProfileForm }>(UPDATE_PROFILE);

  async function onSubmit(values: ProfileForm) {
    try {
      const { data } = await updateProfile({ variables: { data: values } });
      if (data?.updateProfile) {
        updateUser(data.updateProfile);
        toast.success("Perfil atualizado");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível salvar");
    }
  }

  async function handleLogout() {
    logout();
    await apolloClient.clearStore();
    navigate("/");
  }

  if (!user) return null;

  return (
    <div className="flex justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 text-lg">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-xl font-semibold text-foreground">{user.name}</h1>
          <p className="text-sm text-subtle-foreground">{user.email}</p>
        </div>

        <div className="my-6 border-t border-border" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
              <Input id="name" className="pl-10" {...register("name")} />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" value={user.email} disabled readOnly />
            <p className="text-sm text-subtle-foreground">O e-mail não pode ser alterado</p>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Salvar alterações
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={handleLogout}>
          <LogOut className="h-4 w-4 text-destructive" />
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
