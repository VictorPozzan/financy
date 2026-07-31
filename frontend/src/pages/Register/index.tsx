import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, LogIn, Mail, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { REGISTER } from "@/lib/graphql/mutations/auth";
import { apolloClient } from "@/lib/graphql/apollo";
import { useAuthStore } from "@/stores/auth";
import type { AuthPayload } from "@/types";

const registerSchema = z.object({
  name: z.string().min(1, "Informe seu nome completo"),
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(8, "A senha deve ter no mínimo 8 caracteres"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const [registerMutation] = useMutation<{ register: AuthPayload }, { data: RegisterForm }>(REGISTER);

  async function onSubmit(data: RegisterForm) {
    try {
      const { data: result } = await registerMutation({ variables: { data } });
      if (result?.register) {
        await apolloClient.clearStore();
        setAuth(result.register);
        navigate("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a conta");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo className="mb-8" />

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-foreground">Criar conta</h1>
          <p className="mt-1 text-sm text-muted-foreground">Comece a controlar suas finanças ainda hoje</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
              <Input
                id="name"
                placeholder="Seu nome completo"
                className="pl-10"
                {...registerField("name")}
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
              <Input
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                className="pl-10"
                {...registerField("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-placeholder" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="px-10"
                {...registerField("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : (
              <p className="text-sm text-subtle-foreground">A senha deve ter no mínimo 8 caracteres</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Cadastrar
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-subtle-foreground">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="mb-4 text-center text-sm text-muted-foreground">Já tem uma conta?</p>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/">
            <LogIn className="h-4 w-4" />
            Fazer login
          </Link>
        </Button>
      </div>
    </div>
  );
}
