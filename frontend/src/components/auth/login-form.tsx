"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { login as authLogin } from "@/services/authService";

const schema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      const user = await authLogin(data.login, data.senha);
      signIn(user);
      router.replace("/");
    } catch {
      toast.error("Credenciais inválidas. Verifique login e senha.");
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="divider-red w-10 mb-4" />
        <h2 className="font-heading text-3xl font-bold tracking-wide">Bem-vindo</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Acesse sua conta para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login" className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            E-mail / Login
          </Label>
          <Input
            id="login"
            type="text"
            placeholder="seu@email.com"
            className="bg-card border-border/60 h-11 focus-visible:ring-primary/60 focus-visible:border-primary/60"
            {...register("login")}
          />
          {errors.login && (
            <p className="text-destructive text-xs">{errors.login.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="senha" className="text-sm font-medium tracking-wide uppercase text-muted-foreground">
            Senha
          </Label>
          <Input
            id="senha"
            type="password"
            placeholder="••••••••"
            className="bg-card border-border/60 h-11 focus-visible:ring-primary/60 focus-visible:border-primary/60"
            {...register("senha")}
          />
          {errors.senha && (
            <p className="text-destructive text-xs">{errors.senha.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 mt-2 btn-shimmer font-heading font-semibold tracking-widest uppercase text-sm gap-2 border-0"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <LogIn className="size-4" />
          )}
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground tracking-widest">ou</span>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/register"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Cadastre-se gratuitamente
          </Link>
        </p>
      </form>
    </div>
  );
}
