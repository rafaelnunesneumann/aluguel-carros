"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerAgente } from "@/services/authService";
import { onlyDigits } from "@/lib/formatters";

const schema = z
  .object({
    razaoSocial: z.string().min(1, "Razão social é obrigatória").max(200),
    cnpj: z.string().refine((v) => onlyDigits(v).length === 14, "CNPJ deve ter 14 dígitos"),
    endereco: z.string().min(1, "Endereço é obrigatório").max(255),
    login: z.string().email("Login deve ser um e-mail válido"),
    senha: z.string().min(6, "Mínimo 6 caracteres"),
    confirmSenha: z.string().min(1, "Confirme a senha"),
    tipo: z.enum(["EMPRESA", "BANCO"], { message: "Tipo é obrigatório" }),
  })
  .refine((d) => d.senha === d.confirmSenha, {
    message: "Senhas não conferem",
    path: ["confirmSenha"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  onBack: () => void;
}

export default function RegisterAgenteForm({ onBack }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    try {
      await registerAgente({ ...data, cnpj: onlyDigits(data.cnpj) });
      toast.success("Conta criada com sucesso! Faça login.");
      router.push("/login");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? "Erro ao criar conta";
      toast.error(msg);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit -ml-2 mb-1">
          <ArrowLeft className="size-4 mr-1" /> Voltar
        </Button>
        <CardTitle>Cadastro de Empresa / Banco</CardTitle>
        <CardDescription>Preencha os dados da instituição</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="razaoSocial">Razão Social *</Label>
            <Input id="razaoSocial" {...register("razaoSocial")} />
            {errors.razaoSocial && <p className="text-destructive text-xs">{errors.razaoSocial.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input id="cnpj" placeholder="00.000.000/0000-00" {...register("cnpj")} />
            {errors.cnpj && <p className="text-destructive text-xs">{errors.cnpj.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endereco">Endereço *</Label>
            <Input id="endereco" {...register("endereco")} />
            {errors.endereco && <p className="text-destructive text-xs">{errors.endereco.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tipo">Tipo *</Label>
            <select
              id="tipo"
              {...register("tipo")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Selecione...</option>
              <option value="EMPRESA">Empresa</option>
              <option value="BANCO">Banco</option>
            </select>
            {errors.tipo && <p className="text-destructive text-xs">{errors.tipo.message}</p>}
          </div>

          <div className="border-t pt-4 flex flex-col gap-1.5">
            <Label htmlFor="login">Login (e-mail) *</Label>
            <Input id="login" type="email" {...register("login")} />
            {errors.login && <p className="text-destructive text-xs">{errors.login.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="senha">Senha *</Label>
              <Input id="senha" type="password" {...register("senha")} />
              {errors.senha && <p className="text-destructive text-xs">{errors.senha.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmSenha">Confirmar *</Label>
              <Input id="confirmSenha" type="password" {...register("confirmSenha")} />
              {errors.confirmSenha && <p className="text-destructive text-xs">{errors.confirmSenha.message}</p>}
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Criar conta
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
              Entrar
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
