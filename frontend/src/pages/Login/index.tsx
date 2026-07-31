import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, LogIn, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LOGIN } from "@/lib/graphql/mutations/auth";
import { apolloClient } from "@/lib/graphql/apollo";
import { useAuthStore } from "@/stores/auth";
import type { AuthPayload } from "@/types";

const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  password: z.string().min(1, "Informe sua senha"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const [login] = useMutation<{ login: AuthPayload }, { data: LoginForm }>(LOGIN);

  async function onSubmit(data: LoginForm) {
    try {
      const { data: result } = await login({ variables: { data } });
      if (result?.login) {
        await apolloClient.clearStore();
        setAuth(result.login);
        navigate("/");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo className="mb-8" />

      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Fazer login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="mail@exemplo.com"
                className="pl-10"
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                className="px-10"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-foreground">
              <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
              Lembrar-me
            </label>
            <button type="button" className="font-medium text-primary hover:underline">
              Recuperar senha
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <LogIn className="h-4 w-4" />
            Entrar
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          ou
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="mb-4 text-center text-sm text-muted-foreground">Ainda não tem uma conta?</p>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/cadastro">
            <UserPlus className="h-4 w-4" />
            Criar conta
          </Link>
        </Button>
      </div>
    </div>
  );
}
