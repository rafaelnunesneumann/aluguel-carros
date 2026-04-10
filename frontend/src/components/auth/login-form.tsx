"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse o sistema de aluguel de carros</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login">E-mail / Login</Label>
            <Input id="login" type="text" placeholder="seu@email.com" {...register("login")} />
            {errors.login && <p className="text-destructive text-xs">{errors.login.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" placeholder="••••••" {...register("senha")} />
            {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Entrar
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Não tem conta?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-foreground">
              Cadastre-se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
